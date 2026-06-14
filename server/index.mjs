import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { createReadStream, existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const publicDir = path.resolve(__dirname, '../apps/web/dist');
const port = Number(process.env.PORT || 80);

const calApiBaseUrl = trimTrailingSlash(process.env.CAL_API_BASE_URL || 'https://cal.hazyforge.io/api');
const calApiKey = process.env.CAL_API_KEY || process.env.CAL_ACCESS_TOKEN || '';
const calSlotsApiVersion = process.env.CAL_SLOTS_API_VERSION || '2024-09-04';
const calBookingsApiVersion = process.env.CAL_BOOKINGS_API_VERSION || '2026-02-25';
const calUsername = process.env.ACADEMY_CAL_USERNAME || 'palehazy';
const calEventTypeSlug = process.env.ACADEMY_CAL_EVENT_TYPE_SLUG || '30min';
const defaultTimeZone = process.env.ACADEMY_CAL_TIME_ZONE || 'America/Chicago';

const mimeTypes = new Map([
  ['.css', 'text/css; charset=utf-8'],
  ['.html', 'text/html; charset=utf-8'],
  ['.ico', 'image/x-icon'],
  ['.js', 'text/javascript; charset=utf-8'],
  ['.json', 'application/json; charset=utf-8'],
  ['.png', 'image/png'],
  ['.svg', 'image/svg+xml'],
  ['.txt', 'text/plain; charset=utf-8'],
  ['.webp', 'image/webp'],
]);

function trimTrailingSlash(value) {
  return value.replace(/\/+$/, '');
}

function sendJson(response, statusCode, payload) {
  response.writeHead(statusCode, {
    'Access-Control-Allow-Headers': 'Authorization, Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Origin': '*',
    'Content-Type': 'application/json; charset=utf-8',
  });
  response.end(JSON.stringify(payload));
}

function sendText(response, statusCode, body) {
  response.writeHead(statusCode, {
    'Access-Control-Allow-Origin': '*',
    'Content-Type': 'text/plain; charset=utf-8',
  });
  response.end(body);
}

async function readRequestJson(request) {
  let body = '';
  for await (const chunk of request) {
    body += chunk;
    if (body.length > 32_000) {
      throw new Error('Request body is too large.');
    }
  }
  return body ? JSON.parse(body) : {};
}

function getCalHeaders(apiVersion) {
  const headers = {
    'Accept': 'application/json',
    'cal-api-version': apiVersion,
  };

  if (calApiKey) {
    headers.Authorization = `Bearer ${calApiKey}`;
  }

  return headers;
}

async function proxyCalResponse(response, calResponse) {
  const text = await calResponse.text();
  const contentType = calResponse.headers.get('content-type') || '';
  let payload;

  try {
    payload = text && contentType.includes('application/json') ? JSON.parse(text) : null;
  } catch {
    payload = null;
  }

  if (!calResponse.ok) {
    sendJson(response, calResponse.status, {
      status: 'error',
      message:
        payload?.message ||
        payload?.error?.message ||
        `Cal.diy request failed with status ${calResponse.status}.`,
      calStatus: calResponse.status,
      calResponse: payload ?? {
        contentType,
        bodyPreview: text.slice(0, 240),
      },
    });
    return;
  }

  sendJson(response, calResponse.status, payload ?? { status: 'success', data: null });
}

async function handleSchedulingSlots(request, response, url) {
  const start = url.searchParams.get('start');
  const end = url.searchParams.get('end');
  const timeZone = url.searchParams.get('timeZone') || defaultTimeZone;

  if (!start || !end) {
    sendJson(response, 400, {
      status: 'error',
      message: 'start and end query parameters are required.',
    });
    return;
  }

  const calUrl = new URL('v2/slots', `${calApiBaseUrl}/`);
  calUrl.searchParams.set('eventTypeSlug', calEventTypeSlug);
  calUrl.searchParams.set('username', calUsername);
  calUrl.searchParams.set('start', start);
  calUrl.searchParams.set('end', end);
  calUrl.searchParams.set('timeZone', timeZone);

  const calResponse = await fetch(calUrl, {
    headers: getCalHeaders(calSlotsApiVersion),
  });
  await proxyCalResponse(response, calResponse);
}

async function handleSchedulingBooking(request, response) {
  const body = await readRequestJson(request);
  const start = typeof body.start === 'string' ? body.start : '';
  const name = typeof body.name === 'string' ? body.name.trim() : '';
  const email = typeof body.email === 'string' ? body.email.trim() : '';
  const notes = typeof body.notes === 'string' ? body.notes.trim() : '';
  const timeZone = typeof body.timeZone === 'string' && body.timeZone ? body.timeZone : defaultTimeZone;

  if (!start || !name || !email) {
    sendJson(response, 400, {
      status: 'error',
      message: 'start, name, and email are required.',
    });
    return;
  }

  const calResponse = await fetch(new URL('v2/bookings', `${calApiBaseUrl}/`), {
    body: JSON.stringify({
      attendee: {
        email,
        language: 'en',
        name,
        timeZone,
      },
      bookingFieldsResponses: notes ? { notes } : undefined,
      eventTypeSlug: calEventTypeSlug,
      lengthInMinutes: 30,
      metadata: {
        source: 'hazyforge-academy-mobile',
      },
      start,
      username: calUsername,
    }),
    headers: {
      ...getCalHeaders(calBookingsApiVersion),
      'Content-Type': 'application/json',
    },
    method: 'POST',
  });
  await proxyCalResponse(response, calResponse);
}

async function serveStatic(response, pathname) {
  const requestedPath = pathname === '/' ? '/index.html' : pathname;
  const resolvedPath = path.resolve(publicDir, `.${requestedPath}`);

  if (!resolvedPath.startsWith(publicDir)) {
    sendText(response, 403, 'Forbidden');
    return;
  }

  const filePath = existsSync(resolvedPath) ? resolvedPath : path.join(publicDir, 'index.html');
  const extension = path.extname(filePath);

  response.writeHead(200, {
    'Content-Type': mimeTypes.get(extension) || 'application/octet-stream',
  });
  createReadStream(filePath).pipe(response);
}

const server = createServer(async (request, response) => {
  try {
    if (request.method === 'OPTIONS') {
      sendJson(response, 204, {});
      return;
    }

    const url = new URL(request.url || '/', `http://${request.headers.host || 'localhost'}`);

    if (url.pathname === '/healthz') {
      sendText(response, 200, 'ok');
      return;
    }

    if (url.pathname === '/api/scheduling/config' && request.method === 'GET') {
      sendJson(response, 200, {
        eventTypeSlug: calEventTypeSlug,
        owner: calUsername,
        timeZone: defaultTimeZone,
      });
      return;
    }

    if (url.pathname === '/api/scheduling/slots' && request.method === 'GET') {
      await handleSchedulingSlots(request, response, url);
      return;
    }

    if (url.pathname === '/api/scheduling/bookings' && request.method === 'POST') {
      await handleSchedulingBooking(request, response);
      return;
    }

    if (url.pathname.startsWith('/api/')) {
      sendJson(response, 404, { status: 'error', message: 'Not found.' });
      return;
    }

    await serveStatic(response, url.pathname);
  } catch (error) {
    sendJson(response, 500, {
      status: 'error',
      message: error instanceof Error ? error.message : 'Unexpected server error.',
    });
  }
});

try {
  await readFile(path.join(publicDir, 'index.html'), 'utf8');
} catch {
  console.warn(`Static web build was not found at ${publicDir}. Run pnpm build before starting.`);
}

server.listen(port, () => {
  console.log(`Hazy Forge Academy server listening on :${port}`);
});

import { authenticatedApiJson } from '@/services/api-client';

export type SchedulingSlot = {
  end?: string;
  start: string;
};

export type SchedulingSlotsByDay = Record<string, SchedulingSlot[]>;

type CalSlotsResponse = {
  data?: SchedulingSlotsByDay;
  status: 'success' | 'error';
};

type CreateBookingResponse = {
  data?: {
    id?: number;
    uid?: string;
    title?: string;
  };
  status: 'success' | 'error';
};

export type CreateBookingInput = {
  email: string;
  name: string;
  notes?: string;
  start: string;
  timeZone: string;
};

export async function getSchedulingSlots(params: {
  end: string;
  start: string;
  timeZone: string;
}): Promise<SchedulingSlotsByDay> {
  const query = new URLSearchParams({
    end: params.end,
    start: params.start,
    timeZone: params.timeZone,
  });
  const response = await authenticatedApiJson<CalSlotsResponse>(`/api/scheduling/slots?${query}`);
  return response.data ?? {};
}

export async function createSchedulingBooking(input: CreateBookingInput) {
  const response = await authenticatedApiJson<CreateBookingResponse>('/api/scheduling/bookings', {
    body: JSON.stringify(input),
    headers: {
      'Content-Type': 'application/json',
    },
    method: 'POST',
  });

  return response.data;
}

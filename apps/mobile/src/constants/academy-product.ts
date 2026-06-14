export const academyBooking = {
  baseUrl: 'https://cal.hazyforge.io/palehazy/30min',
  embedUrl: 'https://cal.hazyforge.io/palehazy/30min?embed=true&theme=dark',
  owner: 'palehazy',
  duration: '30 min',
} as const;

export const classPassState = {
  hasActivePass: process.env.EXPO_PUBLIC_ACADEMY_CLASS_PASS === 'active',
  label:
    process.env.EXPO_PUBLIC_ACADEMY_CLASS_PASS === 'active'
      ? 'Class pass active'
      : 'Class pass required',
} as const;

export const academyClasses = [
  {
    id: 'computer-confidence',
    name: 'First Computer Confidence',
    format: '1:1 or family',
    schedule: 'Fit call first',
    accent: '#50D8FA',
    requiresPass: false,
    outcome: 'Files, accounts, browser safety, passwords, daily machine habits.',
  },
  {
    id: 'pc-build',
    name: 'Build Your First PC',
    format: 'workshop series',
    schedule: 'Build day planned',
    accent: '#F3B95F',
    requiresPass: true,
    outcome: 'Parts list, assembly plan, troubleshooting, and upgrade judgment.',
  },
  {
    id: 'ai-builder-lab',
    name: 'AI Builder Lab',
    format: 'project sprint',
    schedule: 'Weekly lab',
    accent: '#3FCF8F',
    requiresPass: true,
    outcome: 'Prompting, verification, privacy, model limits, and a useful prototype.',
  },
  {
    id: 'first-website',
    name: 'Ship A First Website',
    format: 'portfolio track',
    schedule: 'After intake',
    accent: '#A9F2DD',
    requiresPass: true,
    outcome: 'HTML, CSS, deployment, domain basics, and a live page to share.',
  },
] as const;

export const contactOptions = [
  {
    id: 'message',
    label: 'Message Haze',
    detail: 'Direct chat line setup later',
    signal: 'async',
    accent: '#50D8FA',
  },
  {
    id: 'voice',
    label: 'Voice line',
    detail: 'VoIP setup later',
    signal: 'live',
    accent: '#3FCF8F',
  },
  {
    id: 'email',
    label: 'Email',
    detail: 'contact@hazyforge.io',
    signal: 'fallback',
    accent: '#F3B95F',
  },
] as const;

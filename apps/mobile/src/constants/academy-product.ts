export const academyBooking = {
  baseUrl: 'https://cal.hazyforge.io/palehazy/30min',
  embedUrl: 'https://cal.hazyforge.io/palehazy/30min?embed=true&theme=light',
  owner: 'palehazy',
  duration: '30 min',
} as const;

export const classPassState = {
  hasActivePass: process.env.EXPO_PUBLIC_ACADEMY_CLASS_PASS === 'active',
  label:
    process.env.EXPO_PUBLIC_ACADEMY_CLASS_PASS === 'active'
      ? 'Class pass active'
      : 'Pass needed for paid tracks',
} as const;

export const academyClasses = [
  {
    id: 'computer-confidence',
    name: 'First Computer Confidence',
    format: '1:1 or family',
    schedule: 'Fit call first',
    accent: '#2B8DBD',
    requiresPass: false,
    outcome: 'Files, accounts, browser safety, passwords, and everyday machine habits.',
  },
  {
    id: 'pc-build',
    name: 'Build Your First PC',
    format: 'workshop series',
    schedule: 'Build day planned',
    accent: '#C77D12',
    requiresPass: true,
    outcome: 'Parts list, assembly plan, troubleshooting, and upgrade judgment.',
  },
  {
    id: 'ai-builder-lab',
    name: 'AI Builder Lab',
    format: 'project sprint',
    schedule: 'Weekly lab',
    accent: '#2F7D3B',
    requiresPass: true,
    outcome: 'Prompting, verification, privacy, model limits, and a useful prototype.',
  },
  {
    id: 'first-website',
    name: 'Ship A First Website',
    format: 'portfolio track',
    schedule: 'After intake',
    accent: '#B96B4E',
    requiresPass: true,
    outcome: 'HTML, CSS, deployment, domain basics, and a live page to share.',
  },
] as const;

export const contactOptions = [
  {
    id: 'message',
    label: 'Message Haze',
    detail: 'For class questions, project ideas, and quick check-ins.',
    signal: 'soon',
    accent: '#2B8DBD',
  },
  {
    id: 'voice',
    label: 'Voice line',
    detail: 'For the moments where talking it through is easier.',
    signal: 'soon',
    accent: '#2F7D3B',
  },
  {
    id: 'email',
    label: 'Email',
    detail: 'contact@hazyforge.io',
    signal: 'fallback',
    accent: '#C77D12',
  },
] as const;

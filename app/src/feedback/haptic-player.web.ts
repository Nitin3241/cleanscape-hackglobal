import { SIGNATURES } from './events.generated';

const PATTERNS: Record<string, number | number[]> = {
  selection: 5,
  'impact:light': 10,
  'impact:soft': 10,
  'impact:medium': 15,
  'impact:rigid': 20,
  'notification:success': [10, 40, 10],
  'notification:warning': [20, 60, 20],
  'notification:error': [30, 60, 30],
};

function signaturePattern(name: keyof typeof SIGNATURES) {
  const pattern: number[] = [];
  SIGNATURES[name].forEach(({ at }, index, steps) => {
    const next = steps[index + 1]?.at ?? at + 20;
    pattern.push(10, next - at - 10);
  });
  return pattern;
}

/** Only some Android browsers can vibrate. Everywhere else this does nothing. */
export function playHaptic(haptic: string) {
  const pattern = haptic.startsWith('signature:')
    ? signaturePattern(haptic.split(':')[1] as keyof typeof SIGNATURES)
    : PATTERNS[haptic];
  if (pattern !== undefined && typeof navigator !== 'undefined') navigator.vibrate?.(pattern);
}

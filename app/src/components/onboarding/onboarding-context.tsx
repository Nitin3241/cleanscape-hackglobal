import { createContext, ReactNode, useContext, useState } from 'react';

type OnboardingState = {
  phone: string;
  setPhone: (phone: string) => void;
};

const OnboardingContext = createContext<OnboardingState | null>(null);

/**
 * What one onboarding screen needs from another. It's held in memory only and
 * forgotten when the app closes. Birthday and guardian contact are never kept.
 */
export function OnboardingProvider({ children }: { children: ReactNode }) {
  const [phone, setPhone] = useState('');
  return <OnboardingContext.Provider value={{ phone, setPhone }}>{children}</OnboardingContext.Provider>;
}

export function useOnboarding() {
  const state = useContext(OnboardingContext);
  if (!state) throw new Error('useOnboarding must be used inside OnboardingProvider');
  return state;
}

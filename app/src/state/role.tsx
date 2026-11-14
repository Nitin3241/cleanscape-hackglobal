import { createContext, ReactNode, useContext, useMemo, useState } from 'react';

/** Whose point of view a screen shows. The organiser view comes later. */
export type Role = 'volunteer' | 'crewHead';

type RoleState = { role: Role; setRole: (role: Role) => void };

const RoleContext = createContext<RoleState | null>(null);

/** Demo only: lets the volunteer and crew-head screens be shown from one install. */
export function RoleProvider({ children }: { children: ReactNode }) {
  const [role, setRole] = useState<Role>('volunteer');
  const value = useMemo(() => ({ role, setRole }), [role]);
  return <RoleContext.Provider value={value}>{children}</RoleContext.Provider>;
}

export function useRole() {
  const value = useContext(RoleContext);
  if (!value) throw new Error('useRole must be used inside RoleProvider');
  return value;
}

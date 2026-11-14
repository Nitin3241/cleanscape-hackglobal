import { createContext, ReactNode, useContext, useEffect, useMemo, useRef, useState } from 'react';

/** Where the user's place at a cleanup stands. */
export type RegistrationStatus = 'none' | 'going' | 'waiting' | 'declined' | 'waitlisted';

/** What a guardian decided for an under-18 registration. `transit` allows public transport only. */
export type GuardianAnswer = 'pending' | 'approved' | 'transit' | 'declined';

export type RideStatus = 'none' | 'requested' | 'accepted' | 'driverCancelled';

type State = {
  eventId: string | null;
  status: RegistrationStatus;
  friends: number;
  under18: boolean;
  guardian: GuardianAnswer;
  /** Masked, for showing where the link went. The full number isn't kept. */
  guardianPhone: string;
  guardianChannel: 'WhatsApp' | 'SMS';
  walletAdded: boolean;
  rideId: string | null;
  ride: RideStatus;
  offeredRide: boolean;
  licenceAdded: boolean;
  /** Set when a waitlisted spot turns into a place, so the app can say so. */
  spotOpened: boolean;
};

const INITIAL: State = {
  eventId: null,
  status: 'none',
  friends: 0,
  under18: false,
  guardian: 'pending',
  guardianPhone: '',
  guardianChannel: 'WhatsApp',
  walletAdded: false,
  rideId: null,
  ride: 'none',
  offeredRide: false,
  licenceAdded: false,
  spotOpened: false,
};

// SAMPLE: with no events service, waiting states resolve on their own so every screen can be seen.
// Figma E5 → E6: auto 3.5 s.
const SPOT_OPENS_AFTER = 3500;
const DRIVER_ACCEPTS_AFTER = 6000;

function useRegistrationState() {
  const [state, setState] = useState<State>(INITIAL);
  const beforeCancel = useRef<State | null>(null);
  const update = (changes: Partial<State>) => setState((current) => ({ ...current, ...changes }));

  useEffect(() => {
    if (state.status !== 'waitlisted') return;
    const timer = setTimeout(() => update({ status: 'going', spotOpened: true }), SPOT_OPENS_AFTER);
    return () => clearTimeout(timer);
  }, [state.status]);

  useEffect(() => {
    if (state.ride !== 'requested') return;
    const timer = setTimeout(() => update({ ride: 'accepted' }), DRIVER_ACCEPTS_AFTER);
    return () => clearTimeout(timer);
  }, [state.ride]);

  return useMemo(
    () => ({
      ...state,
      register(eventId: string, friends: number) {
        update({ eventId, friends, status: 'going', under18: false, guardian: 'approved' });
      },
      requestGuardian(eventId: string, guardianPhone: string, guardianChannel: 'WhatsApp' | 'SMS') {
        update({ eventId, friends: 0, status: 'waiting', under18: true, guardian: 'pending', guardianPhone, guardianChannel });
      },
      /** SAMPLE: stands in for the guardian's reply arriving by SMS or WhatsApp. */
      answerAsGuardian(answer: GuardianAnswer) {
        update({ guardian: answer, status: answer === 'declined' ? 'declined' : answer === 'pending' ? 'waiting' : 'going' });
      },
      joinWaitlist(eventId: string) {
        update({ eventId, status: 'waitlisted', friends: 0 });
      },
      leaveWaitlist() {
        update({ eventId: null, status: 'none' });
      },
      /** Cancels the user's own place. Friends keep theirs unless the screen cancels them too. */
      cancel() {
        beforeCancel.current = state;
        update({ eventId: null, status: 'none', friends: 0, walletAdded: false, rideId: null, ride: 'none' });
      },
      undoCancel() {
        if (beforeCancel.current) setState(beforeCancel.current);
        beforeCancel.current = null;
      },
      /** Back to a fresh start, for replaying the demo from Home. */
      reset() {
        beforeCancel.current = null;
        setState(INITIAL);
      },
      addToWallet() {
        update({ walletAdded: true });
      },
      requestRide(rideId: string) {
        update({ rideId, ride: 'requested' });
      },
      cancelRide() {
        update({ rideId: null, ride: 'none' });
      },
      /** SAMPLE: stands in for a driver cancelling, to show the rematch. */
      driverCancels() {
        update({ ride: 'driverCancelled' });
      },
      takeRide(rideId: string) {
        update({ rideId, ride: 'accepted' });
      },
      publishRide() {
        update({ offeredRide: true });
      },
      addLicence() {
        update({ licenceAdded: true });
      },
      clearSpotOpened() {
        update({ spotOpened: false });
      },
    }),
    [state],
  );
}

type Registration = ReturnType<typeof useRegistrationState>;

const RegistrationContext = createContext<Registration | null>(null);

/**
 * The user's registration, pass, Wallet and ride, shared by the F1 and F2 screens.
 * It's held in memory only and forgotten when the app closes.
 */
export function RegistrationProvider({ children }: { children: ReactNode }) {
  const registration = useRegistrationState();
  return <RegistrationContext.Provider value={registration}>{children}</RegistrationContext.Provider>;
}

export function useRegistration() {
  const registration = useContext(RegistrationContext);
  if (!registration) throw new Error('useRegistration must be used inside RegistrationProvider');
  return registration;
}

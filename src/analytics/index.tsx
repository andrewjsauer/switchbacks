import { getAnalytics, logEvent } from 'firebase/analytics';

const fireEvent = (eventName: string, eventProperties: any) => {
  if (typeof window === 'undefined' && process.env.NODE_ENV === 'development') return;

  const analytics = getAnalytics();
  logEvent(analytics, eventName, eventProperties);
};

export default fireEvent;

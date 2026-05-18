/** True when the event date/time is still in the future. */
export function isUpcomingEvent(eventDate: Date): boolean {
  return eventDate.getTime() > Date.now();
}

import { useMemo } from "react";

export type EventStatus = "upcoming" | "ongoing" | "completed";

export function useEventStatus(
  eventDate: Date,
  eventTime?: string,
): EventStatus {
  return useMemo(() => {
    const now = new Date();

    const eventDateTime = new Date(eventDate);
    if (eventTime) {
      const [hours, minutes] = eventTime.split(":").map(Number);
      eventDateTime.setHours(hours, minutes || 0, 0, 0);
    }

    if (now.toDateString() === eventDateTime.toDateString()) {
      return "ongoing";
    }
    return now < eventDateTime ? "upcoming" : "completed";
  }, [eventDate, eventTime]);
}

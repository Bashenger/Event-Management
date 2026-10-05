import { useMemo } from 'react';

export const useRecommendations = (currentEvent, allEvents = [], limit = 3) => {
  return useMemo(() => {
    if (!currentEvent || !Array.isArray(allEvents)) return [];

    const currentId = currentEvent._id;
    const currentType = currentEvent.eventType;
    const currentSpeaker = currentEvent.resourcePerson?.toLowerCase();
    const currentTags = Array.isArray(currentEvent.tags)
      ? currentEvent.tags.map((t) => t.toLowerCase())
      : [];

    const scoredEvents = allEvents
      .filter((event) => event._id !== currentId && event.status !== 'Completed')
      .map((event) => {
        let score = 0;

        // 1. Same Event Type gets +3 points
        if (event.eventType === currentType) {
          score += 3;
        }

        // 2. Same Speaker gets +4 points
        if (event.resourcePerson?.toLowerCase() === currentSpeaker) {
          score += 4;
        }

        // 3. Shared Tags get +2 points each
        if (Array.isArray(event.tags)) {
          event.tags.forEach((tag) => {
            if (currentTags.includes(tag.toLowerCase())) {
              score += 2;
            }
          });
        }

        // 4. Boost upcoming events with available seats
        if (event.availableSeats > 0) {
          score += 1;
        }

        return { event, score };
      });

    // Sort by score descending, then by date soonest
    return scoredEvents
      .sort((a, b) => {
        if (b.score !== a.score) return b.score - a.score;
        return new Date(a.event.eventDate) - new Date(b.event.eventDate);
      })
      .slice(0, limit)
      .map((item) => item.event);
  }, [currentEvent, allEvents, limit]);
};

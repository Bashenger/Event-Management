import { useState, useMemo, useCallback } from 'react';

export const useEventFilter = (events = []) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [selectedStatuses, setSelectedStatuses] = useState([]);
  const [availabilityFilter, setAvailabilityFilter] = useState('all'); // 'all' | 'available' | 'filling-fast' | 'sold-out'
  const [dateFilter, setDateFilter] = useState('all'); // 'all' | 'today' | 'this-week' | 'this-month' | 'upcoming' | 'custom'
  const [customStartDate, setCustomStartDate] = useState('');
  const [customEndDate, setCustomEndDate] = useState('');
  const [sortBy, setSortBy] = useState('soonest'); // 'soonest' | 'latest' | 'popular' | 'seats-desc' | 'seats-asc' | 'name-asc' | 'name-desc'

  // Toggle single category pill in multi-select array
  const toggleType = useCallback((type) => {
    setSelectedTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  }, []);

  // Toggle single status pill in multi-select array
  const toggleStatus = useCallback((status) => {
    setSelectedStatuses((prev) =>
      prev.includes(status) ? prev.filter((s) => s !== status) : [...prev, status]
    );
  }, []);

  // Reset all filters to initial state
  const resetFilters = useCallback(() => {
    setSearchTerm('');
    setSelectedTypes([]);
    setSelectedStatuses([]);
    setAvailabilityFilter('all');
    setDateFilter('all');
    setCustomStartDate('');
    setCustomEndDate('');
    setSortBy('soonest');
  }, []);

  // Memoized filtered & sorted events array
  const filteredEvents = useMemo(() => {
    if (!Array.isArray(events)) return [];

    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const endOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);

    const startOfWeek = new Date(startOfToday);
    startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(endOfWeek.getDate() + 6);
    endOfWeek.setHours(23, 59, 59, 999);

    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);

    return events
      .filter((event) => {
        // 1. Text Search Filter (title, speaker, venue, description, tags)
        if (searchTerm.trim() !== '') {
          const query = searchTerm.toLowerCase().trim();
          const matchTitle = event.eventName?.toLowerCase().includes(query);
          const matchSpeaker = event.resourcePerson?.toLowerCase().includes(query);
          const matchVenue = event.venue?.toLowerCase().includes(query);
          const matchDesc = event.eventDescription?.toLowerCase().includes(query);
          const matchTags = Array.isArray(event.tags) && event.tags.some((t) => t.toLowerCase().includes(query));

          if (!matchTitle && !matchSpeaker && !matchVenue && !matchDesc && !matchTags) {
            return false;
          }
        }

        // 2. Category / Event Type Filter
        if (selectedTypes.length > 0) {
          if (!selectedTypes.includes(event.eventType)) {
            return false;
          }
        }

        // 3. Event Status Filter
        if (selectedStatuses.length > 0) {
          if (!selectedStatuses.includes(event.status)) {
            return false;
          }
        }

        // 4. Seat Availability Filter
        const max = Number(event.maxParticipants) || 1;
        const available = Number(event.availableSeats) || 0;
        const remainingPercentage = (available / max) * 100;

        if (availabilityFilter === 'available') {
          if (available <= 0) return false;
        } else if (availabilityFilter === 'filling-fast') {
          // Filling fast: between 1 and 20% seats left
          if (available <= 0 || remainingPercentage > 20) return false;
        } else if (availabilityFilter === 'sold-out') {
          if (available > 0) return false;
        }

        // 5. Date Filter
        const eventDate = new Date(event.eventDate);
        if (isNaN(eventDate.getTime())) return true;

        if (dateFilter === 'today') {
          if (eventDate < startOfToday || eventDate > endOfToday) return false;
        } else if (dateFilter === 'this-week') {
          if (eventDate < startOfWeek || eventDate > endOfWeek) return false;
        } else if (dateFilter === 'this-month') {
          if (eventDate < startOfMonth || eventDate > endOfMonth) return false;
        } else if (dateFilter === 'upcoming') {
          if (eventDate < now) return false;
        } else if (dateFilter === 'custom') {
          if (customStartDate) {
            const start = new Date(customStartDate);
            if (eventDate < start) return false;
          }
          if (customEndDate) {
            const end = new Date(customEndDate);
            end.setHours(23, 59, 59, 999);
            if (eventDate > end) return false;
          }
        }

        return true;
      })
      .sort((a, b) => {
        const dateA = new Date(a.eventDate).getTime() || 0;
        const dateB = new Date(b.eventDate).getTime() || 0;

        switch (sortBy) {
          case 'soonest':
            return dateA - dateB;

          case 'latest':
            return dateB - dateA;

          case 'popular': {
            const fillRateA = ((a.maxParticipants - a.availableSeats) / (a.maxParticipants || 1)) * 100;
            const fillRateB = ((b.maxParticipants - b.availableSeats) / (b.maxParticipants || 1)) * 100;
            return fillRateB - fillRateA;
          }

          case 'seats-desc':
            return (b.availableSeats || 0) - (a.availableSeats || 0);

          case 'seats-asc':
            return (a.availableSeats || 0) - (b.availableSeats || 0);

          case 'name-asc':
            return (a.eventName || '').localeCompare(b.eventName || '');

          case 'name-desc':
            return (b.eventName || '').localeCompare(a.eventName || '');

          default:
            return dateA - dateB;
        }
      });
  }, [
    events,
    searchTerm,
    selectedTypes,
    selectedStatuses,
    availabilityFilter,
    dateFilter,
    customStartDate,
    customEndDate,
    sortBy,
  ]);

  // Check if any filter is actively applied
  const isFiltered = useMemo(() => {
    return (
      searchTerm.trim() !== '' ||
      selectedTypes.length > 0 ||
      selectedStatuses.length > 0 ||
      availabilityFilter !== 'all' ||
      dateFilter !== 'all' ||
      customStartDate !== '' ||
      customEndDate !== '' ||
      sortBy !== 'soonest'
    );
  }, [
    searchTerm,
    selectedTypes,
    selectedStatuses,
    availabilityFilter,
    dateFilter,
    customStartDate,
    customEndDate,
    sortBy,
  ]);

  return {
    searchTerm,
    setSearchTerm,
    selectedTypes,
    setSelectedTypes,
    toggleType,
    selectedStatuses,
    setSelectedStatuses,
    toggleStatus,
    availabilityFilter,
    setAvailabilityFilter,
    dateFilter,
    setDateFilter,
    customStartDate,
    setCustomStartDate,
    customEndDate,
    setCustomEndDate,
    sortBy,
    setSortBy,
    filteredEvents,
    isFiltered,
    resetFilters,
  };
};

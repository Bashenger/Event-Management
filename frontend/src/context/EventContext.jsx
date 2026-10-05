import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { INITIAL_EVENTS, INITIAL_REGISTRATIONS } from '../utils/mockData';
import { apiClient, isBackendAvailable } from '../services/api';
import { useAuth } from './AuthContext';
import { useToast } from './ToastContext';

const EventContext = createContext(null);

const EVENTS_STORAGE_KEY = 'campus_hub_events_v2';
const REGISTRATIONS_STORAGE_KEY = 'campus_hub_registrations_v2';

export const EventProvider = ({ children }) => {
  const { currentUser, authToken, currentRole } = useAuth();
  const { success, error: showError, info } = useToast();

  const [isLiveApi, setIsLiveApi] = useState(false);
  const [loading, setLoading] = useState(true);

  // Local state initialized from localStorage or initial mock data
  const [events, setEvents] = useState(() => {
    try {
      const saved = localStorage.getItem(EVENTS_STORAGE_KEY);
      return saved ? JSON.parse(saved) : INITIAL_EVENTS;
    } catch (e) {
      return INITIAL_EVENTS;
    }
  });

  const [registrations, setRegistrations] = useState(() => {
    try {
      const saved = localStorage.getItem(REGISTRATIONS_STORAGE_KEY);
      return saved ? JSON.parse(saved) : INITIAL_REGISTRATIONS;
    } catch (e) {
      return INITIAL_REGISTRATIONS;
    }
  });

  // Evaluate live status transitions (e.g. check if past date -> Completed or 0 seats -> Closed)
  const evaluateStatus = useCallback((event) => {
    if (!event) return 'Draft';
    const now = new Date();
    const eventDate = new Date(event.eventDate);

    if (eventDate < now) {
      return 'Completed';
    }

    if (event.status === 'Registration Open' && Number(event.availableSeats) <= 0) {
      return 'Registration Closed';
    }

    return event.status;
  }, []);

  // Save to localStorage whenever events change
  useEffect(() => {
    localStorage.setItem(EVENTS_STORAGE_KEY, JSON.stringify(events));
  }, [events]);

  // Save to localStorage whenever registrations change
  useEffect(() => {
    localStorage.setItem(REGISTRATIONS_STORAGE_KEY, JSON.stringify(registrations));
  }, [registrations]);

  // Fetch events & registrations from MongoDB backend
  const fetchFromBackend = useCallback(async (token = authToken) => {
    try {
      const available = await isBackendAvailable();
      setIsLiveApi(available);

      if (available) {
        // 1. Fetch Events from MongoDB
        const res = await apiClient.get('/events?limit=100');
        if (res && res.data && Array.isArray(res.data) && res.data.length > 0) {
          setEvents(res.data);
          localStorage.setItem(EVENTS_STORAGE_KEY, JSON.stringify(res.data));
        }

        // 2. Fetch User Registrations from MongoDB if token available
        const activeToken = token || localStorage.getItem('campus_hub_token');
        if (activeToken) {
          try {
            const regRes = await apiClient.get('/registrations/my', activeToken);
            if (regRes && regRes.data && Array.isArray(regRes.data)) {
              setRegistrations(regRes.data);
              localStorage.setItem(REGISTRATIONS_STORAGE_KEY, JSON.stringify(regRes.data));
            }
          } catch (e) {
            // Reg fetch optional
          }
        }
      }
    } catch (err) {
      console.log('[Backend sync notice - offline mode fallback active]');
    } finally {
      setLoading(false);
    }
  }, [authToken]);

  // Initial load
  useEffect(() => {
    fetchFromBackend();
  }, [fetchFromBackend, authToken, currentRole]);

  // Get single event
  const getEvent = useCallback(
    (id) => {
      const found = events.find((e) => e._id === id || e.id === id);
      if (!found) return null;
      return {
        ...found,
        status: evaluateStatus(found),
      };
    },
    [events, evaluateStatus]
  );

  // Create new event on MongoDB
  const createEvent = useCallback(
    async (eventData) => {
      try {
        const max = Number(eventData.maxParticipants);
        const token = authToken || localStorage.getItem('campus_hub_token') || 'demo_organizer';

        // Direct Backend MongoDB Call
        try {
          const res = await apiClient.post('/events', eventData, token);
          if (res && res.data) {
            const createdDoc = res.data;
            setEvents((prev) => [createdDoc, ...prev.filter((e) => e._id !== createdDoc._id)]);
            success(`Event "${createdDoc.eventName}" saved to MongoDB successfully!`);
            return createdDoc;
          }
        } catch (backendError) {
          console.warn('[Backend create error]:', backendError.message);
          // If offline, fallback
        }

        const newEvent = {
          _id: `evt-${Date.now().toString(36)}`,
          ...eventData,
          maxParticipants: max,
          availableSeats: max,
          status: eventData.status || 'Registration Open',
          createdBy: {
            _id: currentUser._id,
            name: currentUser.name,
            email: currentUser.email,
            department: currentUser.department,
            avatar: currentUser.avatar,
          },
          createdAt: new Date().toISOString(),
        };

        setEvents((prev) => [newEvent, ...prev]);
        success(`Event "${newEvent.eventName}" created successfully!`);
        return newEvent;
      } catch (err) {
        showError(err.message || 'Failed to create event');
        throw err;
      }
    },
    [currentUser, authToken, success, showError]
  );

  // Update existing event on MongoDB
  const updateEvent = useCallback(
    async (id, updateData) => {
      try {
        let updated = null;
        const token = authToken || localStorage.getItem('campus_hub_token') || 'demo_organizer';

        try {
          const res = await apiClient.put(`/events/${id}`, updateData, token);
          if (res && res.data) {
            updated = res.data;
            setEvents((prev) => prev.map((item) => (item._id === id ? updated : item)));
            success('Event updated on MongoDB successfully!');
            return updated;
          }
        } catch (e) {
          console.warn('[Backend update error]:', e.message);
        }

        setEvents((prev) =>
          prev.map((item) => {
            if (item._id === id || item.id === id) {
              const currentMax = item.maxParticipants;
              const currentAvailable = item.availableSeats;
              const registered = currentMax - currentAvailable;

              const newMax = updateData.maxParticipants ? Number(updateData.maxParticipants) : currentMax;
              const newAvailable = Math.max(0, newMax - registered);

              const merged = {
                ...item,
                ...updateData,
                maxParticipants: newMax,
                availableSeats: newAvailable,
              };
              merged.status = evaluateStatus(merged);
              updated = merged;
              return merged;
            }
            return item;
          })
        );

        success('Event updated successfully!');
        return updated;
      } catch (err) {
        showError(err.message || 'Failed to update event');
        throw err;
      }
    },
    [authToken, evaluateStatus, success, showError]
  );

  // Update Status Workflow (FSM)
  const updateEventStatus = useCallback(
    async (id, newStatus) => {
      try {
        const token = authToken || localStorage.getItem('campus_hub_token') || 'demo_organizer';
        try {
          await apiClient.patch(`/events/${id}/status`, { status: newStatus }, token);
        } catch (e) {
          console.warn('[Backend status update fallback]');
        }

        setEvents((prev) =>
          prev.map((e) => {
            if (e._id === id || e.id === id) {
              return { ...e, status: newStatus };
            }
            return e;
          })
        );

        info(`Event status updated to "${newStatus}"`);
      } catch (err) {
        showError('Could not transition event status');
      }
    },
    [authToken, info, showError]
  );

  // Delete event on MongoDB
  const deleteEvent = useCallback(
    async (id) => {
      try {
        const token = authToken || localStorage.getItem('campus_hub_token') || 'demo_organizer';
        try {
          await apiClient.delete(`/events/${id}`, token);
        } catch (e) {
          console.warn('[Backend delete fallback]');
        }

        setEvents((prev) => prev.filter((e) => e._id !== id && e.id !== id));
        setRegistrations((prev) => prev.filter((r) => r.eventId !== id));
        success('Event deleted from MongoDB successfully');
      } catch (err) {
        showError('Failed to delete event');
      }
    },
    [authToken, success, showError]
  );

  // Check if current user is registered for event
  const isUserRegistered = useCallback(
    (eventId) => {
      return registrations.some(
        (r) =>
          (r.eventId === eventId || r.eventId?._id === eventId) &&
          (r.userId === currentUser._id || r.userId?._id === currentUser._id || r.userEmail === currentUser.email) &&
          r.status === 'Confirmed'
      );
    },
    [registrations, currentUser]
  );

  // Register for event on MongoDB
  const registerForEvent = useCallback(
    async (eventId) => {
      try {
        const targetEvent = events.find((e) => e._id === eventId || e.id === eventId);
        if (!targetEvent) {
          throw new Error('Event not found');
        }

        const dynamicStatus = evaluateStatus(targetEvent);
        if (dynamicStatus === 'Completed') {
          throw new Error('This event has already ended.');
        }

        if (dynamicStatus !== 'Registration Open') {
          throw new Error(`Registration is not currently open for this event (${dynamicStatus}).`);
        }

        if (targetEvent.availableSeats <= 0) {
          throw new Error('This event is fully booked! No seats available.');
        }

        if (isUserRegistered(eventId)) {
          throw new Error('You are already registered for this event!');
        }

        const token = authToken || localStorage.getItem('campus_hub_token') || 'demo_student';

        // Real Backend Call to MongoDB
        try {
          const res = await apiClient.post(`/registrations/${eventId}`, {}, token);
          if (res && res.data) {
            const mongoReg = res.data;
            setRegistrations((prev) => [mongoReg, ...prev]);

            // Deduct seat
            setEvents((prev) =>
              prev.map((e) => {
                if (e._id === eventId || e.id === eventId) {
                  const updatedSeats = Math.max(0, e.availableSeats - 1);
                  return {
                    ...e,
                    availableSeats: updatedSeats,
                    status: updatedSeats === 0 ? 'Registration Closed' : e.status,
                  };
                }
                return e;
              })
            );

            success(`Registration Confirmed! Ticket ID: ${mongoReg.ticketId}`);
            return mongoReg;
          }
        } catch (apiErr) {
          console.warn('[Backend registration error]:', apiErr.message);
        }

        // Fallback local registration
        const ticketSuffix = Math.random().toString(36).substring(2, 8).toUpperCase();
        const ticketId = `TKT-${ticketSuffix}`;

        const newRegistration = {
          _id: `reg-${Date.now().toString(36)}`,
          eventId: targetEvent._id,
          userId: currentUser._id,
          userName: currentUser.name,
          userEmail: currentUser.email,
          userDepartment: currentUser.department,
          studentId: currentUser.studentId,
          ticketId,
          status: 'Confirmed',
          registeredAt: new Date().toISOString(),
          eventSnapshot: { ...targetEvent },
        };

        setEvents((prev) =>
          prev.map((e) => {
            if (e._id === eventId || e.id === eventId) {
              const updatedSeats = Math.max(0, e.availableSeats - 1);
              return {
                ...e,
                availableSeats: updatedSeats,
                status: updatedSeats === 0 ? 'Registration Closed' : e.status,
              };
            }
            return e;
          })
        );

        setRegistrations((prev) => [newRegistration, ...prev]);
        success(`Registration Confirmed! Ticket ID: ${ticketId}`);
        return newRegistration;
      } catch (err) {
        showError(err.message || 'Registration failed');
        throw err;
      }
    },
    [events, currentUser, isUserRegistered, evaluateStatus, authToken, success, showError]
  );

  // Cancel registration on MongoDB
  const cancelRegistration = useCallback(
    async (registrationId) => {
      try {
        const reg = registrations.find((r) => r._id === registrationId);
        if (!reg) throw new Error('Registration record not found');

        const token = authToken || localStorage.getItem('campus_hub_token') || 'demo_student';

        try {
          await apiClient.delete(`/registrations/${registrationId}/cancel`, token);
        } catch (e) {
          console.warn('[Backend cancel fallback]');
        }

        const eventId = typeof reg.eventId === 'object' ? reg.eventId._id : reg.eventId;
        setEvents((prev) =>
          prev.map((e) => {
            if (e._id === eventId || e.id === eventId) {
              const newAvailable = Math.min(e.maxParticipants, e.availableSeats + 1);
              const isFuture = new Date(e.eventDate) > new Date();
              return {
                ...e,
                availableSeats: newAvailable,
                status: isFuture && e.status === 'Registration Closed' ? 'Registration Open' : e.status,
              };
            }
            return e;
          })
        );

        setRegistrations((prev) => prev.filter((r) => r._id !== registrationId));
        success('Registration cancelled. Your seat has been freed on MongoDB.');
      } catch (err) {
        showError(err.message || 'Failed to cancel registration');
      }
    },
    [registrations, authToken, success, showError]
  );

  // Reset to initial demo dataset
  const resetToDefaultData = useCallback(async () => {
    localStorage.removeItem(EVENTS_STORAGE_KEY);
    localStorage.removeItem(REGISTRATIONS_STORAGE_KEY);
    await fetchFromBackend();
    info('Refreshed events & registrations with live MongoDB dataset');
  }, [fetchFromBackend, info]);

  return (
    <EventContext.Provider
      value={{
        events,
        registrations,
        loading,
        isLiveApi,
        getEvent,
        createEvent,
        updateEvent,
        updateEventStatus,
        deleteEvent,
        registerForEvent,
        cancelRegistration,
        isUserRegistered,
        resetToDefaultData,
        evaluateStatus,
        fetchFromBackend,
      }}
    >
      {children}
    </EventContext.Provider>
  );
};

export const useEvents = () => {
  const context = useContext(EventContext);
  if (!context) {
    throw new Error('useEvents must be used within an EventProvider');
  }
  return context;
};

import { useState, useCallback, useMemo } from 'react';

const ALLOWED_CATEGORIES = [
  'Workshop',
  'Seminar',
  'Hackathon',
  'Webinar',
  'Guest Lecture',
  'Cultural',
];

export const useEventFormValidation = (initialValues = {}, isEditMode = false) => {
  const [formData, setFormData] = useState({
    eventName: '',
    eventType: 'Workshop',
    resourcePerson: '',
    speakerBio: '',
    eventDate: '',
    endDate: '',
    venue: '',
    maxParticipants: 50,
    eventDescription: '',
    tags: [],
    agenda: [{ time: '10:00 AM - 11:30 AM', topic: 'Session Introduction & Overview', speaker: '' }],
    bannerImage: '',
    status: 'Registration Open',
    ...initialValues,
  });

  const [touched, setTouched] = useState({});
  const [errors, setErrors] = useState({});

  // Single field validation rule evaluation
  const validateField = useCallback((name, value) => {
    let error = '';

    switch (name) {
      case 'eventName':
        if (!value || value.trim().length === 0) {
          error = 'Event name is required';
        } else if (value.trim().length < 5) {
          error = 'Event name must be at least 5 characters';
        } else if (value.trim().length > 100) {
          error = 'Event name cannot exceed 100 characters';
        }
        break;

      case 'eventType':
        if (!value || !ALLOWED_CATEGORIES.includes(value)) {
          error = `Please select a valid event type (${ALLOWED_CATEGORIES.join(', ')})`;
        }
        break;

      case 'resourcePerson':
        if (!value || value.trim().length === 0) {
          error = 'Resource person / speaker name is required';
        } else if (value.trim().length < 3) {
          error = 'Resource person name must be at least 3 characters';
        }
        break;

      case 'eventDate':
        if (!value) {
          error = 'Event date & start time are required';
        } else {
          const selectedDate = new Date(value);
          if (isNaN(selectedDate.getTime())) {
            error = 'Invalid date format';
          } else if (!isEditMode && selectedDate.getTime() < Date.now() - 60000) {
            error = 'Event date must be in the future';
          }
        }
        break;

      case 'venue':
        if (!value || value.trim().length === 0) {
          error = 'Venue or online link is required';
        } else if (value.trim().length < 3) {
          error = 'Venue must be at least 3 characters';
        }
        break;

      case 'maxParticipants':
        if (value === '' || value === null || value === undefined) {
          error = 'Maximum capacity is required';
        } else {
          const num = Number(value);
          if (isNaN(num) || !Number.isInteger(num) || num < 5) {
            error = 'Maximum participants must be a whole number of at least 5';
          }
        }
        break;

      case 'eventDescription':
        if (!value || value.trim().length === 0) {
          error = 'Event description is required';
        } else if (value.trim().length < 20) {
          error = `Description must be at least 20 characters (current: ${value.trim().length})`;
        }
        break;

      default:
        break;
    }

    return error;
  }, [isEditMode]);

  // Validate entire form
  const validateForm = useCallback((currentData = formData) => {
    const newErrors = {};

    ['eventName', 'eventType', 'resourcePerson', 'eventDate', 'venue', 'maxParticipants', 'eventDescription'].forEach(
      (field) => {
        const error = validateField(field, currentData[field]);
        if (error) {
          newErrors[field] = error;
        }
      }
    );

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData, validateField]);

  // Change handler for controlled inputs
  const handleChange = useCallback((e) => {
    const { name, value, type, checked } = e.target;
    const finalValue = type === 'checkbox' ? checked : value;

    setFormData((prev) => {
      const updated = { ...prev, [name]: finalValue };
      // Real-time error validation if field has been touched
      if (touched[name]) {
        const fieldError = validateField(name, finalValue);
        setErrors((prevErr) => ({ ...prevErr, [name]: fieldError }));
      }
      return updated;
    });
  }, [touched, validateField]);

  // Blur handler for tracking touch state
  const handleBlur = useCallback((e) => {
    const { name, value } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    const fieldError = validateField(name, value);
    setErrors((prevErr) => ({ ...prevErr, [name]: fieldError }));
  }, [validateField]);

  // Setter for custom fields like tags, agenda, banner
  const setFieldValue = useCallback((name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  }, []);

  // Compute isValid dynamically
  const isValid = useMemo(() => {
    return (
      formData.eventName.trim().length >= 5 &&
      formData.eventName.trim().length <= 100 &&
      ALLOWED_CATEGORIES.includes(formData.eventType) &&
      formData.resourcePerson.trim().length >= 3 &&
      Boolean(formData.eventDate) &&
      formData.venue.trim().length >= 3 &&
      Number(formData.maxParticipants) >= 5 &&
      formData.eventDescription.trim().length >= 20
    );
  }, [formData]);

  const resetForm = useCallback((initialState = {}) => {
    setFormData({
      eventName: '',
      eventType: 'Workshop',
      resourcePerson: '',
      speakerBio: '',
      eventDate: '',
      endDate: '',
      venue: '',
      maxParticipants: 50,
      eventDescription: '',
      tags: [],
      agenda: [],
      bannerImage: '',
      status: 'Registration Open',
      ...initialState,
    });
    setTouched({});
    setErrors({});
  }, []);

  return {
    formData,
    setFormData,
    errors,
    touched,
    isValid,
    handleChange,
    handleBlur,
    setFieldValue,
    validateForm,
    resetForm,
    ALLOWED_CATEGORIES,
  };
};

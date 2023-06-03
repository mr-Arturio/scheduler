import { useState, useEffect } from 'react';
import axios from 'axios';

export default function useApplicationData() {
  const [state, setState] = useState({
    day: 'Monday',
    days: [],
    appointments: {},
    interviewers: {},
  });

  const setDay = (day) => {
    setState(prev => ({ ...prev, day }));
  };

  const updateSpots = (appointmentId, isBooking) => {
    setState((prev) => {
      // Find the day object that includes the given appointmentId
      const day = prev.days.find((d) => d.appointments.includes(appointmentId));

      // Get an array of all the appointments for the found day
      const appointments = day.appointments.map((id) => prev.appointments[id]);

      // Count the number of appointments with null interviews
      const spots = appointments.filter((appointment) => prev.appointments[appointment.id].interview === null).length;

      // Create a new day object with the updated spots value
      const updatedDay = { ...day, spots };

      // Create a new array of days with the updatedDay object
      const updatedDays = prev.days.map((d) => (d.id === updatedDay.id ? updatedDay : d));

      // Return the updated state with the updatedDays array
      return { ...prev, days: updatedDays };
    });
  };

  function bookInterview(id, interview) {
    const appointment = {
      ...state.appointments[id],
      interview: { ...interview },
    };

    const appointments = {
      ...state.appointments,
      [id]: appointment,
    };

    return axios
      .put(`/api/appointments/${id}`, { interview })
      .then(() => {
        setState((prev) => ({
          ...prev,
          appointments,
        }));
        updateSpots(id, true); // Update the spots when booking an interview
      })
      .catch((error) => {
        throw error;
      });
  }

  function cancelInterview(id) {
    const appointment = {
      ...state.appointments[id],
      interview: null,
    };

    const appointments = {
      ...state.appointments,
      [id]: appointment,
    };

    return axios
      .delete(`/api/appointments/${id}`)
      .then(() => {
        setState((prev) => ({
          ...prev,
          appointments,
        }));
        updateSpots(id, false); // Update the spots when canceling an interview
      })
      .catch((error) => {
        throw error;
      });
  }

  // hook to fetch data from the server
  useEffect(() => {
    Promise.all([
      axios.get('/api/days'), // Make the GET request to your API server
      axios.get('/api/appointments'),
      axios.get('/api/interviewers')
    ])
      .then(([daysResponse, appointmentsResponse, interviewersResponse]) => {
        // Destructure the responses
        setState(prev => ({
          ...prev,
          days: daysResponse.data, // Access the response data for days
          appointments: appointmentsResponse.data, // Access the response data for appointments
          interviewers: interviewersResponse.data
        }));
      })
      .catch(error => {
        console.log(error);
      });
  }, []);

  return {
    state,
    setDay,
    bookInterview,
    cancelInterview,
  };
}

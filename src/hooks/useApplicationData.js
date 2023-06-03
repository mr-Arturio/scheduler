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

  function bookInterview(id, interview) {
   
    const appointment = {
      ...state.appointments[id],
      interview: { ...interview }
    };

    const appointments = {
      ...state.appointments,
      [id]: appointment
    };
    
    return axios
    .put(`/api/appointments/${id}`, { interview }) // Make a PUT request to update the appointment
    .then(() => {
      setState(prev => ({
        ...prev,
        appointments
      }));
    })
    
}

function cancelInterview(id){
  const appointment = {
    ...state.appointments[id],
    interview: null
  };

  const appointments = {
    ...state.appointments,
    [id]: appointment
  };

  return axios
  .delete(`/api/appointments/${id}`) 
  .then(() => {
    setState(prev => ({
  ...prev,
  appointments
}));
  })
  
}
  
  
  // hook to fetch data from the server
  useEffect(() => {
    Promise.all([
      axios.get('/api/days'), // Make the GET request to your API server
      axios.get('/api/appointments'),
      axios.get('/api/interviewers')
    ])
    .then(([daysResponse, appointmentsResponse, interviewersResponse]) => { // Destructure the responses
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
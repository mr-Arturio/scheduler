//Import dependencies and components
import React, { useState, useEffect } from "react";
import DayList from "./DayList";
import "components/Application.scss";
import Appointment from "./Appointment";
import axios from "axios";
import { 
  getAppointmentsForDay, 
  getInterview, 
  getInterviewersForDay
} from 'helpers/selectors';


export default function Application(props) {
  //Set up the initial state
  const [state, setState] = useState({
    day: 'Monday',
    days: [],
    appointments: {},
    interviewers: {}
  });

 

  const setDay = (day) => {
    setState(prevState => ({ ...prevState, day }));
  };


  // hook to fetch data from the server
  useEffect(() => {
    Promise.all([
      axios.get('/api/days'), // Make the GET request to your API server
      axios.get('/api/appointments'),
      axios.get('/api/interviewers')
    ]).then((all) => {
      const [daysResponse, appointmentsResponse,  interviewersResponse] = all; // Destructure the responses
      setState(prev => ({
        ...prev,
        days: daysResponse.data, // Access the response data for days
        appointments: appointmentsResponse.data, // Access the response data for appointments
        interviewers: interviewersResponse.data
      }));
    }).catch(error => {
      console.log(error);
    });
  }, []);


const appointments = getAppointmentsForDay(state, state.day); // Get appointments for the selected day
const interviewers = getInterviewersForDay(state, state.day);

  const schedule = appointments.map((appointment) => {
    const interview = getInterview(state, appointment.interview);

    return (
      <Appointment
        key={appointment.id}
        id={appointment.id}
        time={appointment.time}
        interview={interview}
        interviewers={interviewers}
      />
    );
  });

  return (
    <main className="layout">
      <section className="sidebar">
        <img
          className="sidebar--centered"
          src="images/logo.png"
          alt="Interview Scheduler"
        />
        <hr className="sidebar__separator sidebar--centered" />
        <nav className="sidebar__menu">
          <DayList
            days={state.days}
            value={state.day}
            onChange={setDay}
          />
        </nav>
        <img
          className="sidebar__lhl sidebar--centered"
          src="images/lhl.png"
          alt="Lighthouse Labs"
        />
      </section>
      <section className="schedule">
        
          {schedule}
        <Appointment key="last" time="5pm" />
      </section>
    </main>
  );
}

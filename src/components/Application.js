//Import dependencies and components
import React, { useState, useEffect } from "react";
import DayList from "./DayList";
import "components/Application.scss";
import Appointment from "./Appointment";
import axios from "axios";


export default function Application(props) {
  //Set up the initial state
  const [state, setState] = useState({
    day: 'Monday',
    days: [],
    appointments: {}
  });

  const dailyAppointments = [];

  const setDay = (day) => {
    setState(prevState => ({ ...prevState, day }));
  };

  const setDays = (days) => {
    setState(prevState => ({ ...prevState, days }));
  };


  // hook to fetch data from the server
  useEffect(() => {
    axios.get('/api/days') // Make the GET request to your API server
      .then(response => {
        setDays(response.data); // Set the days state with the response data
      })
      .catch(error => {
        console.log(error);
      });
  }, []);


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
        {dailyAppointments.map((appointment) => (
          <Appointment
            key={appointment.id}
            {...appointment}
          />
        ))}
        <Appointment key="last" time="5pm" />
      </section>
    </main>
  );
}

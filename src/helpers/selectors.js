export default function getAppointmentsForDay(state, day) {

  const filteredDay = state.days.find(d => d.name === day);

  if (!filteredDay) {
    return [];
  }

  return filteredDay.appointments.map((id) => state.appointments[id]);
}
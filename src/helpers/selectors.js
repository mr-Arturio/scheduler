export function getAppointmentsForDay(state, day) {

  const filteredDay = state.days.find(d => d.name === day);

  if (!filteredDay) {
    return [];
  }

  return filteredDay.appointments.map((id) => state.appointments[id]);
}



export function getInterview(state, interview) {
  if (interview && interview.interviewer) {
    const interviewerId = interview.interviewer;
    const interviewer = state.interviewers[interviewerId];

    return {
      student: interview.student,
      interviewer: {
        id: interviewer.id,
        name: interviewer.name,
        avatar: interviewer.avatar
      }
    };
  }

  return null;
}
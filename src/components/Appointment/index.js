import React from "react";
import 'components/Appointment/styles.scss';

import Header from "./Header";
import Empty from "./Empty";
import Show from "./Show";
import Form from "./Form";
import Status from "./Status";
import useVisualMode from "hooks/useVisualMode";

export default function Appointment(props) {
  const EMPTY = "EMPTY";
  const SHOW = "SHOW";
  const CREATE = "CREATE";
  const SAVING = 'SAVING';
  const DELETING = 'DELETING';

  const { mode, transition, back } = useVisualMode(
    props.interview ? SHOW : EMPTY
  );

  function save(name, interviewer) {
    const interview = {
      student: name,
      interviewer
    };

    transition(SAVING);

    props.bookInterview(props.id, interview) // Call the bookInterview function with the appropriate data
   .then(() => { 
    transition(SHOW);// Transition to the SHOW mode after booking the interview
  });
}

function cancelInterview() {
   transition(DELETING, true);

    props
      .cancelInterview(props.id)
      .then(() => {
        transition(EMPTY);
      });
      }
   

  return (
    <article className="appointment">
      <Header time={props.time} />
      {mode === EMPTY && <Empty onAdd={() => transition(CREATE)} />}
      {mode === SHOW && (
        <Show
          student={props.interview.student}
          interviewer={props.interview.interviewer}
          onDelete={cancelInterview}
        />
      )}
      {mode === CREATE && (
        <Form
        interviewers={props.interviewers} 
        onSave={save}
        onCancel={() => back()}
        onDelete={cancelInterview}
        />
      )} 
      {mode === SAVING && <Status message={'SAVING'}></Status>}
      {mode === DELETING && <Status message={'DELETING'}></Status>}
    </article>
  );
}
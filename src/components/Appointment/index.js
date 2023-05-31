import React from "react";
import "components/Appointment/styles.scss";

import Header from "./Header";
import Empty from "./Empty";
import Show from "./Show";
import Form from "./Form";
import Status from "./Status";
import Confirm from "./Confirm";
import Error from "./Error";
import useVisualMode from "hooks/useVisualMode";

export default function Appointment(props) {
  const EMPTY = "EMPTY";
  const SHOW = "SHOW";
  const CREATE = "CREATE";
  const SAVING = "SAVING";
  const DELETING = "DELETING";
  const CONFIRM = "CONFIRM";
  const ERROR = "ERROR";

  const { mode, transition, back } = useVisualMode(
    props.interview ? SHOW : EMPTY
  );

  function save(name, interviewer) {
    if (!name || !interviewer) {
      // Throw an error if the name or interviewer is missing
      transition(ERROR, true);
      return Promise.reject(new Error());
    }

    const interview = {
      student: name,
      interviewer,
    };

    transition(SAVING);

    props
      .bookInterview(props.id, interview) // Call the bookInterview function with the appropriate data
      .then(() => {
        transition(SHOW); // Transition to the SHOW mode after booking the interview
      })
      .catch((err) => {
        transition(ERROR, true);
      });
  }

  function cancelInterview() {
    if (mode === CONFIRM) {
      transition(DELETING, true);

      props.cancelInterview(props.id).then(() => {
        transition(EMPTY);
      });
    } else {
      transition(CONFIRM);
    }
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
      {mode === SAVING && <Status message={"SAVING"}></Status>}
      {mode === DELETING && <Status message={"DELETING"}></Status>}
      {mode === CONFIRM && (
        <Confirm onCancel={back} onConfirm={cancelInterview} />
      )}
      {mode === ERROR && (
        <Error message={"Name and interviewer selection are required."} onClose={back} />
      )}
    </article>
  );
}

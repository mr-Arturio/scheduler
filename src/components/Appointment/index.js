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

const EMPTY = "EMPTY";
const SHOW = "SHOW";
const CREATE = "CREATE";
const SAVING = "SAVING";
const DELETING = "DELETING";
const CONFIRM = "CONFIRM";
const EDIT = "EDIT";
const ERROR_SAVE = "ERROR_SAVE";
const ERROR_DELETE = "ERROR_DELETE";

export default function Appointment(props) {
  const { mode, transition, back } = useVisualMode(
    props.interview ? SHOW : EMPTY
  );

  function save(name, interviewer) {
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
      .catch((error) => {
        transition(ERROR_SAVE, true);
      });
  }

  function cancelInterview() {
    if (mode === CONFIRM) {
      transition(DELETING, true);

      props
        .cancelInterview(props.id)
        .then(() => {
          transition(EMPTY);
        })
        .catch((error) => {
          transition(ERROR_DELETE, true); // Transition to ERROR_DELETE mode if there is an error
        });
    } else {
      transition(CONFIRM);
    }
  }

  function editInterview() {
    transition(EDIT);
  }

  return (
    <article className="appointment" data-testid="appointment">
      <Header time={props.time} />
      {mode === EMPTY && <Empty onAdd={() => transition(CREATE)} />}
      {mode === SHOW && (
        <Show
          student={props.interview.student}
          interviewer={props.interview.interviewer}
          onDelete={cancelInterview}
          onEdit={editInterview}
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
      {mode === EDIT && (
        <Form
          interviewers={props.interviewers}
          onSave={save}
          onCancel={() => back()}
          name={props.interview.student} // Pass the current student name as a prop for editing
          interviewer={props.interview ? props.interview.interviewer.id : null} // Pass the current interviewer as a prop for editing
        />
      )}
      {mode === SAVING && <Status message={"SAVING"}></Status>}
      {mode === DELETING && <Status message={"DELETING"}></Status>}
      {mode === CONFIRM && (
        <Confirm onCancel={back} onConfirm={cancelInterview} />
      )}
      {mode === ERROR_SAVE && (
        <Error
          message={"Name and interviewer selection are required."}
          onClose={back}
        />
      )}
      {mode === ERROR_DELETE && (
        <Error message={"Error deleting appointment."} onClose={back} />
      )}
    </article>
  );
}

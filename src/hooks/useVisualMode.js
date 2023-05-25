import { useState } from 'react';

export default function useVisualMode(initial) {
  const [mode, setMode] = useState(initial);
  const [history, setHistory] = useState([initial]); //history state maintains a record of all previous modes.

  //The transition function updates the mode and history states
  function transition(newMode, replace = false) { //replace parameter determines whether to replace the current mode in the history.
    //update the mode state with the new mode value.
    setMode(newMode);
    //takes the previous history as a parameter and returns the new history.
    setHistory((prevHistory) => {
      if (replace) {
        //create a copy of the previous history array using spread
        const newHistory = [...prevHistory];
        //remove the last mode from the new history
        newHistory.pop();
        //add the new mode to the modified history array and returns it
        return [...newHistory, newMode];
      }
      //If replace is false, add the new mode to the existing history array and returns the updated history.
      return [...prevHistory, newMode]
    });
  };

  // to go back to the previous mode in the history
  function back() {
    //check the length
    if (history.length > 1) {

      setHistory((prevHistory) => {
        //create a copy of the previous history array using the spread
        const newHistory = [...prevHistory];
        //remove the last mode from the new history
        newHistory.pop();
        //It retrieves the previous mode by accessing the last item in the updated history array.
        const prevItem = newHistory[newHistory.length - 1];
        //sets the mode state to the previous mode.
        setMode(prevItem);

        return newHistory;
      });

    }

  }
  // Returning the Hook's Values:
  return { mode, transition, back };
}


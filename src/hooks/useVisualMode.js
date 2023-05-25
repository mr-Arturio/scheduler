import { useState } from 'react';

export default function useVisualMode(initial) {
  const [mode, setMode] = useState(initial);
  const [history, setHistory] = useState([initial]);

  function transition(newMode, replace = false) {
    setMode(newMode);
    setHistory((prevHistory) => {
      if (replace) {
        const newHistory = [...prevHistory];
        newHistory.pop();
        return [... newHistory, newMode];
        
      }
      return [...prevHistory, newMode]
    });
  };

  function back() {
    if (history.length > 1) {

      setHistory((prevHistory) => {
        const newHistory = [...prevHistory];
        newHistory.pop();

        const prevItem = newHistory[newHistory.length - 1];

        setMode(prevItem);

        return newHistory;
      });

    }

  }

  return { mode, transition, back };
}


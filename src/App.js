import { useEffect, useState } from "react";
//import logo from './logo.svg';
import "./App.css";

function App() {
  const [breakLength, setBreakLength] = useState(5 * 60);
  const [sessionLength, setSessionLength] = useState(25 * 60);
  const [timer, setTimer] = useState(sessionLength);
  const [isPaused, setIsPaused] = useState(true);
  const [isSessionMode, setIsSessionMode] = useState(true);
  const [defaultValue, setDefaultValue] = useState();

  function reset() {
    setBreakLength(5 * 60);
    setSessionLength(25 * 60);
    setIsSessionMode(true);
    setTimer(sessionLength);
    setIsPaused(true);
    playSound("stop");
  }

  function changeLength(type) {
    if (type === "break-decrement") {
      if (breakLength > 1 * 60) {
        setBreakLength(breakLength - 1 * 60);
      }
    } else if (type === "break-increment") {
      if (breakLength <= 59 * 60) {
        setBreakLength(breakLength + 1 * 60);
      }
    } else if (type === "session-decrement") {
      if (sessionLength > 1 * 60) {
        setSessionLength(sessionLength - 1 * 60);
      }
    } else if (type === "session-increment") {
      if (sessionLength <= 59 * 60) {
        setSessionLength(sessionLength + 1 * 60);
      }
    }
  }

  function formatNumber(num) {
    return num.toLocaleString("en-US", {
      minimumIntegerDigits: 2,
      useGrouping: false,
    });
  }

  function playSound(toogle) {
    const audio = document.getElementById("beep");
    if (toogle === "start") {
      audio.currentTime = 0;
      audio.play();
    } else if (toogle === "stop") {
      audio.pause();
      audio.currentTime = 0;
    }
  }

  function disableButtons() {
    const buttons = document.getElementsByTagName("button");
    for (let i = 0; i < buttons.length; i++) {
      let button = buttons[i];
      if (button.id !== "reset" && button.id !== "start_stop") {
        button.disabled = true;
      }
    }
  }

  function enableButtons() {
    const buttons = document.getElementsByTagName("button");
    for (let i = 0; i < buttons.length; i++) {
      let button = buttons[i];
      button.disabled = false;
    }
  }

  useEffect(() => {
    if (!isPaused) {
      disableButtons();
    }
    if (isPaused) {
      enableButtons();
      if (isSessionMode) {
        if (defaultValue !== sessionLength) {
          setDefaultValue(-1);
          setTimer(sessionLength);
        }
      } else if (defaultValue !== breakLength) {
        setDefaultValue(-1);
        setTimer(breakLength);
      }
    }
    if (!isPaused && timer >= 0) {
      const intervalId = setInterval(() => {
        setTimer(timer - 1);
      }, 1000);
      return () => clearInterval(intervalId);
    }
    if (timer <= 0) {
      playSound("start");
    }
    if (timer < 0) {
      setIsSessionMode(!isSessionMode);
      if (isSessionMode) {
        setTimer(breakLength);
      } else {
        setTimer(sessionLength);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timer, isPaused, sessionLength, breakLength]);

  return (
    <div className="container" id="container">
      <div>
        <div className="main-title">25 + 5 Clock</div>
        <div className="length-control">
          <div id="break-label">Break Length</div>
          <button
            className="btn-level"
            id="break-decrement"
            value={"-"}
            onClick={() => changeLength("break-decrement")}
          >
            <i className="fa fa-arrow-down fa-2x" />
          </button>
          <div className="btn-level" id="break-length">
            {Math.floor(breakLength / 60)}
          </div>
          <button
            className="btn-level"
            id="break-increment"
            value={"+"}
            onClick={() => changeLength("break-increment")}
          >
            <i className="fa fa-arrow-up fa-2x" />
          </button>
        </div>
        <div className="length-control">
          <div id="session-label">Session Length</div>
          <button
            className="btn-level"
            id="session-decrement"
            value={"-"}
            onClick={() => changeLength("session-decrement")}
          >
            <i className="fa fa-arrow-down fa-2x" />
          </button>
          <div className="btn-level" id="session-length">
            {Math.floor(sessionLength / 60)}
          </div>
          <button
            className="btn-level"
            id="session-increment"
            value={"+"}
            onClick={() => changeLength("session-increment")}
          >
            <i className="fa fa-arrow-up fa-2x" />
          </button>
        </div>
        <div className="timer" style={{ color: timer < 60 ? "red" : "white" }}>
          <div className="timer-wrapper">
            <div id="timer-label">{isSessionMode ? "Session" : "Break"}</div>
            <div id="time-left">
              {formatNumber(Math.floor(timer / 60)) +
                ":" +
                formatNumber(timer % 60)}
            </div>
          </div>
        </div>
        <div className="timer-control">
          <button
            id="start_stop"
            onClick={() => {
              setIsPaused(!isPaused);
              if (isSessionMode) {
                setDefaultValue(sessionLength);
              } else {
                setDefaultValue(breakLength);
              }
            }}
          >
            <i
              className={isPaused ? "fa fa-play fa-2x" : "fa fa-pause fa-2x"}
            />
          </button>
          <button id="reset" onClick={() => reset()}>
            <i className="fa fa-refresh fa-2x" />
          </button>
        </div>
        <audio
          id="beep"
          src="https://cdn.freecodecamp.org/testable-projects-fcc/audio/BeepSound.wav"
        ></audio>
      </div>
    </div>
  );
}

export default App;

import { useEffect, useState } from "react";

const ProgressBar = ({ Timer }) => {
  const [remainingTime, setRemainingTime] = useState(Timer);

  useEffect(() => {
    const interval = setInterval(() => {
      console.log("interval");
      setRemainingTime((prevTime) => prevTime - 10);
    }, 10);

    return () => {
      clearInterval(interval);
      console.log("clear interval");
    };
  }, []);
  return (
    <>
      <progress max={Timer} value={remainingTime} />
    </>
  );
};

export default ProgressBar;

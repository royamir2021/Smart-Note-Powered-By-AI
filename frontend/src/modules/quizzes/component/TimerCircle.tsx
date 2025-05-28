import React from "react";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

interface Props {
  percentage: number; // 0 to 100
  time: string; // e.g. "07:57"
}
export default function TimerCircle({ percentage, time }: Props) {
  return (
    <div className="w-14 h-14 flex items-center justify-center">
      <CircularProgressbar
        value={percentage}
        text={time}
        styles={buildStyles({
          textColor: "#333",
          pathColor: "#f59e42",
          trailColor: "#f3f3f3",
          textSize: "1.2rem",
        })}
      />
    </div>
  );
}

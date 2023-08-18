import React from "react";
import { Select } from "antd";
import { useDataContext } from "@/context/dataContext";
import { usePlayerContext } from "@/context/playerContext";
import { useScaleContext } from "@/context/scaleContext";
import { msToSec } from "@/utils";
import { Play, Pause, Reset, Open, Close } from "@/assets/icons";

type Props = {
  setLinePosition: React.Dispatch<React.SetStateAction<number>>;
  timelineScroll: React.MutableRefObject<HTMLDivElement | null>;
  showTimeline: boolean;
  setToggleTimeline: React.Dispatch<React.SetStateAction<boolean>>;
  editing: boolean;
  setEditing: React.Dispatch<React.SetStateAction<boolean>>;
};

const TimelineControls = ({
  setLinePosition,
  timelineScroll,
  showTimeline,
  setToggleTimeline,
  editing,
  setEditing,
}: Props) => {
  // Access context values
  const { girdSize, setGridSize } = useScaleContext();
  const { maxTime, submitData } = useDataContext();
  const { play, setPlay, time, setTime } = usePlayerContext();

  // Function to start playback
  const handleStart = () => {
    if (msToSec(time) < maxTime) {
      setPlay(true);
    }
  };

  // Function to stop playback
  const handleStop = () => {
    setPlay(false);
  };

  // Function to reset playback
  const handleReset = () => {
    setTime(0);
    setLinePosition(0);
    setPlay(false);
    timelineScroll.current?.scroll({ top: 0, left: 0 });
  };

  // Function to handle submit
  const handleSubmit = () => {
    submitData();
    setEditing(false);
  };

  // Function to handle edit
  const handleEdit = () => {
    setEditing(!editing);
  };

  // Toggle timeline visibility
  const toggleTimeline = () => {
    setToggleTimeline(!showTimeline);
  };

  // Function to change the grid size
  const changeGridSize = (value: number) => {
    setGridSize(value);
  };

  // Format time in min:sec:ms
  const formatTime = (time: number) => {
    const milliseconds = (time % 1000) / 10;
    const seconds = Math.floor(msToSec(time)) % 60;
    const minutes = Math.floor(time / 60000);

    return `${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}:${milliseconds.toString().padStart(2, "0")}`;
  };

  // Toggle play/pause playback
  const togglePlayPause = () => (play ? handleStop() : handleStart());

  // Determine play/pause button icon based on playback state
  const togglePlayPauseButton = play ? <Pause /> : <Play />;

  // Determine open/close button icon based on timeline visibility
  const toggleTimelineButton = showTimeline ? <Close /> : <Open />;

  return (
    <div className="flex justify-star rounded-lg bg-slate-700 p-2 mb-2">
      <div className="flex">
        <button className="mx-2 w-[24px]" onClick={togglePlayPause}>
          {togglePlayPauseButton}
        </button>
        <button className="mx-2 w-[24px]" onClick={handleReset}>
          <Reset />
        </button>
      </div>

      <div className="text-center self-center min-w-[75px] mx-2 py-[2px]">
        {formatTime(time)}
      </div>

      {showTimeline && (
        <Select
          defaultValue={girdSize}
          style={{ width: 80 }}
          className="mx-2"
          onChange={changeGridSize}
          options={[
            { value: 1, label: "1 sec" },
            { value: 2, label: "2 sec" },
            { value: 5, label: "5 sec" },
            { value: 10, label: "10 sec" },
            { value: 15, label: "15 sec" },
          ]}
        />
      )}

      <div className="flex justify-end w-full">
        <div className="w-full cursor-pointer" onClick={toggleTimeline}></div>
        {showTimeline &&
          (editing ? (
            <button className="mx-2 px-3 btn-success" onClick={handleSubmit}>
              Save
            </button>
          ) : (
            <button className="mx-2 px-3 btn-primary" onClick={handleEdit}>
              Edit
            </button>
          ))}
        <button className="mx-2 w-[24px]" onClick={toggleTimeline}>
          {toggleTimelineButton}
        </button>
      </div>
    </div>
  );
};

export default TimelineControls;

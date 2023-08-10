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
  toggleTimeline: () => void;
};

const TimelineControls = ({
  setLinePosition,
  timelineScroll,
  showTimeline,
  toggleTimeline,
}: Props) => {
  const { girdSize, setGridSize } = useScaleContext();
  const { maxTime, submitData } = useDataContext();
  const { play, setPlay, time, setTime } = usePlayerContext();

  const handleStart = () => {
    if (msToSec(time) < maxTime) {
      setPlay(true);
    }
  };

  const handleStop = () => {
    setPlay(false);
  };

  const handleReset = () => {
    setTime(0);
    setLinePosition(0);
    setPlay(false);
    timelineScroll.current?.scroll({ top: 0, left: 0 });
  };

  const changeGridSize = (value: number) => {
    setGridSize(value);
  };

  const formatTime = (time: number) => {
    const milliseconds = (time % 1000) / 10;
    const seconds = Math.floor(msToSec(time)) % 60;
    const minutes = Math.floor(time / 60000);

    return `${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}:${milliseconds.toString().padStart(2, "0")}`;
  };

  const togglePlayPause = () => (play ? handleStop() : handleStart());

  const togglePlayPauseButton = play ? <Pause /> : <Play />;
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
          ]}
        />
      )}

      <div className="flex ml-auto">
        {showTimeline && (
          <button className="mx-2 px-3 btn-primary" onClick={submitData}>
            Save
          </button>
        )}
        <button className="mx-2 w-[24px]" onClick={toggleTimeline}>
          {toggleTimelineButton}
        </button>
      </div>
    </div>
  );
};

export default TimelineControls;

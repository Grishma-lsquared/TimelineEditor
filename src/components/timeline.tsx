import React from "react";
import { Resizable } from "re-resizable";
import TimelineScale from "@/components/timelineScale";
import DragList from "@/components/dragList";
import TimelineArea from "@/components/timelineArea";
import TimelineControls from "@/components/timelineControls";
import TimelineIndicator from "@/components/timelineIndicator";
import useInterval from "@/hooks/useInterval";
import { useDataContext } from "@/context/dataContext";
import { usePlayerContext } from "@/context/playerContext";
import { useScaleContext } from "@/context/scaleContext";
import { msToSec, secToMs } from "@/utils";

const TimeLine = () => {
  const timelineScroll = React.useRef<HTMLDivElement | null>(null);

  const { maxTime } = useDataContext();
  const { play, setPlay, time, setTime } = usePlayerContext();
  const { msIncrease, pixelIncreaseRate, msPerPixel } = useScaleContext();

  const [scroll, setScroll] = React.useState<number>(0);
  const [linePosition, setLinePosition] = React.useState(0);
  const [showTimeline, setToggleTimeline] = React.useState<boolean>(false);

  const handleTime = () => {
    if (!(play && msToSec(time) < maxTime)) return;
    setTime((prevTime: number) => prevTime + msIncrease);
    setLinePosition((prevPosition) => prevPosition + pixelIncreaseRate);
  };

  const toggleTimeline = () => {
    setToggleTimeline(!showTimeline);
  };

  const handleScroll = () => {
    timelineScroll.current && setScroll(timelineScroll.current.scrollLeft);
  };

  React.useEffect(() => {
    if (!timelineScroll.current) return;
    timelineScroll.current.addEventListener("wheel", handleScroll, {
      passive: false,
    });
  }, [showTimeline]);

  React.useEffect(() => {
    if (!timelineScroll.current) return;
    timelineScroll.current.scrollLeft = scroll;
  }, [scroll]);

  React.useEffect(() => {
    setLinePosition(time / msPerPixel);
    if (msToSec(time) >= maxTime) setPlay(false);
  }, [time, msPerPixel]);

  React.useEffect(() => {
    if (!(msToSec(linePosition * msPerPixel) > maxTime)) return;
    const newPosisiton = secToMs(maxTime) / msPerPixel - pixelIncreaseRate;
    setLinePosition(newPosisiton);
  }, [maxTime]);

  useInterval(handleTime, msIncrease, [play]);

  return (
    <Resizable
      className="bg-black p-4"
      style={{ position: "absolute", bottom: 0 }}
      enable={{ top: showTimeline }}
      size={{
        width: "100vw",
        height: showTimeline ? "" : "auto",
      }}
      minHeight="10vh"
    >
      <TimelineControls
        setLinePosition={setLinePosition}
        timelineScroll={timelineScroll}
        showTimeline={showTimeline}
        toggleTimeline={toggleTimeline}
      />

      {showTimeline && (
        <React.Fragment>
          <TimelineScale scroll={scroll} setScroll={setScroll} />

          <div
            ref={timelineScroll}
            className="relative overflow-auto no-scrollbar"
          >
            <TimelineArea />

            <TimelineIndicator
              scroll={scroll}
              setScroll={setScroll}
              timelineScroll={timelineScroll}
              linePosition={linePosition}
              setLinePosition={setLinePosition}
            />

            <DragList />
          </div>
        </React.Fragment>
      )}
    </Resizable>
  );
};

export default TimeLine;

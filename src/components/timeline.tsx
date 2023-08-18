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
  // Ref to track timeline scroll position
  const timelineScroll = React.useRef<HTMLDivElement | null>(null);

  // Access context values
  const { maxTime } = useDataContext();
  const { play, setPlay, time, setTime } = usePlayerContext();
  const { msIncrease, pixelIncreaseRate, msPerPixel } = useScaleContext();

  // State to track scroll position and timeline appearance
  const [scroll, setScroll] = React.useState<number>(0);
  const [linePosition, setLinePosition] = React.useState(0);
  const [showTimeline, setToggleTimeline] = React.useState<boolean>(false);
  const [editing, setEditing] = React.useState<boolean>(false);

  // Function to handle advancing time
  const handleTime = () => {
    if (!(play && msToSec(time) < maxTime)) return;
    setTime((prevTime: number) => prevTime + msIncrease);
    setLinePosition((prevPosition) => prevPosition + pixelIncreaseRate);
  };

  // Function to handle timeline scrolling
  const handleScroll = () => {
    timelineScroll.current && setScroll(timelineScroll.current.scrollLeft);
  };

  // Add wheel event listener to the timeline scroll element
  React.useEffect(() => {
    if (!timelineScroll.current) return;
    timelineScroll.current.addEventListener("wheel", handleScroll, {
      passive: false,
    });
  }, [showTimeline]);

  // Scroll timeline based on scroll state value
  React.useEffect(() => {
    if (!timelineScroll.current) return;
    timelineScroll.current.scrollLeft = scroll;
  }, [scroll]);

  // Update line position when time changes
  React.useEffect(() => {
    setLinePosition(time / msPerPixel);
    if (msToSec(time) >= maxTime) setPlay(false);
  }, [time, msPerPixel]);

  // Ensure line position stays within valid time range
  React.useEffect(() => {
    if (!(msToSec(linePosition * msPerPixel) > maxTime)) return;
    const newPosisiton = secToMs(maxTime) / msPerPixel - pixelIncreaseRate;
    setLinePosition(newPosisiton);
  }, [maxTime]);

  // Use custom interval hook to increase time during play
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
        setToggleTimeline={setToggleTimeline}
        editing={editing}
        setEditing={setEditing}
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

            <DragList editing={editing} />
          </div>
        </React.Fragment>
      )}
    </Resizable>
  );
};

export default TimeLine;

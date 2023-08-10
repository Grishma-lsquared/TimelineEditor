import React from "react";
import Draggable, { DraggableEvent, DraggableData } from "react-draggable";
import { useDataContext } from "@/context/dataContext";
import { usePlayerContext } from "@/context/playerContext";
import { useScaleContext } from "@/context/scaleContext";
import { msToSec } from "@/utils";

type Props = {
  timelineScroll: React.MutableRefObject<HTMLDivElement | null>;
  linePosition: number;
  scroll: number;
  setLinePosition: React.Dispatch<React.SetStateAction<number>>;
  setScroll: React.Dispatch<React.SetStateAction<number>>;
};

const TimelineIndicator = ({
  timelineScroll,
  linePosition,
  setLinePosition,
  scroll,
  setScroll,
}: Props) => {
  const { maxTime } = useDataContext();
  const { setTime } = usePlayerContext();
  const { msPerPixel } = useScaleContext();
  const [isDrag, setIsDrag] = React.useState(false);

  const handelStart = () => setIsDrag(true);
  const handelStop = () => setIsDrag(false);

  const handleDrag = (_: DraggableEvent, data: DraggableData) => {
    if (!(data.x > 0 && msToSec(data.x * msPerPixel) < maxTime)) return;

    const timeOffset = Math.floor(data.x * msPerPixel);
    setLinePosition(data.x);
    setTime(timeOffset);
  };

  React.useEffect(() => {
    if (!isDrag && linePosition - scroll > 700) {
      timelineScroll.current?.scroll({
        top: 0,
        left: linePosition - 700,
        behavior: "auto",
      });
      setScroll(linePosition - 700);
    }
  }, [linePosition]);

  return (
    <Draggable
      axis="x"
      position={{ x: linePosition, y: 0 }}
      onDrag={handleDrag}
      onStart={handelStart}
      onStop={handelStop}
    >
      <div className="absolute bg-blue-600 w-[2px] h-full top-0 left-0 cursor-grab z-20 ml-3" />
    </Draggable>
  );
};

export default TimelineIndicator;

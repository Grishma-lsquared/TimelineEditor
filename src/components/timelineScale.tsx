import React from "react";
import classnames from "classnames";
import { useDataContext } from "@/context/dataContext";
import { usePlayerContext } from "@/context/playerContext";
import { useScaleContext } from "@/context/scaleContext";
import { secToMs } from "@/utils";

type Props = {
  scroll: number;
  setScroll: React.Dispatch<React.SetStateAction<number>>;
};

const TimelineScale = ({ scroll, setScroll }: Props) => {
  const scaleScroll = React.useRef<HTMLDivElement | null>(null);
  const { maxTime } = useDataContext();
  const { setTime } = usePlayerContext();
  const { girdSize, msPerPixel } = useScaleContext();

  const [numberOfGrids, setNumberOfGrids] = React.useState<number>(0);
  const [lastGrid, setLastGrid] = React.useState<number>(0);
  const seconds: number[] = Array.from({ length: numberOfGrids });
  const milliseconds: number[] = Array.from({ length: 10 });

  const handleScroll = (e: WheelEvent) => {
    scaleScroll.current && setScroll(scaleScroll.current.scrollLeft);
  };

  const handleClick = (e: React.MouseEvent, index: number) => {
    const time = secToMs(index * girdSize) + e.nativeEvent.offsetX * msPerPixel;
    setTime(time);
  };

  const renderMilliseconds = React.useCallback(
    (index: number) =>
      milliseconds.map((ms, jIndex) => {
        if (index == numberOfGrids - 1 && lastGrid && jIndex >= lastGrid)
          return;
        return (
          <span
            key={jIndex}
            className={classnames(
              "min-w-[10px] border-slate-700 border-l-[1px] pointer-events-none",
              jIndex == 0
                ? "relative max-h-[40%] translate-y-[150%]"
                : "max-h-[20%] translate-y-[400%]"
            )}
          >
            {!jIndex && (
              <span className="absolute translate-x-[-50%] translate-y-[-100%] text-xs">
                {index * girdSize}
              </span>
            )}
          </span>
        );
      }),
    [numberOfGrids, lastGrid]
  );

  const renderLast = React.useCallback(
    () => (
      <div
        onClick={() => {
          setTime(secToMs(maxTime));
        }}
        className="flex min-w-[12px] min-h-full pb-1 cursor-pointer"
      >
        <span className="border-slate-700 border-l-[1px] pointer-events-none relative max-h-[40%] translate-y-[150%]">
          <span className="absolute translate-x-[-50%] translate-y-[-100%] text-xs">
            {maxTime}
          </span>
        </span>
      </div>
    ),
    [maxTime]
  );

  React.useEffect(() => {
    scaleScroll.current &&
      scaleScroll.current.addEventListener("wheel", handleScroll, {
        passive: false,
      });
  }, []);

  React.useEffect(() => {
    if (!scaleScroll.current) return;
    scaleScroll.current.scrollLeft = scroll;
  }, [scroll]);

  React.useEffect(() => {
    setNumberOfGrids(Math.ceil(maxTime / girdSize));
    setLastGrid(((maxTime % girdSize) * 10) / girdSize);
  }, [maxTime, girdSize]);

  return (
    <div className="relative">
      <div
        ref={scaleScroll}
        className="flex justify-start 
          max-w-full min-h-[30px] overflow-auto 
          no-scrollbar"
      >
        <div
          onClick={() => setTime(0)}
          className="min-w-[12px] min-h-full cursor-pointer pb-1"
        ></div>

        {seconds.map((sec, iIndex) => (
          <div
            key={iIndex}
            onClick={(sec) => handleClick(sec, iIndex)}
            className="flex min-h-full cursor-pointer pb-1"
          >
            {renderMilliseconds(iIndex)}
          </div>
        ))}

        {renderLast()}
      </div>
    </div>
  );
};

export default TimelineScale;

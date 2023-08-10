import React from "react";
import classnames from "classnames";
import { useDataContext } from "@/context/dataContext";
import { useScaleContext } from "@/context/scaleContext";

const TimelineArea = () => {
  const { maxTime } = useDataContext();
  const { girdSize } = useScaleContext();
  const [numberOfGrids, setNumberOfGrids] = React.useState<number>(0);
  const [lastGrid, setLastGrid] = React.useState<number>(0);
  const timeline = Array.from({ length: numberOfGrids });

  const getGridWidth = (i: number) => {
    let minWidth: string = "100px";
    if (i == numberOfGrids - 1 && lastGrid)
      minWidth = `${(lastGrid / girdSize) * 100}px`;

    return minWidth;
  };

  React.useEffect(() => {
    setNumberOfGrids(Math.ceil(maxTime / girdSize));
    setLastGrid(maxTime % girdSize);
  }, [maxTime, girdSize]);

  return (
    <div className="absolute flex justify-start min-h-full pointer-events-none">
      <span className="min-w-[12px] min-h-full"></span>
      {timeline.map((e, i) => (
        <span
          key={i}
          style={{ minWidth: getGridWidth(i) }}
          className={classnames(
            "min-h-full border-dashed border-2  border-slate-700",
            i == numberOfGrids - 1 ? "border-r-2" : "border-r-0"
          )}
        ></span>
      ))}
      <span className="min-w-[12px] min-h-full"></span>
    </div>
  );
};

export default TimelineArea;

import React from "react";
import classnames from "classnames";
import { useDataContext } from "@/context/dataContext";
import { useScaleContext } from "@/context/scaleContext";

const TimelineArea = () => {
  // Access data and scale context values
  const { maxTime } = useDataContext();
  const { girdSize } = useScaleContext();

  // State to track the number of grids and the size of the last grid
  const [numberOfGrids, setNumberOfGrids] = React.useState<number>(0);
  const [lastGrid, setLastGrid] = React.useState<number>(0);

  // Array representing the timeline grids
  const timeline = Array.from({ length: numberOfGrids });

  // Function to calculate the width of each grid
  const getGridWidth = (i: number) => {
    let minWidth: string = "100px";
    if (i == numberOfGrids - 1 && lastGrid)
      minWidth = `${(lastGrid / girdSize) * 100}px`;

    return minWidth;
  };

  // Update the number of grids and the size of the last grid
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

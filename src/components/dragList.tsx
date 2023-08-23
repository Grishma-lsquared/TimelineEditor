import React from "react";
import classnames from "classnames";
import ReactPlayer from "react-player";
import { Tooltip } from "antd";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
  DraggingStyle,
  NotDraggingStyle,
} from "react-beautiful-dnd";
import { useDataContext } from "@/context/dataContext";
import { useScaleContext } from "@/context/scaleContext";
import { reorder, move, secToMs } from "@/utils";
import { Data, Item } from "@/types/dataType";

type Props = {
  editing: boolean;
};

const DragList = ({ editing }: Props) => {
  // Get data from context
  const { girdSize } = useScaleContext();
  const { data, setData, finalData } = useDataContext();

  // State to track if the window is ready
  const [winReady, setwinReady] = React.useState(false);

  // State to display data
  const [displayData, setDisplayData] = React.useState<Data[]>([]);

  // Calculate item style for dragging
  const getItemStyle = (
    draggableStyle: DraggingStyle | NotDraggingStyle | undefined,
    start: number,
    end: number
  ) => ({
    minWidth: `${secToMs(end - start) / (10 * girdSize) - 2}px`,
    maxWidth: `${secToMs(end - start) / (10 * girdSize) - 2}px`,
    ...draggableStyle,
  });

  // Handle drag end event
  const onDragEnd = (result: DropResult) => {
    const { source, destination } = result;

    if (!destination) return;

    let newItems;
    if (source.droppableId === destination.droppableId) {
      // Move item within a frame
      newItems = reorder(
        data,
        source.droppableId,
        source.index,
        destination.index
      );
    } else {
      // Move item between different frames
      newItems = move(data, source, destination);
    }

    setData(newItems);
  };

  // Render individual frames
  const renderFrame = React.useCallback(
    (frame: Data) => {
      if (!frame["item"]) return;
      return frame["item"].map((item: Item, index: number) => (
        <Draggable
          key={item.id}
          draggableId={item.id}
          index={index}
          isDragDisabled={!editing}
        >
          {(provided) => (
            <div
              className={classnames(
                "border rounded-lg text-center p-2 ml-[2px] z-10",
                "overflow-hidden text-ellipsis whitespace-nowrap no-scrollbar",
                item.loop
                  ? "border-indigo-500 bg-black"
                  : "bg-indigo-500 border-black"
              )}
              ref={provided.innerRef}
              {...provided.draggableProps}
              {...provided.dragHandleProps}
              style={getItemStyle(
                provided.draggableProps.style,
                item.start,
                item.end
              )}
            >
              <Tooltip title={item.fileName}>
                {item.type == "image" && (
                  <img
                    src={item.src}
                    alt={item.id}
                    className="bg-white rounded-sm p-2"
                  />
                )}
                {item.type == "video" && (
                  <ReactPlayer
                    width="auto"
                    height="auto"
                    url={item.src}
                    playing={false}
                    muted
                  />
                )}
                {item.fileName}
              </Tooltip>
            </div>
          )}
        </Draggable>
      ));
    },
    [girdSize, editing]
  );

  // Set displayData state based on editing
  React.useEffect(() => {
    if (editing) setDisplayData(data);
    else setDisplayData(finalData);
  }, [editing]);

  // Set window ready state when component is mounted
  React.useEffect(() => {
    setwinReady(true);
  }, []);

  return (
    winReady && (
      <DragDropContext onDragEnd={onDragEnd}>
        {displayData.map((frame: Data, index: number) => (
          <Droppable
            key={index}
            droppableId={String(index)}
            direction="horizontal"
          >
            {(provided) => (
              <div className="flex items-center">
                <div
                  className={classnames(
                    "absolute -left-5 transform -rotate-90 w-16",
                    "overflow-hidden text-ellipsis whitespace-nowrap no-scrollbar"
                  )}
                >
                  <Tooltip title={frame.name}>{frame.name}</Tooltip>
                </div>
                <div
                  className="flex my-5 ml-3 pl-3"
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                >
                  {renderFrame(frame)}
                  {provided.placeholder}
                </div>
              </div>
            )}
          </Droppable>
        ))}
      </DragDropContext>
    )
  );
};

export default DragList;

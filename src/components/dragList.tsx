import React from "react";
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

const DragList = () => {
  const { girdSize } = useScaleContext();
  const { data, setData } = useDataContext();
  const [winReady, setwinReady] = React.useState(false);

  const getItemStyle = (
    draggableStyle: DraggingStyle | NotDraggingStyle | undefined,
    start: number,
    end: number
  ) => ({
    minWidth: `${secToMs(end - start) / (10 * girdSize) - 2}px`,
    maxWidth: `${secToMs(end - start) / (10 * girdSize) - 2}px`,
    ...draggableStyle,
  });

  const onDragEnd = (result: DropResult) => {
    const { source, destination } = result;

    if (!destination) return;

    let newItems;
    if (source.droppableId === destination.droppableId) {
      newItems = reorder(
        data,
        source.droppableId,
        source.index,
        destination.index
      );
    } else {
      newItems = move(data, source, destination);
    }

    setData(newItems);
  };

  const renderFrame = React.useCallback(
    (frame: any) => {
      return frame.map((item: any, index: number) => (
        <Draggable
          key={item.id}
          draggableId={item.id}
          index={index}
          isDragDisabled={item.loop}
        >
          {(provided) => (
            <div
              className={`${
                item.loop
                  ? "border-indigo-500 bg-black"
                  : "bg-indigo-500 border-black"
              } overflow-auto border rounded-lg text-center p-2 ml-[2px] z-10`}
              ref={provided.innerRef}
              {...provided.draggableProps}
              {...provided.dragHandleProps}
              style={getItemStyle(
                provided.draggableProps.style,
                item.start,
                item.end
              )}
            >
              {item.name}
            </div>
          )}
        </Draggable>
      ));
    },
    [girdSize]
  );

  React.useEffect(() => {
    setwinReady(true);
  }, []);

  return (
    winReady && (
      <DragDropContext onDragEnd={onDragEnd}>
        {data.map((frame: any, index: number) => (
          <Droppable
            key={index}
            droppableId={String(index)}
            direction="horizontal"
          >
            {(provided) => (
              <div
                className="flex my-5 ml-3"
                ref={provided.innerRef}
                {...provided.droppableProps}
              >
                {renderFrame(frame)}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        ))}
      </DragDropContext>
    )
  );
};

export default DragList;

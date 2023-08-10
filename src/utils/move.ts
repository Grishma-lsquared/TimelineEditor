import { DraggableLocation } from "react-beautiful-dnd";
import processFrame from "./processFrame";

const move = (
  list: any,
  droppableSource: DraggableLocation,
  droppableDestination: DraggableLocation
) => {
  const result = [...list];

  const droppableSourceId = Number(droppableSource.droppableId);
  const droppableDestinationId = Number(droppableDestination.droppableId);

  const sourceClone = Array.from(result[droppableSourceId]);
  const destClone = Array.from(result[droppableDestinationId]);
  const [removed] = sourceClone.splice(droppableSource.index, 1);

  destClone.splice(droppableDestination.index, 0, removed);

  result[droppableSourceId] = processFrame(sourceClone);
  result[droppableDestinationId] = processFrame(destClone);
  return result;
};

export default move;

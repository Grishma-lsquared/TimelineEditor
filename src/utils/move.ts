import { DraggableLocation } from "react-beautiful-dnd";
import processFrame from "./processFrame";
import { Data } from "@/types/dataType";

// Function to handle item movement between diffrent frames
const move = (
  list: Data[],
  droppableSource: DraggableLocation,
  droppableDestination: DraggableLocation
) => {
  // Clone the original list
  const result = [...list];

  // Convert droppable IDs to numbers
  const droppableSourceId = Number(droppableSource.droppableId);
  const droppableDestinationId = Number(droppableDestination.droppableId);

  // Clone source and destination arrays
  const sourceClone = Array.from(result[droppableSourceId]["item"]);
  const destClone = Array.from(result[droppableDestinationId]["item"]);

  // Remove the dragged item from the source frame and store it
  const [removed] = sourceClone.splice(droppableSource.index, 1);

  // Insert the removed item at the specified index in the destination frame
  destClone.splice(droppableDestination.index, 0, removed);

  // Process and update the modified source and destination frames
  result[droppableSourceId]["item"] = processFrame(sourceClone);
  result[droppableDestinationId]["item"] = processFrame(destClone);
  return result;
};

export default move;

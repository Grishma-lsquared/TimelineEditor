import { DroppableId } from "react-beautiful-dnd";
import processFrame from "./processFrame";
import { Data } from "@/types/dataType";

// Function to reorder items within a frame
const reorder = (
  list: Data[],
  droppableId: DroppableId,
  startIndex: number,
  endIndex: number
) => {
  // Clone the original frame
  const result = [...list];

  // Convert droppable ID to a number
  const dropIndex = Number(droppableId);

  // Clone the array of items within the frame
  const rowClone = Array.from(result[dropIndex]["item"]);

  // Remove the dragged item from its start index and store it
  const [removed] = rowClone.splice(startIndex, 1);

  // Insert the removed item at the specified end index
  rowClone.splice(endIndex, 0, removed);

  // Process and update the modified array of items within the frame
  result[dropIndex]["item"] = processFrame(rowClone);
  return result;
};

export default reorder;

import { DroppableId } from "react-beautiful-dnd";
import processFrame from "./processFrame";

const reorder = (
  list: any,
  droppableId: DroppableId,
  startIndex: number,
  endIndex: number
) => {
  const result = [...list];
  const dropIndex = Number(droppableId);

  const rowClone = Array.from(result[dropIndex]);
  const [removed] = rowClone.splice(startIndex, 1);

  rowClone.splice(endIndex, 0, removed);

  result[dropIndex] = processFrame(rowClone);
  return result;
};

export default reorder;

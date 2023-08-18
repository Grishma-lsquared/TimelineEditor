import { Item } from "@/types/dataType";

// Setting start and end times for each item in a frame
const processFrame = (frame: Item[]) => {
  let start = 0;

  // Map over each item in the frame
  return frame.map((e: Item) => {
    e.start = start;
    e.end = start + e.duration;
    start = e.end;
    return e;
  });
};

export default processFrame;

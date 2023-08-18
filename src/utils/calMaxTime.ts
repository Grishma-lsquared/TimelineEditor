import { Data, Item } from "@/types/dataType";

// Calculate the maximum total duration from a list of frames
const calMaxTime = (data: Data[]) => {
  let max = 0;

  // Iterate through each frame in the data
  data.forEach((frame: Data) => {
    if (!frame["item"]) return;

    let maxTimeFrame = 0;

    // Calculate the total duration within the frame
    frame["item"].forEach((e: Item) => {
      maxTimeFrame += e.duration;
    });

    // Update the maximum duration
    max = Math.max(max, maxTimeFrame);
  });
  return max;
};

export default calMaxTime;

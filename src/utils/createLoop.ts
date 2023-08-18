import processFrame from "./processFrame";
import { Data, Item } from "@/types/dataType";

// Create looped item array for a frame based on maxTime
const loopFrame = (frame: Item[], maxTime: number) => {
  const newFrame = [];

  let frameIndex = 0;
  let loopCount = 0;
  while (maxTime > 0) {
    // Reset frame index and increment loop count
    if (frameIndex === frame.length) {
      frameIndex = 0;
      loopCount += 1;
    }

    // Create a new frame object
    const newFrameObject = {
      ...frame[frameIndex],
      id: frame[frameIndex].id + `-${loopCount}`,
    };
    if (loopCount > 0) newFrameObject.loop = true;

    // Update duration and push to new frame array
    newFrameObject.duration = Math.min(maxTime, newFrameObject.duration);
    newFrame.push(newFrameObject);

    // Update maxTime and frame index
    maxTime -= newFrameObject.duration;
    frameIndex += 1;
  }

  return newFrame;
};

// Create looped data based on maxTime for each frame
const createLoop = (data: Data[], maxTime: number) => {
  const loopData: Data[] = [];

  // Loop through each frame in the data
  data.forEach((frame: Data) => {
    if (!(frame["item"] && frame["item"].length)) return;

    let new_frame = { ...frame };

    // Create a looped item array for a frame
    let new_item = loopFrame(new_frame["item"], maxTime);

    // Process the looped items in a frame
    new_frame["item"] = processFrame(new_item);

    loopData.push(new_frame);
  });
  return loopData;
};

export default createLoop;

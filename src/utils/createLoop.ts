import processFrame from "./processFrame";

const loopFrame = (frame: any[], maxTime: number) => {
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
      id: loopCount + frame[frameIndex].id,
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

const createLoop = (data: any[], maxTime: number) => {
  const loopData: any[] = [];
  data.forEach((frame: any[]) => {
    if (frame.length) {
      let new_frame = loopFrame(frame, maxTime);
      loopData.push(processFrame(new_frame));
    }
  });
  return loopData;
};

export default createLoop;

const processFrame = (frame: any) => {
  let start = 0;
  return frame.map((e: any) => {
    e.start = start;
    e.end = start + e.duration;
    start = e.end;
    return e;
  });
};

export default processFrame;

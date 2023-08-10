const calMaxTime = (data: any) => {
  let max = 0;
  data.forEach((frame: any) => {
    let maxTimeFrame = 0;
    frame.forEach((e: any) => {
      maxTimeFrame += e.duration;
    });
    max = Math.max(max, maxTimeFrame);
  });
  return max;
};

export default calMaxTime;

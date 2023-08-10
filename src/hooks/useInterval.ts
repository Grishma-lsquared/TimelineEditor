import React from "react";

const useInterval = (
  callback: () => void,
  delay: number,
  dependencies: boolean[]
) => {
  React.useEffect(() => {
    let interval: NodeJS.Timeout;
    interval = setInterval(callback, delay);

    return () => clearInterval(interval);
  }, [...dependencies]);
  return;
};

export default useInterval;

"use client";
import React from "react";

type Context = {
  msIncrease: number;
  pixelIncreaseRate: number;
  msPerPixel: number;
  girdSize: number;
  setGridSize: React.Dispatch<React.SetStateAction<number>>;
};

const scaleContext = React.createContext<Context>({
  msIncrease: 10,
  pixelIncreaseRate: 1,
  msPerPixel: 10,
  girdSize: 1,
  setGridSize: () => {},
});

export const useScaleContext = () => React.useContext(scaleContext);

const ScaleContextProvider = ({ children }: { children: React.ReactNode }) => {
  const msIncrease = 10;
  const [pixelIncreaseRate, setPixelIncreaseRate] = React.useState<number>(1);
  const [msPerPixel, setMsPerPixel] = React.useState<number>(10);
  const [girdSize, setGridSize] = React.useState<number>(1);

  React.useEffect(() => {
    setMsPerPixel(msIncrease / pixelIncreaseRate);
  }, [pixelIncreaseRate]);

  React.useEffect(() => {
    setPixelIncreaseRate(1 / girdSize);
  }, [girdSize]);

  return (
    <scaleContext.Provider
      value={{
        msIncrease,
        pixelIncreaseRate,
        msPerPixel,
        girdSize,
        setGridSize,
      }}
    >
      {children}
    </scaleContext.Provider>
  );
};

export default ScaleContextProvider;

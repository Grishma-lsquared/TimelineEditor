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
  girdSize: 5,
  setGridSize: () => {},
});

export const useScaleContext = () => React.useContext(scaleContext);

const ScaleContextProvider = ({ children }: { children: React.ReactNode }) => {
  // Default values for the scale configuration
  const msIncrease = 10; // Increase in milliseconds
  const [pixelIncreaseRate, setPixelIncreaseRate] = React.useState<number>(1); // Rate of pixel increase
  const [msPerPixel, setMsPerPixel] = React.useState<number>(10); // Milliseconds per pixel
  const [girdSize, setGridSize] = React.useState<number>(5); // Size of the grid

  // Update msPerPixel on pixelIncreaseRate change
  React.useEffect(() => {
    setMsPerPixel(msIncrease / pixelIncreaseRate);
  }, [pixelIncreaseRate]);

  // Update pixelIncreaseRate on girdSize change
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

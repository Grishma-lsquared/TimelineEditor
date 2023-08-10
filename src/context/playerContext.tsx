"use client";
import React from "react";

type Context = {
  play: boolean;
  setPlay: React.Dispatch<React.SetStateAction<boolean>>;
  time: number;
  setTime: React.Dispatch<React.SetStateAction<number>>;
};

const playerContext = React.createContext<Context>({
  play: false,
  setPlay: () => {},
  time: 0,
  setTime: () => {},
});

export const usePlayerContext = () => React.useContext(playerContext);

const PlayerContextProvider = ({ children }: { children: React.ReactNode }) => {
  const [play, setPlay] = React.useState<boolean>(false);
  const [time, setTime] = React.useState<number>(0);

  return (
    <playerContext.Provider value={{ play, setPlay, time, setTime }}>
      {children}
    </playerContext.Provider>
  );
};

export default PlayerContextProvider;

"use client";
import React from "react";
import { notification } from "antd";
import { schedule } from "@/data/data";
import { processFrame, calMaxTime, createLoop } from "@/utils";

type NotificationType = "success" | "error";

type Context = {
  data: any[];
  setData: React.Dispatch<React.SetStateAction<any[]>>;
  maxTime: number;
  setMaxTime: React.Dispatch<React.SetStateAction<number>>;
  finalData: any[];
  submitData: () => void;
};

const dataContext = React.createContext<Context>({
  data: [],
  setData: () => {},
  maxTime: 0,
  setMaxTime: () => {},
  finalData: [],
  submitData: () => {},
});

export const useDataContext = () => React.useContext(dataContext);

const DataContextProvider = ({ children }: { children: React.ReactNode }) => {
  const [data, setData] = React.useState<any[]>([]);
  const [finalData, setFinalData] = React.useState<any[]>([]);
  const [maxTime, setMaxTime] = React.useState<number>(0);
  const [api, contextHolder] = notification.useNotification();

  const openNotification = (type: NotificationType) => {
    api[type]({
      message: "Data Saved",
      duration: 2,
      style: { width: 300 },
    });
  };

  const processData = () => {
    const new_data: any[] = [];
    schedule.forEach((frame: any, index: number) => {
      new_data[index] = processFrame(frame);
    });
    return new_data;
  };

  const submitData = () => {
    console.log(data);
    openNotification("success");
  };

  React.useEffect(() => {
    setMaxTime(calMaxTime(data));
  }, [data]);

  React.useEffect(() => {
    setFinalData(createLoop(data, maxTime));
  }, [maxTime, data]);

  React.useEffect(() => {
    setData(processData());
  }, []);

  return (
    <dataContext.Provider
      value={{ data, setData, maxTime, setMaxTime, finalData, submitData }}
    >
      {contextHolder}
      {children}
    </dataContext.Provider>
  );
};

export default DataContextProvider;

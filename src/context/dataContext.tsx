"use client";
import React from "react";
import feed from "@/data/feed.json";
import { notification } from "antd";
import { processFrame, calMaxTime, createLoop } from "@/utils";
import { Data } from "@/types/dataType";

export type NotificationType = "success" | "error";

export type Context = {
  data: Data[];
  setData: React.Dispatch<React.SetStateAction<Data[]>>;
  maxTime: number;
  setMaxTime: React.Dispatch<React.SetStateAction<number>>;
  finalData: Data[];
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
  // State to manage data, finalData, and maxTime
  const [data, setData] = React.useState<Data[]>([]);
  const [finalData, setFinalData] = React.useState<Data[]>([]);
  const [maxTime, setMaxTime] = React.useState<number>(0);

  // Ant Design notification API
  const [api, contextHolder] = notification.useNotification();

  // Function to retrieve data from the JSON feed
  const getData = () => {
    const response = feed;
    return response["layout"][0]["frame"] as Data[];
  };

  // Process data to add 'start' and 'end' for individual frames
  const processData = (data: Data[]) => {
    const new_data: Data[] = [];
    data.forEach((frame: Data, index: number) => {
      new_data[index] = frame;
      if (new_data[index]["item"]) {
        new_data[index]["item"] = processFrame(new_data[index]["item"]);
      }
    });
    return new_data;
  };

  // Open a notification with specified type
  const openNotification = (type: NotificationType) => {
    api[type]({
      message: "Data Saved",
      duration: 2,
      style: { width: 300 },
    });
  };

  // Function to handle data submission
  const submitData = () => {
    console.log(data);
    openNotification("success");
  };

  // Update maxTime on data change
  React.useEffect(() => {
    setMaxTime(calMaxTime(data));
  }, [data]);

  // Update finalData on maxTime or data change
  React.useEffect(() => {
    setFinalData(createLoop(data, maxTime));
  }, [maxTime, data]);

  // Load initial data on component mount
  React.useEffect(() => {
    setData(processData(getData()));
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

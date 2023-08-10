"use client";
import React from "react";
import Player from "@/components/player";
import TimeLine from "@/components/timeline";

export default function Home() {
  return (
    <React.Fragment>
      <Player />
      <TimeLine />
    </React.Fragment>
  );
}

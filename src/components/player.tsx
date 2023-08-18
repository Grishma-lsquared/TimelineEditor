import React from "react";
import classnames from "classnames";
import ReactPlayer from "react-player";
import { useDataContext } from "@/context/dataContext";
import { usePlayerContext } from "@/context/playerContext";
import { msToSec } from "@/utils";
import { Data, Item } from "@/types/dataType";

const Player = () => {
  const videoPlayer = React.useRef<ReactPlayer[] | null[]>([]);
  const { finalData } = useDataContext();
  const { play, time } = usePlayerContext();
  const [isOdd, setIsOdd] = React.useState<boolean>(false);

  // Function to seek the player to a specific time
  const moveTo = (time: number, ref: ReactPlayer) => {
    const seconds = msToSec(time);
    const start = ref.props.start;
    ref.seekTo(seconds - start, "seconds");
  };

  // Function to render players for the current frame
  const renderPlayer = React.useCallback(
    (frame: Item[], index: number) =>
      frame.map(
        (e: Item) =>
          msToSec(time) >= e.start &&
          msToSec(time) < e.end && (
            <React.Fragment key={e.id}>
              {e.type == "image" && <img src={e.src} alt={e.id} />}
              {e.type == "video" && (
                <ReactPlayer
                  ref={(ref) => {
                    videoPlayer.current[index] = ref;
                  }}
                  url={e.src}
                  playing={play}
                  start={e.start}
                  muted
                />
              )}
            </React.Fragment>
          )
      ),
    [time, videoPlayer, play]
  );

  // Update the player's time based on time context
  React.useEffect(() => {
    if (play) return;
    videoPlayer.current.forEach((e: ReactPlayer | null) => {
      if (!e) return;
      moveTo(time, e);
    });
  }, [time]);

  // Update isOdd state based on finalData length
  React.useEffect(() => {
    if (finalData.length % 2 == 0) setIsOdd(false);
    else setIsOdd(true);
  }, [finalData]);

  return (
    <div className="grid grid-cols-2 max-h-[90vh] min-h-[90vh] bg-white">
      {finalData.map((frame: Data, index: number) => {
        if (!(frame["item"] && frame["item"].length)) return;
        return (
          <div
            key={index}
            className={classnames(
              "flex justify-center items-center",
              "border-2 border-black ",
              isOdd && index == finalData.length - 1
                ? "min-w-[100vw] px-4"
                : "max-w-[50vw] px-2"
            )}
          >
            {renderPlayer(frame["item"], index)}
          </div>
        );
      })}
    </div>
  );
};

export default Player;

import React from "react";
import classnames from "classnames";
import ReactPlayer from "react-player";
import { useDataContext } from "@/context/dataContext";
import { usePlayerContext } from "@/context/playerContext";
import { msToSec } from "@/utils";

const Player = () => {
  const videoPlayer = React.useRef<ReactPlayer[] | null[]>([]);
  const { finalData } = useDataContext();
  const { play, time } = usePlayerContext();
  const [isOdd, setIsOdd] = React.useState<boolean>(false);

  const moveTo = (time: number, ref: ReactPlayer) => {
    const seconds = msToSec(time);
    const start = ref.props.start;
    ref.seekTo(seconds - start, "seconds");
  };

  const renderPlayer = React.useCallback(
    (frame: any, index: number) =>
      frame.map(
        (e: any) =>
          msToSec(time) >= e.start &&
          msToSec(time) < e.end && (
            <React.Fragment key={e.id}>
              {e.type == "image" && <img src={e.src} alt={e.name} />}
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

  React.useEffect(() => {
    if (play) return;
    videoPlayer.current.forEach((e: ReactPlayer | null) => {
      if (!e) return;
      moveTo(time, e);
    });
  }, [time]);

  React.useEffect(() => {
    if (finalData.length % 2 == 0) setIsOdd(false);
    else setIsOdd(true);
  }, [finalData]);

  return (
    <div className="grid grid-cols-2 max-h-[90vh] min-h-[90vh] bg-white">
      {finalData.map((frame: any[], index: number) => {
        if (!frame.length) return;
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
            {renderPlayer(frame, index)}
          </div>
        );
      })}
    </div>
  );
};

export default Player;

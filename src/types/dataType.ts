export type Item = {
  id: string;
  sid: number;
  duration: number;
  type: string;
  ovr: number;
  filesize?: number;
  fileName?: string;
  src: string;
  fs?: string;
  downloadable?: string;
  active: number;
  scale: string;
  dType?: string;
  settings?: string;
  iid?: number;
  actualDuration?: number;
  cue?: string;
  sound?: string;
  mute?: number;
  start: number;
  end: number;
  loop: boolean;
};

export type Data = {
  sort: string;
  id: number;
  name: string;
  w: number;
  h: number;
  x: number;
  y: number;
  z: number;
  r: number;
  bg: string;
  align: string;
  a: string;
  bga: number;
  timeRange: string;
  tr: string;
  st: string;
  et: string;
  settings: string;
  item: Item[];
};

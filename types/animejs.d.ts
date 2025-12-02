declare module "animejs" {
  interface AnimeParams {
    targets?: string | Element | Element[] | NodeList | null;
    duration?: number;
    delay?: number | ((el: Element, i: number, l: number) => number);
    endDelay?: number;
    easing?: string;
    round?: number;
    direction?: "normal" | "reverse" | "alternate";
    loop?: boolean | number;
    autoplay?: boolean;
    translateX?: number | number[] | string | string[];
    translateY?: number | number[] | string | string[];
    translateZ?: number | number[] | string | string[];
    rotate?: number | number[] | string | string[];
    rotateX?: number | number[] | string | string[];
    rotateY?: number | number[] | string | string[];
    rotateZ?: number | number[] | string | string[];
    scale?: number | number[];
    scaleX?: number | number[];
    scaleY?: number | number[];
    scaleZ?: number | number[];
    skew?: number | number[];
    skewX?: number | number[];
    skewY?: number | number[];
    perspective?: number | number[];
    opacity?: number | number[];
    color?: string | string[];
    backgroundColor?: string | string[];
    borderRadius?: number | number[] | string | string[];
    boxShadow?: string | string[];
    width?: number | number[] | string | string[];
    height?: number | number[] | string | string[];
    maxHeight?: number | number[] | string | string[];
    left?: number | number[] | string | string[];
    top?: number | number[] | string | string[];
    begin?: (anim: AnimeInstance) => void;
    update?: (anim: AnimeInstance) => void;
    complete?: (anim: AnimeInstance) => void;
    [key: string]: any;
  }

  interface AnimeInstance {
    play: () => void;
    pause: () => void;
    restart: () => void;
    reverse: () => void;
    seek: (time: number) => void;
    began: boolean;
    paused: boolean;
    completed: boolean;
    finished: Promise<void>;
    currentTime: number;
    progress: number;
    duration: number;
  }

  interface AnimeTimelineInstance extends AnimeInstance {
    add: (params: AnimeParams, offset?: string | number) => AnimeTimelineInstance;
  }

  interface AnimeStaggerOptions {
    start?: number | string;
    from?: number | string | "first" | "last" | "center";
    direction?: "normal" | "reverse";
    easing?: string;
    grid?: [number, number];
    axis?: "x" | "y";
  }

  function anime(params: AnimeParams): AnimeInstance;

  namespace anime {
    function timeline(params?: AnimeParams): AnimeTimelineInstance;
    function stagger(
      value: number | string | number[],
      options?: AnimeStaggerOptions
    ): (el: Element, i: number, l: number) => number;
    function set(targets: any, properties: object): void;
    function remove(targets: any): void;
    function get(target: any, propertyName: string, unit?: string): string | number;
    function random(min: number, max: number): number;
    const version: string;
    const running: AnimeInstance[];
  }

  export = anime;
}

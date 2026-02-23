type State = {
  featuredImg: string;
  listeners: (() => void)[];
  listen: (fn: () => void) => void;
};

export const myState = new Proxy<State>(
  {
    featuredImg: "img-1",
    listeners: [],
    listen: (fn) => myState.listeners.push(fn),
  },
  {
    set: (target, key, value) => {
      if (key !== "featuredImg") return false;
      target.featuredImg = String(value);
      target.listeners.forEach((fn) => fn());
      return true;
    },
  },
);

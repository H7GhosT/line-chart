export const formatUnix = timestamp =>
  new Date(timestamp)
    .toString()
    .split(" ")
    .slice(1, 1 + 2)
    .join(" ");

export const linearBezier = (t, a, b) => a + t * (b - a);

export const hexOpacity = (hex, o) =>
  hex +
  Math.floor(o * 255)
    .toString(16)
    .padStart(2, "0");

const AS = {
  clearAnimation: Symbol("clear animation"),
  animationTimeProgress: Symbol("animation time progress")
};

export const createAnimation = (
  state,
  onChangeState = () => {},
  animationTime
) => {
  const { animationTimeProgress, clearAnimation } = AS;

  state[clearAnimation] = () => {};

  const initial = {};

  return newState => {
    state[clearAnimation]();
    let animationStarted = true;
    state[clearAnimation] = () => (animationStarted = false);

    for (const field in newState) {
      initial[field] = state[field];
    }

    let start = state[animationTimeProgress];

    const _animate = timestamp => {
      if (!start) start = timestamp;

      state[animationTimeProgress] = timestamp;

      const progress = Math.min(1, (timestamp - start) / animationTime);

      for (const field in initial)
        state[field] = linearBezier(progress, initial[field], newState[field]);

      onChangeState();

      if (progress < 1 && animationStarted) {
        window.requestAnimationFrame(_animate);
      } else {
        state[animationTimeProgress] = null;
      }
    };
    window.requestAnimationFrame(_animate);
  };
};

export const copy = obj => {
  if (obj instanceof Date) return new Date(obj);
  if (obj instanceof Array) return obj.map(o => copy(o));
  if (obj instanceof Object) {
    const newObj = {};
    Object.keys(obj).forEach(key => (newObj[key] = copy(obj[key])));
    return newObj;
  }
  return obj;
};

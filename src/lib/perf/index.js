import * as R from 'ramda';

const isDev = process.env.NODE_ENV === 'development';
const isSilent = true;

export const perfToMeasure = (id) => {
  const startTimestamp = performance.now();

  return {
    end: () => {
      const globalId = `${id}_measuredPerf`;
      const endTimestamp = performance.now();
      const actualDuration = endTimestamp - startTimestamp;

      window[globalId] = R.defaultTo(0, window[globalId]);
      window[globalId] = window[globalId] + actualDuration;

      if (isDev && !isSilent) {
        // eslint-disable-next-line no-console
        console.log(
          `The ${globalId} interaction took ` +
            `${actualDuration}ms to render (${window[globalId]})`,
        );
      }
    },
  };
};

export const profilerOnRender = (id, phase, actualDuration) => {
  const globalId = `${id}_profiler`;

  window[globalId] = R.defaultTo(0, window[globalId]);
  window[globalId] = window[globalId] + actualDuration;

  if (isDev && !isSilent) {
    // eslint-disable-next-line no-console
    console.log(
      `The ${globalId} interaction (${phase}) took ` +
        `${actualDuration}ms to render (${window[globalId]})`,
    );
  }
};

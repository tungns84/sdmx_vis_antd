import { hashObject } from '../utils';

export const queryKeyFactory = (ctx) => {
  return [
    'map',
    ctx.method,
    hashObject(ctx.requestsArgs ? ctx.requestsArgs : ctx.requestArgs),
  ];
};

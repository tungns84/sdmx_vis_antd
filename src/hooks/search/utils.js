import { hashObject } from '../utils';

export const queryKeyFactory = (ctx) => {
  return [
    'search',
    ctx.method,
    hashObject(ctx.requestsArgs ? ctx.requestsArgs : ctx.requestArgs),
  ];
};

const isUndefined = (obj: unknown): obj is undefined => typeof obj === 'undefined';

export const isNil = (val: unknown): val is null | undefined => isUndefined(val) || val === null;

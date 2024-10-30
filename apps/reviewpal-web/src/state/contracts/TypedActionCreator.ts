import type { Action } from '@reduxjs/toolkit';

export type TypedActionCreator<Type extends string> = {
  (...args: unknown[]): Action<Type>;
  type: Type;
};

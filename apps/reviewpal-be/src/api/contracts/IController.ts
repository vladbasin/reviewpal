import type { Router } from 'express';

export interface IController {
  register(router: Router): void;
}

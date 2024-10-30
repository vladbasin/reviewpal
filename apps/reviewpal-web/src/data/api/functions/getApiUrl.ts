import { ApiHostProcessConfig } from '@reviewpal/web/cross-cutting';

export const getApiUrl = (route: string): string => new URL(route, ApiHostProcessConfig).toString();

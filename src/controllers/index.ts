import { HealthControllers } from './health';
import { VideosControllers } from './videos';

export const Controllers = [...VideosControllers, ...HealthControllers];

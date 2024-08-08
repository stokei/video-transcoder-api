import { UploadsServices } from './uploads';
import { VideosServices } from './videos';

export const Services = [...VideosServices, ...UploadsServices];

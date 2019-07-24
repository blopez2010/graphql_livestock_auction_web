import { Event, People } from '.';

export interface Item {
  id: string;
  description: string;
  event: Event;
  owner: People;
}

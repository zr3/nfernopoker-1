import { Player } from "./index";

export interface Team {
  owner: string;
  ownerEmail: string;
  name: string
  players: Array<Player>;
}

type MessageServiceType =
  | "toggle-pause"
  | "toggle-left"
  | "toggle-right"
  | "toggle-up"
  | "toggle-down"
  | "toggle-grab"
  | "player1-take-damage"
  | "player1-fire-up"
  | "player1-fire-down"
  | "player1-fire-left"
  | "player1-fire-right"
  | "projectile-collision"
  | "enemy-death"
  | "enemy-collision"
  | "enemy-attack"
  | "player-death"
  | "navigate-screen";

export default MessageServiceType;

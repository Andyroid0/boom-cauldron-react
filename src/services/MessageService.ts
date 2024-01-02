import DungeonState from "../types/DungeonState.class";
import MessageServiceType from "../types/MessageServiceType.type";

export default class MessageService {
  public static send(msg: MessageServiceType) {
    window.postMessage(msg);
  }

  constructor(context: DungeonState) {
    const handleEvent = (event: MessageEvent) => {
      switch (event.data as MessageServiceType) {
        case "toggle-pause":
          context.paused = !context.paused;
          break;
        case "toggle-left":
          context.left = !context.left;
          break;
        case "toggle-right":
          context.right = !context.right;
          break;
        case "toggle-up":
          context.up = !context.up;
          break;
        case "toggle-down":
          context.down = !context.down;
          break;
        case "toggle-grab":
          context.grab = !context.grab;
          break;
      }
    };
    window.addEventListener("message", handleEvent);
  }
}

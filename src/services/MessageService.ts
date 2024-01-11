import InputState from "../types/InputState.class";
import MessageServiceType from "../types/MessageServiceType.type";
import MessageServiceWithAmount from "../types/MessageServiceWithAmount.interface";
import MessageServiceWithOriginIDAmount from "../types/MessageServiceWithOriginIDAmount.interface";
import MessageServiceWithID from "../types/MessageServiceWithID.interface";

export default class MessageService {
  public static send(msg: MessageServiceType) {
    window.postMessage(msg);
  }

  public static sendWithAmount(value: MessageServiceWithAmount) {
    const { type, amount } = value;
    window.postMessage({ type, amount });
  }

  public static sendWithOriginIDAmount(
    value: MessageServiceWithOriginIDAmount,
  ) {
    const { type, origin, id, amount } = value;
    window.postMessage({ type, origin, id, amount });
  }

  public static sendWithID(value: MessageServiceWithID) {
    const { type, id } = value;
    window.postMessage({ type, id });
  }

  constructor(context: InputState) {
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

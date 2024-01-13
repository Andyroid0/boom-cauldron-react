import InputState from "../types/InputState.class";
import MessageServiceType from "../types/MessageServiceType.type";
import MessageServiceWithAmount from "../types/MessageServiceWithAmount.interface";
import MessageServiceWithOriginIDAmount from "../types/MessageServiceWithOriginIDAmount.interface";
import MessageServiceWithID from "../types/MessageServiceWithID.interface";
import MessageServiceWithIDAmount from "../types/MessageServiceWithIDAmount.interface";

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

  public static sendWithIDAmount(value: MessageServiceWithIDAmount) {
    const { type, id, amount } = value;
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
      }
    };
    window.addEventListener("message", handleEvent);
  }
}

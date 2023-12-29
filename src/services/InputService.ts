export type EventType = "move-left" | "move-right" | "move-down" | "move-up";

// eslint-disable-next-line @typescript-eslint/no-extraneous-class
export default class InputService {
  public static fireEvent = (type: EventType) => {
    new CustomEvent(type, { detail: {} });
  };
  // Need to addEventListener to
}

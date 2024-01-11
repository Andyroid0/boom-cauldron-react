import MessageServiceType from "./MessageServiceType.type";

export default interface MessageServiceWithID {
  type: MessageServiceType;
  id: string;
}

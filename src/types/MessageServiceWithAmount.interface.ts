import MessageServiceType from "./MessageServiceType.type";

export default interface MessageServiceWithAmount {
  type: MessageServiceType;
  amount: number;
}

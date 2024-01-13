import MessageServiceType from "./MessageServiceType.type";

export default interface MessageServiceWithIDAmount {
  type: MessageServiceType;
  id?: string;
  amount: number;
}

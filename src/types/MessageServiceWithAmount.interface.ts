import MessageServiceType from "./MessageService/MessageServiceTypeParam.type";

export default interface MessageServiceWithAmount {
  type: MessageServiceType;
  amount: number;
}

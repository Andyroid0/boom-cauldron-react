import MessageServiceType from "./MessageService/MessageServiceTypeParam.type";

export default interface MessageServiceWithIDAmount {
  type: MessageServiceType;
  id?: string;
  amount: number;
}

import MessageServiceType from "./MessageService/MessageServiceTypeParam.type";

export default interface MessageServiceWithID {
  type: MessageServiceType;
  id: string;
}

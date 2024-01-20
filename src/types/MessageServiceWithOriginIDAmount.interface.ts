import MessageServiceType from "./MessageService/MessageServiceTypeParam.type";
import MessageServiceOrigin from "./MessageService/MessageServiceOriginType.type";

export default interface MessageServiceWithOriginIDAmount {
  type: MessageServiceType;
  origin: MessageServiceOrigin;
  id?: string;
  amount: number;
}

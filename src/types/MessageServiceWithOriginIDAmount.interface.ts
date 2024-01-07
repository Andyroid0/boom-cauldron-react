import MessageServiceType from "./MessageServiceType.type";
import MessageServiceOrigin from "./MessageServiceOrigin.type";

export default interface MessageServiceWithOriginIDAmount {
  type: MessageServiceType;
  origin: MessageServiceOrigin;
  id?: string;
  amount: number;
}

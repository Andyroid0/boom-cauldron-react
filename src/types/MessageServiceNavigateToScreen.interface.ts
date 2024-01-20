import NavPath from "./NavPath.type";
import MessageServiceType from "./MessageService/MessageServiceTypeParam.type";

export default interface MessageServiceNavigateToScreen {
  type: MessageServiceType;
  screen: NavPath;
}

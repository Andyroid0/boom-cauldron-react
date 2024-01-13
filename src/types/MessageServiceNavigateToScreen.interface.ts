import NavPath from "./NavPath.type";
import MessageServiceType from "./MessageServiceType.type";

export default interface MessageServiceNavigateToScreen {
  type: MessageServiceType;
  screen: NavPath;
}

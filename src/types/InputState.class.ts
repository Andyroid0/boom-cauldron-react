import useStateStore from "../context/useStateStore";

export default class InputState {
  public paused = useStateStore.getState().paused;
}

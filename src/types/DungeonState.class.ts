import useStateStore from "../context/useStateStore";

export default class DungeonState {
  public paused = useStateStore.getState().paused;
  public left = useStateStore.getState().left;
  public right = useStateStore.getState().right;
  public up = useStateStore.getState().up;
  public down = useStateStore.getState().down;
  public grab = useStateStore.getState().grab;
}

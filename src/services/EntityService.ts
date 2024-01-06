import { nanoid } from "nanoid";

export default class EntityService {
  public static generateID() {
    return nanoid();
  }
}

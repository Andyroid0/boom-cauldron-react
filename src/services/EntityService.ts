/* eslint-disable @typescript-eslint/no-extraneous-class */
import { nanoid } from "nanoid";

export default class EntityService {
  public static generateID() {
    return nanoid();
  }
}

import { useEffect } from "react";

import useStateStore from "../context/useStateStore";
import MessageServiceTypeParam from "../types/MessageService/MessageServiceTypeParam.type";
import MessageServiceType from "../types/MessageService/MessageService.Type.interface";
import MessageServiceAmount from "../types/MessageService/MessageService.Amount.interface";
import MessageServiceID from "../types/MessageService/MessageService.ID.interface";
import MessageServiceOriginType from "../types/MessageService/MessageServiceOriginType.type";
import MessageServiceOrigin from "../types/MessageService/MessageService.Origin.interface";
import MessageServiceNavPath from "../types/MessageService/MessageService.navPath.interface";
import NavPath from "../types/NavPath.type";

export default class MessageService {
  public static useNavigate = (
    callback: (eventData: MessageServiceType & MessageServiceNavPath) => void,
  ) => {
    const handleEvent = (event: MessageEvent) => {
      if (event.data.type === "navigate-screen") {
        callback(event.data as MessageServiceType & MessageServiceNavPath);
      }
    };
    useEffect(() => {
      window.addEventListener("message", handleEvent);
      return () => window.removeEventListener("message", handleEvent);
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
  };

  public static usePauseListener = (callback: () => void) => {
    const handleEvent = (event: MessageEvent<MessageServiceTypeParam>) => {
      if (event.data === "toggle-pause") {
        callback();
      }
    };
    window.addEventListener("message", handleEvent);
    useEffect(() => {
      window.addEventListener("message", handleEvent);
      return () => window.removeEventListener("message", handleEvent);
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
  };

  public static listenForPlayerFire = (
    callback: (data: MessageServiceType & MessageServiceAmount) => void,
  ) => {
    const handleEvent = (event: MessageEvent) => {
      callback(event.data);
    };
    window.addEventListener("message", handleEvent);
  };

  public static listenForPause = (callback: () => void) => {
    const handleEvent = (event: MessageEvent<MessageServiceTypeParam>) => {
      if (event.data === "toggle-pause") {
        callback();
      }
    };
    window.addEventListener("message", handleEvent);
  };

  public static listenForEnemyAttacks = (
    callback: (
      event: MessageEvent<
        MessageServiceType &
          MessageServiceID &
          MessageServiceAmount &
          MessageServiceOrigin
      >,
    ) => void,
  ) => {
    window.addEventListener("message", callback);
  };

  public static listenForProjectileHitEnemy = (
    collisionCallback: (
      event: MessageEvent<
        MessageServiceType &
          MessageServiceID &
          MessageServiceAmount &
          MessageServiceOrigin
      >,
    ) => void,
    deathCallback: (
      event: MessageEvent<
        MessageServiceType &
          MessageServiceID &
          MessageServiceAmount &
          MessageServiceOrigin
      >,
    ) => void,
  ) => {
    const handleEvent = (
      event: MessageEvent<
        MessageServiceType &
          MessageServiceID &
          MessageServiceAmount &
          MessageServiceOrigin
      >,
    ) =>
      event.data.type === "projectile-collision"
        ? collisionCallback(event)
        : event.data.type === "enemy-death"
          ? deathCallback(event)
          : null;
    window.addEventListener("message", handleEvent);
  };

  public static sendWithOriginIDAmount(
    value: MessageServiceType &
      MessageServiceID &
      MessageServiceAmount &
      MessageServiceOrigin,
  ) {
    const { type, origin, id, amount } = value;
    window.postMessage({ type, origin, id, amount });
  }

  public static projectileHitEnemy(
    origin: MessageServiceOriginType,
    id: string,
    amount: number,
  ) {
    window.postMessage({
      type: "projectile-collision",
      origin,
      id,
      amount,
    } as MessageServiceType &
      MessageServiceID &
      MessageServiceAmount &
      MessageServiceOrigin);
  }

  public static enemyAttackPlayer(id: string, amount: number) {
    window.postMessage({
      type: "enemy-attack",
      id,
      amount,
    } as MessageServiceType & MessageServiceID & MessageServiceAmount);
  }

  public static enemyDeath(id: string) {
    window.postMessage({ type: "enemy-death", id } as MessageServiceType &
      MessageServiceID);
  }

  public static navigateScreen(screen: NavPath) {
    window.postMessage({ type: "navigate-screen", screen });
  }

  public static fire(type: MessageServiceTypeParam, amount: number) {
    window.postMessage({ type, amount });
  }

  public static pause() {
    const msg: MessageServiceTypeParam = "toggle-pause";
    window.postMessage({ type: msg });
    useStateStore.getState().togglePaused();
  }
}

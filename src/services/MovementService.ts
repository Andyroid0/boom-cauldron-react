import MoveState from "../types/MoveState";

class MovementService {
  /**
   * sets enity velocity
   * @param moveState moveState : the actors move state
   * @param velocity **[X and Y coordinate object]** {x: number, y: number} : the players velocity
   * @param speed number : the players speed
   * @returns **[Player Velocity]** -- *{x: number, y: number}*
   */
  public static calculateVelocity = (
    moveState: MoveState,
    velocity: { x: number; y: number },
    speed: number,
  ): { x: number; y: number } => {
    switch (moveState) {
      case "idle":
        if (velocity.x !== 0 && velocity.y !== 0) {
          const x = velocity.x;
          const y = velocity.y;
          return { x: x / 3, y: y / 3 };
        } else return { x: 0, y: 0 };

      case "down":
        return { x: 0, y: speed };

      case "downLeft":
        return { x: -speed, y: speed };

      case "downRight":
        return { x: speed, y: speed };

      case "up":
        return { x: 0, y: -speed };

      case "upLeft":
        return { x: -speed, y: -speed };

      case "upRight":
        return { x: speed, y: -speed };

      case "left":
        return { x: -speed, y: 0 };

      case "right":
        return { x: speed, y: 0 };
    }
  };

  public static pathFindingCompass(
    targetX: number,
    targetY: number,
    currentX: number,
    currentY: number,
  ): MoveState {
    const isLeft = currentX > targetX && currentY === targetY;
    const isRight = currentX < targetX && currentY === targetY;
    const isUp = currentX === targetX && currentY > targetY;
    const isDown = currentX === targetX && currentY < targetY;
    const isUpLeft = currentX > targetX && currentY > targetY;
    const isUpRight = currentX < targetX && currentY > targetY;
    const isDownLeft = currentX > targetX && currentY < targetY;
    const isDownRight = currentX < targetX && currentY < targetY;

    if (isLeft) return "left";
    else if (isRight) return "right";
    else if (isUp) return "up";
    else if (isDown) return "down";
    else if (isUpLeft) return "upLeft";
    else if (isUpRight) return "upRight";
    else if (isDownLeft) return "downLeft";
    else if (isDownRight) return "downRight";
    else return "idle";
  }
}
export default MovementService;

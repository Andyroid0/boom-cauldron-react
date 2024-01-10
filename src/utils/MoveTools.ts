class MoveTools {
  /** Make sure to run inside of update.*/
  public static moveToTargetPoint(
    scene: Phaser.Scene,
    sprite: Phaser.Physics.Matter.Sprite,
    targetX: number,
    targetY: number,
    speed: number,
    stoppingDistance = 5,
    isTraveling: boolean,
  ) {
    const direction = new Phaser.Math.Vector2(
      targetX - sprite.x,
      targetY - sprite.y,
    );
    const distance = direction.length();

    if (distance > stoppingDistance) {
      direction.normalize();
      const velocityX = direction.x * speed;
      const velocityY = direction.y * speed;
      sprite.setVelocity(velocityX, velocityY);
    } else {
      sprite.setVelocity(0, 0);
      // eslint-disable-next-line no-param-reassign
      if (isTraveling) isTraveling = false;
    }
  }

  public static moveTowardTarget(
    scene: Phaser.Scene,
    sprite: Phaser.Physics.Matter.Sprite,
    targetX: number,
    targetY: number,
    speed: number,
  ) {
    const direction = new Phaser.Math.Vector2(
      targetX - sprite.x,
      targetY - sprite.y,
    );
    direction.normalize();
    const forceX = direction.x * speed;
    const forceY = direction.y * speed;
    sprite.setVelocity(forceX, forceY);
  }
}
export default MoveTools;

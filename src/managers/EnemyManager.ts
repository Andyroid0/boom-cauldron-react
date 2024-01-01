import { Input, GameObjects, Scene, Types, Tilemaps } from "phaser";
import EasyStar from "easystarjs";

class EnemyManager {
    protected health: number; 
    easyStar: EasyStar.js = new EasyStar.js();
    map: Tilemaps.Tilemap | null = null;
    player: GameObjects.Graphics | null = null;

    constructor(health: number, easyStar: EasyStar.js) {
        this.health = health;
        this.easyStar = easyStar;
    }

    takeDamage(damage: number) {
        this.health -= damage;
        console.log( 'you reffed me and damaged my snarl')
    }

    findPath() {
        if (!this.map || !this.player) return;

        this.easyStar.findPath(
            this.map.worldToTileX(this.x) as number,
            this.map.worldToTileY(this.y) as number,
            this.map.worldToTileX(this.player.x) as number,
            this.map.worldToTileY(this.player.y) as number,
            (path) => {
              // eslint-disable-next-line no-alert
              if (path === null) alert("Path was not found.");
              else {
                // eslint-disable-next-line no-alert
                alert(`Path was found. The first Point is ${path[0].x} ${path[0].y}`);
              }
            },
          );
          this.easyStar.calculate();
    }
}

class Player extends EnemyManager {
    constructor(health: number) {
        super (health);
    }

    attack(enemy: Enemy) {
        const damage = 10;
        enemy.takeDamage(damage);
    }
}

class Enemy extends EnemyManager {
constructor(health: number) {
    super(health);
}

update(player: Player) {
    player.takeDamage(5);
    console.log('Someone broke my reff and made me take damage')
}
}

export default EnemyManager;
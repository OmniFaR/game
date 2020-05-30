import { Body, Engine, Events } from "matter-js";
import container from '../../inversify.config';

const engine = container.get(Engine);

function IsOnGround(entity: Body) {

  (entity as any).isOnGround = false;
  Events.on(engine, "collisionStart", (event) => {
    if (event.pairs.find((pair) => pair.bodyA === entity ||pair.bodyB === entity) === undefined) {
      return;
    }

    (entity as any).isOnGround = true;
  });

  Events.on(engine, "collisionEnd", (event) => {
    if (event.pairs.find((pair) => pair.bodyA === entity ||pair.bodyB === entity) === undefined) {
      return;
    }

    (entity as any).isOnGround = false;
  });

  Events.on(engine, "collisionActive", (event) => {
    if (event.pairs.find((pair) => pair.bodyA === entity ||pair.bodyB === entity) === undefined) {
      return;
    }

    (entity as any).isOnGround = true;
  });
}

export default IsOnGround;
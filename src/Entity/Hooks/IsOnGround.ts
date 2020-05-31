import { Body, Engine, Events } from "matter-js";
import container from '../../inversify.config';

const engine = container.get(Engine);

function IsOnGround(entity: Body) {

  (entity as any).isOnGround = false;

  let isOnGroundUpdated = false;

  const updateIsOnGround = (value: boolean) => {
    if (isOnGroundUpdated) {
      return;
    }

    (entity as any).isOnGround = isOnGroundUpdated = value;
  }

  Events.on(engine, "beforeTick", () => isOnGroundUpdated = false);

  Events.on(engine, "collisionEnd", (event) => {
    if (event.pairs.find((pair) => pair.bodyA === entity || pair.bodyB === entity) === undefined) {
      return;
    }

    updateIsOnGround(false);
  });

  Events.on(engine, "collisionStart", (event) => {
    if (event.pairs.find((pair) => pair.bodyA === entity || pair.bodyB === entity) === undefined) {
      return;
    }

    updateIsOnGround(true);
  });

  Events.on(engine, "collisionActive", (event) => {
    if (event.pairs.find((pair) => pair.bodyA === entity || pair.bodyB === entity) === undefined) {
      return;
    }

    updateIsOnGround(true);
  });
}

export default IsOnGround;
import { Body, Engine, Events } from "matter-js";
import container from '../../Engine/inversify.config';

const engine = container.get(Engine);

function IsOnGround(entity: Body) {

 // TODO: This needs some refactoring, we should only set isOnGround = true when the collision is underneath.
 // TODO: This needs some refactoring, we should also set isOnWall = true when the collision is with a wall.

  (entity as any).isOnGround = false;

  let isOnGroundUpdated = false;

  const updateIsOnGround = (value: boolean) => {
    if (isOnGroundUpdated) {
      return;
    }

    (entity as any).isOnGround = isOnGroundUpdated = value;
  }

  const onBeforeTick = () => isOnGroundUpdated = false;

  const onCollisionEnd = (event: Matter.IEventCollision<Engine>) =>  {
    if (event.pairs.find((pair) => pair.bodyA === entity || pair.bodyB === entity) === undefined) {
      return;
    }

    updateIsOnGround(false);
  }

  const onCollisionStartOrActive = (event: Matter.IEventCollision<Engine>) => {
    if (event.pairs.find((pair) => pair.bodyA === entity || pair.bodyB === entity) === undefined) {
      return;
    }

    updateIsOnGround(true);
  }

  Events.on(engine, "beforeTick", onBeforeTick);
  Events.on(engine, "collisionEnd", onCollisionEnd);
  Events.on(engine, "collisionStart", onCollisionStartOrActive);
  Events.on(engine, "collisionActive", onCollisionStartOrActive);

  return () => {
    Events.off(engine, "beforeTick", onBeforeTick);
    Events.off(engine, "collisionEnd", onCollisionEnd);
    Events.off(engine, "collisionActive", onCollisionStartOrActive);
    Events.off(engine, "collisionActive", onCollisionStartOrActive);
  }
}

export default IsOnGround;
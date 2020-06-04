import container from "../../../inversify.config";
import { Engine, Events, Composite } from "matter-js";
import { updateSpriteObject } from "./SpriteObject";

const engine = container.get(Engine);

export function add(body: Matter.Body, sprite: PIXI.Sprite) {

}

export function remove(body: Matter.Body, sprite: PIXI.Sprite) {

}

let updating = false;
Events.on(engine, 'afterUpdate', async () => {
  if (updating) {
    return;
  }

  updating = true;

  const bodies = Composite.allBodies(engine.world);
  const updatingBodies = bodies.filter((body) => !body.isSensor && !body.isSleeping && !body.isStatic);

  // TODO: maybe opimize this (Only update visisble objects?)
  // We can currently render 200 + connected objects on my machine, but i am not sure about the performance on other devices...

  try {
    await Promise.all(updatingBodies.map(async (body) => updateSpriteObject(body)));
  } catch (e) { }

  updating = false;
});
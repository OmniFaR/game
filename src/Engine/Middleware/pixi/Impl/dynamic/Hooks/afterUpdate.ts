import updateSprite from "../../../Util/sprite/update";
import { Events, Engine, Body, Query } from 'matter-js';
import container from "../../../../../inversify.config";
import ICamera from "../../../../../Camera/ICamera";
import { Bounds } from "pixi.js";
import { EngineBody } from "../../../../../types";
import singleRun from '../../../../../Util/singleRun';

const engine = container.get(Engine);

function getBodies(engine: Engine) {
  const camera = container.get(ICamera);

  if (!camera) {
    return engine.world.bodies;
  }

  return Query.region(engine.world.bodies, camera.getBounds());
}

let previousBodies: Array<Body>|undefined = undefined;

const onAfterUpdate = singleRun(async () => {

  const bodies = getBodies(engine);
  const updatingBodies = bodies.filter((body) => !body.isSensor && !body.isSleeping && !body.isStatic);

  try {
    await Promise.all(updatingBodies.map(async (body) => updateSprite(body)));
  } catch (e) { }


  if (previousBodies !== undefined) {
    const notRenderedBodies = previousBodies.filter((body) => !bodies.includes(body));
    const newRendereredBodies = bodies.filter((body) => !previousBodies.includes(body));

    notRenderedBodies.forEach((body) => (body as EngineBody).pixi.sprite.renderable = false);
    newRendereredBodies.forEach((body) => (body as EngineBody).pixi.sprite.renderable = true);
  } else {
    bodies.forEach((body) => (body as EngineBody).pixi.sprite.renderable = true);
    previousBodies = bodies;
  }
})

Events.on(engine, 'afterUpdate', onAfterUpdate);
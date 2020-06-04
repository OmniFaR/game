import container from "../../inversify.config";
import Matter from "matter-js";
import { add, remove } from './sprites';

const engine = container.get(Matter.Engine);

function matterObjectToArray(object: any) {
  if (Array.isArray(object)) {
    return object;
  }

  return [ object ];
}

Matter.Events.on(engine.world, 'afterAdd', async (event) => matterObjectToArray(event.object).forEach((body) => add(body)));
Matter.Events.on(engine.world, 'beforeRemove', async (event) => matterObjectToArray(event.object).forEach((body) => remove(body)));
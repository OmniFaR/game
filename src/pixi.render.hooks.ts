import container from './inversify.config';
import { Engine, Events, Composite, Body } from "matter-js";
import { createOrGetSprite, destroySprite, updateSprite } from './pixi.render.functions';

const engine = container.get(Engine);
Events.on(engine, 'beforeAdd', async (event) => createOrGetSprite(event.object));

Events.on(engine, 'beforeRemove', async (event) => destroySprite(event.object));

Events.on(engine, 'beforeUpdate', async () => {
  const bodies = Composite.allBodies(engine.world);

  bodies.forEach(async (body) => updateSprite(body));
});
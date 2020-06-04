import { Engine, Render, Runner } from "matter-js";
import container from "./inversify.config";
import Matter from "matter-js";
import { debugRendererMode } from "./config";

const engine = Engine.create({  });
container.bind(Engine).toConstantValue(engine);
Engine.run(engine);

const runner = Runner.create({ delta: 1000 / 60, isFixed: false, enabled: false });
container.bind(Runner).toConstantValue(runner);

if (debugRendererMode) {
  const render = Render.create({ 
    element: document.body, 
    engine, 
    options: { 
      hasBounds: true,
      showVelocity: true,
      showAxes: true,
      showIds: true,
      showDebug: true
    } as any
  });

  container.bind(Render).toConstantValue(render);
  Render.run(render);
}
import { Engine, Render, Runner } from "matter-js";
import container from "./inversify.config";
import Matter from "matter-js";

function initialize(element: HTMLElement) {
  const engine = Engine.create();
  container.bind(Engine).toConstantValue(engine);

  const runner = Runner.create({ delta: 1000 / 60, isFixed: false, enabled: false });
  container.bind(Runner).toConstantValue(runner);

  const render = Render.create({ element: document.body, engine });

  Render.run(render);
  Engine.run(engine);
}

initialize(document.body);
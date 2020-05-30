import { Engine, Render, Runner } from "matter-js";
import container from "./inversify.config";


function initialize(element: HTMLElement) {
  const engine = Engine.create();
  container.bind(Engine).toConstantValue(engine);

  const render = Render.create({ element, engine });
  container.bind(Render).toConstantValue(render);

  const runner = Runner.create({
    delta: 1000 / 60,
    isFixed: false,
    enabled: false
  });

  container.bind(Runner).toConstantValue(runner);

  Engine.run(engine);
  Render.run(render);
}

initialize(document.body);
import { Engine, Render, Runner } from "matter-js";
import container from "./inversify.config";
import Matter from "matter-js";

const engine = Engine.create({  });
container.bind(Engine).toConstantValue(engine);
Engine.run(engine);

const runner = Runner.create({ delta: 1000 / 60, isFixed: false, enabled: false });
container.bind(Runner).toConstantValue(runner);

function initialize(element: HTMLElement) {
  //const render = Render.create({ element: document.body, engine });
  //Render.run(render);
}

initialize(document.body);
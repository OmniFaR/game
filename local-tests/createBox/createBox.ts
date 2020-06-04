import documentReady from "../Util/documentReady";
import createButton from "../Util/createButton";
import container from "../../src/Engine/inversify.config";
import Matter, { Vector } from "matter-js";

documentReady(() => {

  const button = createButton('Create box');

  function createRandomForce() {
    const random = () => (Math.random() - .5) / 20;
    return Vector.create(random(), random())
  }

  button.addEventListener('click', () => {
    const engine = container.get(Matter.Engine);

    for(let i = 0; i < 10; i++) {
      Matter.World.add(engine.world, Matter.Bodies.rectangle(0, 0, 20, 20, {
        density: 0.001,
        force: createRandomForce(),
        restitution: 0,

      }));
    }
  });
});
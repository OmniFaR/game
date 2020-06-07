import Proton from 'proton-engine';
import container from './inversify.config';
import { Application } from 'pixi.js';
import MatterZone from './Middleware/proton/zone/MatterZone';
import MatterGravity from './Middleware/proton/behaviour/MatterGravity';

const proton = new Proton();
container.bind(Proton).to(proton);

const app = container.get(Application);
const renderer = new Proton.PixiRenderer(app.stage);
container.bind(Proton.BaseRenderer).to(renderer);

const create = renderer.pool.create;
renderer.pool.create = (body, particle) => {
  switch (body.name.toLowerCase()) {
    case 'coin':
      /*
      const glodAnim = new PIXI.extras.AnimatedSprite(glodFrame);
      glodAnim.anchor.set(0.5);
      glodAnim.animationSpeed = 0.4;
      glodAnim.play();
      return glodAnim;  
    break;
    */
  
    default:
      return create.call(proton.pool, body, particle);
      break;
  }
}

proton.addRenderer(renderer);

container.bind(Proton.Emitter).toFactory(() => {
  const emitter = new Proton.Emitter();

  emitter.addBehaviour(
    new Proton.CrossZone(
      new MatterZone(),
      "bound"
    )
  );

  emitter.addBehaviour(
    new MatterGravity(5000, 200)
  );

  proton.addEmitter(emitter);

  return emitter;
});
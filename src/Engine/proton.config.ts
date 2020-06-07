import Proton from 'proton-engine';
import container from './inversify.config';
import { Application } from 'pixi.js';
import * as PIXI from 'pixi.js';

const proton = new Proton();
container.bind(Proton).to(proton);

(window as any).PROTON = Proton;

const app = container.get(Application);
const renderer = new Proton.PixiRenderer(app.stage);
renderer.setPIXI(PIXI);
renderer.color = true;
renderer.blendMode = PIXI.BLEND_MODES.ADD;

proton.addRenderer(renderer);

const create = renderer.pool.create;
renderer.pool.create = (body, particle) => {
  return create.call(proton.pool, body, particle);
}

app.ticker.add(() => proton.update());

export default proton;
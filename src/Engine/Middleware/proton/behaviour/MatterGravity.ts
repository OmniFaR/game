
import Force from 'proton-engine/src/behaviour/Force';
import container from '../../../inversify.config';
import { Engine } from 'matter-js';

const engine = container.get(Engine);

export default class MatterGravity extends Force {
  constructor(life, easing) {
    super(engine.world.gravity.x, engine.world.gravity.y, life, easing);
    (this as any).name = 'MatterGravity';
  }

  
}
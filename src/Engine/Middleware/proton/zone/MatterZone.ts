import Zone from 'proton-engine/src/zone/Zone';
import container from '../../../inversify.config';
import Matter, { Engine } from 'matter-js';

const engine = container.get(Engine);

class MatterZone extends Zone {
  crossing(particle) {
    if (['dead'].includes((this as any).crossType)) {
      return;
    }

    const circle = Matter.Bodies.circle(particle.p.x, particle.p.y, particle.radius);
    const hasCollision = Matter.Query.collides(circle, engine.world.bodies).length > 0;

    return hasCollision;
  }
}

export default MatterZone;
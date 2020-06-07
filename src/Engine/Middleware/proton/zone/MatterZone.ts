import * as Proton from 'proton-engine';
import container from '../../../inversify.config';
import Matter, { Engine, Vector, Body, Bounds } from 'matter-js';

type CollisionType = {
  penetration: Vector;
  bodyA: Body;
  bodyB: Body;
}

const engine = container.get(Engine);

// const circle = Matter.Bodies.circle(0, 0, 10);

const getSizeX = (bounds: Bounds) => bounds.max.x - bounds.min.x;
const getSizeY = (bounds: Bounds) => bounds.max.y - bounds.min.y;

class MatterZone extends Proton.Zone {
  crossing(particle) {

    if (!particle.matter) {
      particle.matter = Matter.Bodies.circle(particle.p.x, particle.p.y, particle.radius)    
    } else {
      Matter.Body.setPosition(particle.matter, Vector.create(particle.p.x, particle.p.y)); 
      Matter.Body.set(particle.matter, 'circleRadius', particle.radius);
    }

    const circle = particle.matter;

    // TODO: Make sure that we dont create this many objects.
    // TODO: Create a proper connection with the matter-js api.

    const collisions = Matter.Query.collides(circle, engine.world.bodies) as Array<CollisionType>;

    if (collisions.length === 0) {
      return;
    }

    if ((this as any).crossType === 'dead') {

      particle.dead = true;

      return;
    }

    
    let collidesXIndex = collisions.reduce((prev, collision, index) => Math.max(Math.abs(collisions[index].penetration.x), Math.abs(collision.penetration.x)) === Math.abs(collision.penetration.x) ? index : prev, 0) ;
    let collidesYIndex = collisions.reduce((prev, collision, index) => Math.max(Math.abs(collisions[index].penetration.y), Math.abs(collision.penetration.y)) === Math.abs(collision.penetration.y) ? index : prev, 0);

    const collidesX = collisions[collidesXIndex];
    const collidesY = collisions[collidesYIndex];

    if ((this as any).crossType === 'bound') {

      if (collidesX.penetration.x !== 0) {
        particle.p.x -= collidesX.penetration.x;
        particle.v.x *= -1;
      }

      if (collidesY.penetration.y !== 0) {
        particle.p.y -= collidesY.penetration.y;
        particle.v.y *= -1;
      }

      return;
    }

    if ((this as any).crossType === 'cross') {


      if (collidesX.penetration.x !== 0) {
        const xDistance = (getSizeX(collidesX.bodyA.bounds) + particle.radius) * (collidesX.penetration.x > 0 ? 1 : -1);
        particle.p.x += xDistance;
      }

      if (collidesY.penetration.y !== 0) {
        const yDistance = (getSizeY(collidesY.bodyA.bounds) + particle.radius) * (collidesX.penetration.y > 0 ? 1 : -1)
        particle.p.x += yDistance;
        //particle.v.y *= -1;
      }

    }
  }
}

export default MatterZone;
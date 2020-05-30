import { Engine, Bodies, World } from 'matter-js';
import Player from './Objects/Player';
import centerElement from './hooks/centerElement';

function main(engine: Engine) {
  const boxA = Bodies.rectangle(400, 200, 80, 80);
  const boxB = Bodies.rectangle(450, 50, 80, 80);
  const ground = Bodies.rectangle(400, 610, 810, 60, { isStatic: true });

  const player = Player(engine);

  World.add(engine.world, [ boxA, boxB, ground, player ]);

  return player;
}

export default main;
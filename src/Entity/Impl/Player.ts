import { Bodies, Events } from "matter-js";
import MovementController from '../Hooks/MovementController';
import IInput from '../../Input/IInput';

function Player(input: IInput) {
  const player = Bodies.circle(100, 100, 25,{
    density: 0.001,
    friction: 0.7,
    frictionStatic: 0,
    frictionAir: 0.01,
    restitution: 0
  });

  MovementController(player, input);

  return player;
}

export default Player;
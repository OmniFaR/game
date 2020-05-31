import { Bodies, Events, World, Engine } from "matter-js";
import MovementController from '../../Hooks/MovementController';
import IInput from '../../../Input/IInput';
import container from "../../../inversify.config";

const engine = container.get(Engine);

function Player(input: IInput) {
  const player = Bodies.circle(100, 100, 25,{
    density: 0.001,
    friction: 0.7,
    frictionStatic: 0,
    frictionAir: 0.01,
    restitution: 0
  });

  MovementController(player, input);

  World.add(engine.world, player);

  return player;
}

export default Player;
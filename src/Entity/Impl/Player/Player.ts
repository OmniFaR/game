import { Bodies, World, Engine } from "matter-js";
import MovementController, { defaultOptions as movementControllerDefaultOptions } from '../../Hooks/MovementController';
import IInput from '../../../Engine/Input/IInput';
import container from "../../../Engine/inversify.config";
import { loadDougAssets } from "../../../Assets";
import { AnimatedSprite } from "pixi.js";
import GetSprite from "../../../Engine/Middleware/pixi/sprites/GetSprite";
import FollowEntityCamera from '../../../Engine/Camera/Impl/FollowEntityCamera';

const engine = container.get(Engine);

type PlayerOptions = {
  density: number;
  friction: number;
  frictionAir: number;
  useTorque: boolean;
  
  // Movement controller options.
  movementSpeed: number;
  jumpVelocity: number;
  maxMovementVelocity: number;
  rotateInTheAir: boolean;
}

const defaultPlayerOptions: PlayerOptions = {
  ...movementControllerDefaultOptions,
  density: 0.001,
  friction: 0.8,
  frictionAir: 0.01,
  rotateInTheAir: true
}

async function Player(input: IInput, options: Partial<PlayerOptions> = {}): Promise<[Matter.Body, () => any]> {

  const {
    density,
    friction,
    frictionAir,
    useTorque,
    jumpVelocity,
    maxMovementVelocity,
    movementSpeed,
    rotateInTheAir
  } = { ...defaultPlayerOptions, ...options} as PlayerOptions;

  const dougAssets = await loadDougAssets();
  dougAssets.idle.animationSpeed = 0.1;
  dougAssets.jump.animationSpeed = 0.3;

  const sprite = new PIXI.extras.AnimatedSprite(dougAssets.idle.textures);
  sprite.scale.y *= -1;
  sprite.animationSpeed = 0.1;
  sprite.play();

  const player = Bodies.circle(100, 100, 25,{
    density,
    friction,
    frictionStatic: 0,
    frictionAir,
    restitution: 0,
    render: {
      texture: sprite,
      destroy: false
    } as any
  });

  const playerHeight = (player.bounds.max.y - player.bounds.min.y);
  const halfPlayerHeight = playerHeight / 2;

  const playerWidth = (player.bounds.max.x - player.bounds.min.x);
  const halfPlayerWidth = playerWidth / 2;

  const emitter = dougAssets.player_land_on_ground_particle_factory(GetSprite(player));
  emitter.autoUpdate = true;
  emitter.addAtBack = false;
  emitter.emit = false;
  emitter.spawnRect.width = playerWidth;

  (player as any).dontTransferAngle = true;


  container.get(FollowEntityCamera).addBody(player);
  const removePlayerMovement = MovementController(player, input, {

    useTorque,
    jumpVelocity,
    maxMovementVelocity,
    movementSpeed,
    rotateInTheAir,

    jumpAnimation: dougAssets.jump,
    walkAnimation: dougAssets.walk,
    idleAnimation: dougAssets.idle,
    onLand: (speed: number) => {
      emitter.updateOwnerPos(player.position.x, player.position.y + halfPlayerHeight);
      emitter.frequency = 1 / (speed * 60);
      setTimeout(() => {
        emitter.emit = true;
        setTimeout(() => emitter.emit = false, 20);
      }, 20);
    }
  });

  World.add(engine.world, player);

  return [player, () => {
    container.get(FollowEntityCamera).removeBody(player);
    removePlayerMovement();

    emitter.destroy();
    dougAssets.damage.destroy();
    dougAssets.idle.destroy();
    dougAssets.jump.destroy();
    dougAssets.walk.destroy();

    World.remove(engine.world, player);
  }];
}

export default Player;
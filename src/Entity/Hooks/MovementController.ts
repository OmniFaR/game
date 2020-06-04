import { Body, Engine, Events, Vector, Sleeping } from "matter-js";
import IInput from '../../Engine/Input/IInput';
import container from '../../Engine/inversify.config';
import IsOnGround from "./IsOnGround";
import GetSprite from '../../Engine/Middleware/pixi/Hooks/GetSprite';
import Animated from '../../Engine/Middleware/pixi/Hooks/Animated';
import { AnimatedSprite } from "pixi.js";

const engine = container.get(Engine);

type MovementControllerOptions = {
  movementSpeed: number;
  jumpVelocity: number;
  maxMovementVelocity: number;
  inputThreshold: number;
  useTorque: boolean;

  rotateInTheAir: boolean;

  idleAnimation?: PIXI.AnimatedSprite;
  jumpAnimation?: PIXI.AnimatedSprite;
  walkAnimation?: PIXI.AnimatedSprite
  onLand?: (speed: number) => any;
}

export const defaultOptions: MovementControllerOptions = {
  movementSpeed: 0.002,
  jumpVelocity: 0.1,
  maxMovementVelocity: 6,
  inputThreshold: 0.2,
  useTorque: false,
  rotateInTheAir: false
}

function MovementController(entity: Body, input: IInput, options: Partial<MovementControllerOptions> = {}) {

  const {
    inputThreshold,
    maxMovementVelocity,
    movementSpeed,
    jumpVelocity,
    useTorque,

    rotateInTheAir,

    walkAnimation,
    jumpAnimation,
    idleAnimation,
    onLand
  } = { ...defaultOptions, ...options } as MovementControllerOptions;

  const removeIsOnGround = IsOnGround(entity);

  const sprite = GetSprite(entity) as AnimatedSprite;

  const [setActiveAnimation] = Animated(sprite, {
    'idle': idleAnimation,
    'walk': walkAnimation,
    'jump': jumpAnimation
  });

  let wasOnGround = true;
  let previousYVelocity = 0;

  const OnBeforeTick = () => {
    // Visual logic

    if (Math.abs(entity.velocity.x) > 0.1 && (rotateInTheAir || (entity as any).isOnGround)) {
      sprite.scale.x = Math.abs(sprite.scale.x) * (entity.velocity.x < 0 ? -1 : 1);
    }

    if (Math.abs(entity.angularVelocity) > 0.01 && (entity as any).isOnGround) {
      setActiveAnimation('walk');
      sprite.animationSpeed = Math.max(0.15, entity.angularVelocity);
    } else if (!(entity as any).isOnGround) {
      setActiveAnimation('jump');
    } else {
      setActiveAnimation('idle');
    }

    if (onLand) {
      if (!wasOnGround && (entity as any).isOnGround && Math.abs(previousYVelocity) > 1.2) {
        onLand(previousYVelocity);
      }

      previousYVelocity = entity.velocity.y;
      wasOnGround = (entity as any).isOnGround;
    }

    // Controller logic.

    let force = Vector.create(0, 0);

    const inputLeft = input.keyValue("left");
    if (inputLeft > inputThreshold && entity.velocity.x > -maxMovementVelocity) {
      const value = -movementSpeed * inputLeft;
      if (useTorque) {
        entity.torque = value;
      } else {
        force.x = value;
      }
    }

    const inputRight = input.keyValue("right");
    if (inputRight > inputThreshold && entity.velocity.x < maxMovementVelocity) {
      const value = movementSpeed * inputRight;
      if (useTorque) {
        entity.torque = value;
      } else {
        force.x = value;
      }
      // entity.torque = movementSpeed * inputRight;
    }

    const inputJump = input.keyValue("jump");
    if ((entity as any).isOnGround && inputJump > inputThreshold) {
      force.y = -jumpVelocity * inputJump;
    }

    entity.force = force;
  }

  Events.on(engine, "beforeTick", OnBeforeTick);

  return () => {
    Events.off(engine, "beforeTick", OnBeforeTick)
    removeIsOnGround();
  };
}

export default MovementController;
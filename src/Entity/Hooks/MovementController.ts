import { Body, Engine, Events, Vector } from "matter-js";
import IInput from '../../Input/IInput';
import container from '../../inversify.config';
import IsOnGround from "./IsOnGround";

const engine = container.get(Engine);

const inputThreshold = 0.2;

function MovementController(entity: Body, input: IInput, movementSpeed: number = 0.2, jumpVelocity = 0.1, maxMovementVelocity: number = 0.2) {

  IsOnGround(entity);

  Events.on(engine, "beforeTick", () => {
    const inputLeft = input.keyValue("left");
    if (inputLeft > inputThreshold && entity.angularVelocity > -maxMovementVelocity) {
      entity.torque = -movementSpeed * inputLeft;
    }

    const inputRight = input.keyValue("right");
    if (inputRight > inputThreshold && entity.angularVelocity < maxMovementVelocity) {
      entity.torque = movementSpeed * inputRight;
    }

    const inputJump = input.keyValue("jump");
    if ((entity as any).isOnGround && inputJump > inputThreshold) {
      entity.force = Vector.create(0, -jumpVelocity * inputJump);
    }
  });
}

export default MovementController;
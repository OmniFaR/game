import { Bodies, Events, Engine, Vector } from "matter-js";

//looks for key presses and logs them
var keys = {};
document.body.addEventListener("keydown", function(e) {
  keys[e.keyCode] = true;
});

document.body.addEventListener("keyup", function(e) {
  keys[e.keyCode] = false;
});

function createPlayer(engine: Engine) {
  const player = Bodies.circle(100, 100, 25,{
    density: 0.001,
    friction: 0.7,
    frictionStatic: 0,
    frictionAir: 0.01,
    restitution: 0
  });

  let isOnGround = false;
  const movementSpeed = 1;

  Events.on(engine, "collisionStart", (event) => {
    if (event.pairs.find((pair) => pair.bodyA === player ||pair.bodyB === player) === undefined) {
      return;
    }

    isOnGround = true;
  });

  Events.on(engine, "collisionEnd", (event) => {
    if (event.pairs.find((pair) => pair.bodyA === player ||pair.bodyB === player) === undefined) {
      return;
    }

    isOnGround = false;
  });

  Events.on(engine, "collisionActive", (event) => {
    if (event.pairs.find((pair) => pair.bodyA === player ||pair.bodyB === player) === undefined) {
      return;
    }

    isOnGround = true;
  });

  Events.on(engine, "beforeTick", () => {
    // arrow left
    if (keys[39] && player.angularVelocity > -0.2) {
      player.torque = movementSpeed;
    }

    // right arrow
    if (keys[37] && player.angularVelocity < 0.2) {
      player.torque = movementSpeed * -1;
    }

    if (keys[38] && isOnGround) {
      player.force = Vector.create(0, -0.1);
    }
  });

  return player;
}

export default createPlayer;
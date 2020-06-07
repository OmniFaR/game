import { debugMode } from './Engine/config';

import './Engine';
import './Assets';

import FollowEntityCamera from "./Engine/Camera/Impl/FollowEntityCamera";
import Proton from 'proton-engine';
import { img2 } from './images';

if (debugMode) {
  console.log("DEBUG MODE ENABLED!");
  require('../local-tests/');
}

import container from './Engine/inversify.config';
import { Engine, World, Bodies } from 'matter-js';
import MatterZone from './Engine/Middleware/proton/zone/MatterZone';
import MatterGravity from './Engine/Middleware/proton/behaviour/MatterGravity';
import proton from './Engine/proton.config';

const camera = new FollowEntityCamera();
container.bind(FollowEntityCamera).toConstantValue(camera);

camera.enable();

World.add(container.get(Engine).world, [
  Bodies.rectangle(-100, 610, 10000, 60, { isStatic: true }),
  Bodies.rectangle(50, 450, 200, 20, { isStatic: true }),
  Bodies.rectangle(320, 300, 200, 20, { isStatic: true })
]);

const emitter = new Proton.Emitter();

emitter.addBehaviour(
  new Proton.CrossZone(
    new MatterZone(),
    "bound"
  )
);

console.log("Created emitter.");


emitter.addBehaviour(new Proton.Color("#d8d000", "#fbc531"));
/*
emitter.addBehaviour(
  new MatterGravity(5000, 200)
);
*/

emitter.rate = new Proton.Rate(new Proton.Span(1, 60), 1);

emitter.addInitialize(new Proton.Mass(1));
emitter.addInitialize(new Proton.Body(PIXI.Texture.from(img2)));
emitter.addInitialize(new Proton.Life(3.1, 6.1));
emitter.addInitialize(
  new Proton.Velocity(
    new Proton.Span(0.3, 0.5),
    new Proton.Span(0, 360),
    "polar"
  )
);


emitter.addBehaviour(
  new Proton.Scale(Proton.getSpan(0.55, 0.75), Proton.getSpan(0.3, 0.6))
);

emitter.addBehaviour(new Proton.Alpha(1, 0));
emitter.addBehaviour(new Proton.Color("#d8d000", "#fbc531"));
emitter.addBehaviour(new Proton.Rotate(0, Proton.getSpan(-8, 9), "add"));
emitter.addBehaviour(new Proton.RandomDrift(3, 3, 0.03));

emitter.addBehaviour(new MatterGravity(6000, 60));
emitter.addBehaviour(new Proton.CrossZone(new MatterZone(), "bound"));

emitter.tha = Math.PI / 5;

emitter.p.x = 100;
emitter.p.y = 300;

emitter.emit();

(proton as any).addEmitter(emitter);
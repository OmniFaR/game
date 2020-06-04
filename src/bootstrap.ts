import { debugMode } from './config';
import './inversify.config';
import './matter.config';
import './pixi.config';

import './Middleware/pixi';

import './Assets';

import FollowEntityCamera from "./Camera/Impl/FollowEntityCamera";

if (process.env.DEBUG_ENABLED) {
  console.log("DEBUG MODE ENABLED!");
  require('../local-tests/');
}

import container from './inversify.config';
import { Engine, World, Bodies } from 'matter-js';

const camera = new FollowEntityCamera();
container.bind(FollowEntityCamera).toConstantValue(camera);

camera.enable();

World.add(container.get(Engine).world, [
  Bodies.rectangle(-100, 610, 10000, 60, { isStatic: true }),
  Bodies.rectangle(50, 450, 200, 20, { isStatic: true }),
  Bodies.rectangle(320, 300, 200, 20, { isStatic: true })
]);
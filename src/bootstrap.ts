import { debugMode } from './Engine/config';

import './Engine';
import './Assets';

import FollowEntityCamera from "./Engine/Camera/Impl/FollowEntityCamera";

if (debugMode) {
  console.log("DEBUG MODE ENABLED!");
  require('../local-tests/');
}

import container from './Engine/inversify.config';
import { Engine, World, Bodies } from 'matter-js';

const camera = new FollowEntityCamera();
container.bind(FollowEntityCamera).toConstantValue(camera);

camera.enable();

World.add(container.get(Engine).world, [
  Bodies.rectangle(-100, 610, 10000, 60, { isStatic: true }),
  Bodies.rectangle(50, 450, 200, 20, { isStatic: true }),
  Bodies.rectangle(320, 300, 200, 20, { isStatic: true })
]);
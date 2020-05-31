import { debugMode } from './config';
import './inversify.config';
import './matter.config';
import './pixi.config';

import './Middleware/pixi';

import './Assets';

if (process.env.DEBUG_ENABLED) {
  console.log("DEBUG MODE ENABLED!");
  require('../local-tests/');
}

import container from './inversify.config';
import { Engine, World, Bodies } from 'matter-js';

World.add(container.get(Engine).world, [
  Bodies.rectangle(200, 610, 810, 60, { isStatic: true })
]);
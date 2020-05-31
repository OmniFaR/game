import './config';

import './Middleware/pixi';
import './local-tests/createPlayer';

import container from './inversify.config';
import { Engine, World, Bodies } from 'matter-js';

World.add(container.get(Engine).world, [
  Bodies.rectangle(200, 610, 810, 60, { isStatic: true })
]);
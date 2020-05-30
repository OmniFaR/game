import './matter.config';
import './inversify.config';
import './createPlayer_test';

import container from './inversify.config';
import { Engine, World, Bodies } from 'matter-js';

World.add(container.get(Engine).world, [
  Bodies.rectangle(400, 610, 810, 60, { isStatic: true })
]);
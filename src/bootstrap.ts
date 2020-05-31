import './inversify.config';
import './matter.config';
import './pixi.config';
import './pixi.render.hooks';
import './local-tests/createPlayer';

import container from './inversify.config';
import { Engine, World, Bodies } from 'matter-js';

World.add(container.get(Engine).world, [
  Bodies.rectangle(400, 610, 810, 60, { isStatic: true, render: {
    opacity: 1
  }})
]);
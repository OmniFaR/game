import { Body } from 'matter-js';
import * as Static from './Impl/static';
import * as Dynamic from './Impl/dynamic';
import get from './Util/sprite/get';
import container from '../../inversify.config';
import { Application } from 'pixi.js';
import destroy from './Util/sprite/destroy';

function access(body: Body) {
  return body.isStatic ? Static : Dynamic;
}

const app = container.get(Application);

export function add(bodies: Body[]) {
  bodies.forEach(async (body) => {
    const engineBody = get(body);
    access(body).add(engineBody, engineBody.pixi.sprite, app);

    console.log(engineBody.pixi.sprite);
    app.stage.addChild(engineBody.pixi.sprite);
  });
}

export function remove(bodies: Body[]) {
  bodies.forEach(async (body) => {
    const engineBody = get(body);
    access(body).remove(engineBody, engineBody.pixi.sprite, app);

    app.stage.removeChild(engineBody.pixi.sprite);

    destroy(engineBody);
  })
}

import './Hooks/afterAdd';
import './Hooks/beforeRemove';
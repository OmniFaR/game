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

/**
 * import * as Static from './static';
import * as Dynamic from './dynamic';
import container from '../../../inversify.config';
import { Application } from 'pixi.js';
import SpriteObject from '../Util/SpriteObject/SpriteObject';
import { destroySpriteObject } from '../Util/SpriteObject/SpriteObject';

const app = container.get(Application);

export function add(body: Matter.Body) {

  const sprite = SpriteObject(body);

  if (sprite) {
    (body.isStatic ? Static.add : Dynamic.add)(body, sprite[1]);
    (body as any).pixi = sprite;
    app.stage.addChild(sprite[1]);
  }
};

export function remove(body: Matter.Body) {
  const sprite = SpriteObject(body);

  if (sprite) {
    (body.isStatic ? Static.remove : Dynamic.remove)(body, sprite[1]);
    (body as any).pixi = undefined;
    app.stage.removeChild(sprite[1]);
    destroySpriteObject(body);
  }
}
 */
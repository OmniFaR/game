import * as Static from './static';
import * as Dynamic from './dynamic';
import container from '../../../inversify.config';
import { Application } from 'pixi.js';
import SpriteObject from './SpriteObject';
import { destroySpriteObject } from './SpriteObject';

const app = container.get(Application);

export function add(body: Matter.Body) {

  const sprite = SpriteObject(body);

  if (sprite) {
    (body.isStatic ? Static.add : Dynamic.add)(body, sprite);
    app.stage.addChild(sprite);
  }
};

export function remove(body: Matter.Body) {
  const sprite = SpriteObject(body);

  if (sprite) {
    (body.isStatic ? Static.remove : Dynamic.remove)(body, sprite);
    app.stage.removeChild(sprite);
    destroySpriteObject(body);
  }
}
import * as PIXI from 'pixi.js';
import * as Matter from 'matter-js';
import color from '../color';
import { Vector } from 'matter-js';

function createSpriteObject(body: Matter.Body): [boolean, PIXI.Sprite] {
  if (body.render && (body.render as any).texture) {
    return [(body.render as any).destroy, (body.render as any).texture];
  } else if (body.render && body.render.sprite && body.render.sprite.texture) {
    return [true, PIXI.Sprite.from(body.render.sprite.texture)];
  } else {
    const sprite = new PIXI.Sprite(PIXI.Texture.WHITE);
    sprite.tint = color((body.render && body.render.fillStyle) || 'purple');
    return [true, sprite];
  }
}

function updateSpriteObjectInternal(body: Matter.Body, sprite: [boolean, PIXI.Sprite]) {
  sprite[1].x = body.position.x;
  sprite[1].y = body.position.y;

  if (!(body as any).dontTransferAngle) {
    sprite[1].rotation = body.angle;
  }

  return sprite;
}

function initializeSpriteObject(body: Matter.Body, sprite: [boolean, PIXI.Sprite]) {
  // update some variables, that only need to be updated once.
  const size = Vector.sub(body.bounds.min, body.bounds.max);
  sprite[1].width = size.x; 
  sprite[1].height = size.y;

  sprite[1].anchor.set(0.5);


  return updateSpriteObjectInternal(body, sprite);
}

const sprites: Record<string, [boolean, PIXI.Sprite]> = {};
function SpriteObject(body: Matter.Body) {
  if (sprites[body.id]) {
    return sprites[body.id];
  }

  const sprite = initializeSpriteObject(body, createSpriteObject(body));
  sprites[body.id] = sprite;

  return sprite;
}

function destroySpriteObject(body: Matter.Body) {
  if (!sprites[body.id]) {
    return;
  }

  sprites[body.id][0] && sprites[body.id][1].destroy();
  sprites[body.id] = undefined;
}

function updateSpriteObject(body: Matter.Body) {
  if (!sprites[body.id]) {
    return;
  }

  updateSpriteObjectInternal(body, sprites[body.id]);
}



export { destroySpriteObject, updateSpriteObject };
export default SpriteObject;
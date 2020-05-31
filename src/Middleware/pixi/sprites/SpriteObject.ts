import * as PIXI from 'pixi.js';
import * as Matter from 'matter-js';
import color from '../color';
import { Vector } from 'matter-js';

function createSpriteObject(body: Matter.Body) {
  if (body.render && body.render.sprite && body.render.sprite.texture) {
    /*
    TODO: Do something like this (Apprently recommended by the pixijs team)
    We will need to look into this.

    return new PIXI.Sprite(
      PIXI.Loader.ressources[PIXI.Sprite.from(body.render.sprite.texture)].texture
    );
    */

    return PIXI.Sprite.from(body.render.sprite.texture);
  } else {
    const sprite = new PIXI.Sprite(PIXI.Texture.WHITE);
    sprite.tint = color((body.render && body.render.fillStyle) || 'purple');
    return sprite;
  }
}

function updateSpriteObjectInternal(body: Matter.Body, sprite: PIXI.Sprite) {
  sprite.x = body.position.x;
  sprite.y = body.position.y;

  if (!(body as any).dontTransferAngle) {
    sprite.rotation = body.angle;
  }

  return sprite;
}

function initializeSpriteObject(body: Matter.Body, sprite: PIXI.Sprite) {
  // update some variables, that only need to be updated once.
  const size = Vector.sub(body.bounds.min, body.bounds.max);
  sprite.width = size.x; 
  sprite.height = size.y;

  sprite.anchor.set(0.5);


  return updateSpriteObjectInternal(body, sprite);
}

const sprites: Record<string, PIXI.Sprite> = {};
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

  sprites[body.id].destroy();
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
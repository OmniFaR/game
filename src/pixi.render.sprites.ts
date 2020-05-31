
import * as PIXI from 'pixi.js';
import { Body } from 'matter-js';
import container from './inversify.config';

const app = container.get(PIXI.Application);

/**
 * TODO: Implement
 * @param color 
 */
function parseColorString(color: string): number {
  return 0xff00ff;
}

function updatePixiAndBody(body: Body, sprite: PIXI.Sprite) {
  sprite.anchor.set(0.5);
  // TODO: maybe replace sprite.x with sprite.position.x

  console.log('update');
  sprite.x = body.position.x;
  sprite.y = body.position.y;
  sprite.alpha = body.render.opacity;

  sprite.rotation = body.angle;
}

function initializeSprite(body: Body, sprite: PIXI.Sprite) {
  
  updatePixiAndBody(body, sprite);

  // update some more variables, that only need to be updated once.
  (body as any).width = sprite.width;
  (body as any).height = sprite.height;

  return sprite;
}

const spriteStorage: Record<string, PIXI.Sprite> = {};

function buildSpriteObject(body: Body) {
  if (body.render.sprite.texture) {
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
    sprite.tint = parseColorString(body.render.fillStyle || 'black');
    return sprite;
  }
}

export function createSprite(body: Body) {
  const sprite = initializeSprite(body, buildSpriteObject(body));
  spriteStorage[body.id] = sprite;
  console.log("sprite has been created.");

  app.stage.addChild(sprite);

  return sprite;
}

export function destroySprite(body: Body) {

  const possibleSprite = spriteStorage[body.id];

  if (possibleSprite) {
    app.stage.removeChild(possibleSprite);
    possibleSprite.destroy();
  }

  spriteStorage[body.id] = undefined;
}

export function updateSprite(body: Body) {
  const possibleSprite = spriteStorage[body.id];

  if (possibleSprite) {
    updatePixiAndBody(body, possibleSprite);
  }

  return possibleSprite;
}
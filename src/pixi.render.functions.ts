
import * as PIXI from 'pixi.js';
import { Sprite, Application } from 'pixi.js';
import { Body } from 'matter-js';
import container from './inversify.config';

const app = container.get(Application);

function parseColorString(color: string): number {
  return 0xff00ff;
}

function createSprite(body: Body) {
  if (body.render.sprite.texture) {
    return PIXI.Sprite.from(body.render.sprite.texture);
  } else {
    const sprite = new PIXI.Sprite(PIXI.Texture.WHITE);
    sprite.tint = parseColorString(body.render.fillStyle || 'black');
    return sprite;
  }
}

function updatePixiAndBody(body: Body, sprite: Sprite) {
  sprite.anchor.set(0.5);
  // TODO: maybe replace sprite.x with sprite.position.x
  sprite.x = body.position.x;
  sprite.y = body.position.y;

  sprite.alpha = body.render.opacity;

  sprite.rotation = body.angle;
}

function initializeSprite(body: Body, sprite: Sprite) {
  
  updatePixiAndBody(body, sprite);

  // update some more variables, that only need to be updated once.
  (body as any).width = sprite.width;
  (body as any).height = sprite.height;

  app.stage.addChild(sprite);

  return sprite;
}

const spriteStorage: Record<string, Sprite> = {};
function createOrGetSprite(body: Body) {
  if (!body.render.visible) {
    return;
  }

  if (spriteStorage[body.id]) {
    return spriteStorage[body.id];
  }

  const sprite = createSprite(body);
  initializeSprite(body, sprite);
  spriteStorage[body.id] = sprite;
  return sprite;
}

function destroySprite(body: Body) {

  const possibleSprite = spriteStorage[body.id];

  if (possibleSprite) {
    app.stage.removeChild(possibleSprite);
    possibleSprite.destroy();
  }

  spriteStorage[body.id] = undefined;
}

function updateSprite(body: Body) {
  const sprite = createOrGetSprite(body);
  updatePixiAndBody(body, sprite);

}

export { createOrGetSprite, destroySprite, updateSprite };
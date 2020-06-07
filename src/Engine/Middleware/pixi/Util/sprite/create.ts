import getColor from "../getColor/getColor";
import { Body, Vector } from 'matter-js';
import { EngineBodyPixi, EngineBody } from "../../../../types";
import * as PIXI from 'pixi.js';

function contruct(body: Body): EngineBodyPixi {
  if (body.render && (body.render as any).texture) {
    return {
      delete: (body.render as any).destroy,
      sprite: (body.render as any).texture
    };
  } else if (body.render && body.render.sprite && body.render.sprite.texture) {
    return {
      delete: true,
      sprite: PIXI.Sprite.from(body.render.sprite.texture)
    }
  } else {
    const sprite = new PIXI.Sprite(PIXI.Texture.WHITE);
    sprite.tint = getColor((body.render && body.render.fillStyle) || 'purple');
    return {
      delete: true,
      sprite
    };
  }
}

function create(body: Body): EngineBody {

  const sprite = (body as EngineBody).pixi || contruct(body);

  const size = Vector.sub(body.bounds.min, body.bounds.max);
  sprite.sprite.width = size.x; 
  sprite.sprite.height = size.y;
  

  sprite.sprite.anchor.set(0.5);

  (body as EngineBody).pixi = sprite;

  return body as EngineBody;
}

export default create;
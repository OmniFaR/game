import { Body } from "matter-js";
import SpriteObject from '../sprites/SpriteObject';

function GetSprite(body: Body): PIXI.Sprite|PIXI.AnimatedSprite {
  return (body as any).pixi || SpriteObject(body)[1];
}

export default GetSprite;
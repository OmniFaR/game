import { Sprite } from "pixi.js";
import { Body } from 'matter-js';
import get from "./get";

function set(body: Body, sprite: Sprite|undefined) {
  const engineBody = get(body);

  if (!sprite) {
    engineBody.pixi = undefined;
  } else {
    engineBody.pixi.sprite = sprite;
  }
}

export default set;
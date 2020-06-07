import container from "../../../inversify.config";
import { Application } from "pixi.js";
import ICamera from "../../ICamera";
import { Vector, Bounds } from "matter-js";
import { debugRendererMode } from "../../../config";
import * as PIXI from "pixi.js";
import positionToSize from '../translate/positionToSize';

const app = container.get(Application);

function renderBounds(bounds: Bounds) {
  const graphics = PIXI.Sprite.from(PIXI.Texture.WHITE);

  graphics.x = bounds.min.x;
  graphics.y = bounds.min.y;

  graphics.width = bounds.max.x - bounds.min.x;
  graphics.height = bounds.max.y - bounds.min.y;

  graphics.alpha = .1;

  graphics.tint = 0xFF0000;

  app.stage.addChild(graphics);
  setTimeout(() => {
    app.stage.removeChild(graphics);
  }, 10);
}

/**
 * 
 * // TODO: Smoothen the camera movement (when its small movements.)
 * 
 * @param position 
 * @param size 
 * @param offset 
 * @param camera 
 */
function updatePixiPosition(position: Vector, size: Vector, offset: Vector, camera: ICamera) {
  app.stage.position.x = app.renderer.width / 2;
  app.stage.position.y = app.renderer.height / 2;

  const translatedOffset = positionToSize(offset, size);

  app.stage.scale.x = size.x - translatedOffset.x; 
  app.stage.scale.y = size.y - translatedOffset.y;
  app.stage.pivot.x = position.x + (offset.x / 2);
  app.stage.pivot.y = position.y + (offset.y / 2);

  if (debugRendererMode) {
    renderBounds(camera.getBounds());
  }
}

export default updatePixiPosition;
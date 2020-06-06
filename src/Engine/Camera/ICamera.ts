import { injectable } from "inversify";
import container from '../inversify.config';
import { Events, Engine, Bounds, Vector, Render } from "matter-js";
import { Application } from "pixi.js";
import { debugRendererMode } from "../config";

let activeCameras: Array<ICamera> = [];

const engine = container.get(Engine);
const app = container.get(Application);

@injectable()
abstract class ICamera {

  private index: number|undefined;

  /**
   * Sets the camera to active.
   * If another camera is already active, we will set it to disabled.
   */
  public enable() {
    this.disable();
    this.index = activeCameras.push(this);
  }

  /**
   * Sets the camera to inactive.
   * If another camera was previously enabled, we will fall back to it.
   */
  public disable() {
    if (this.index === undefined) {
      return;
    }

    activeCameras.splice(this.index, 1);
    this.index = undefined;
  }

  public isActive() {
    return this.index === activeCameras.length;
  }

  protected updateCameraPositionAndSize(position: Vector, size: Vector, offset: Vector) {    
    if (debugRendererMode) {
      const render = container.get(Render);

      const windowSize = Vector.create(render.options.width, render.options.height);
      const finalSize = ICamera.translateCameraSizeToPositionSize(size, windowSize);
      const halfFinalSize = Vector.div(finalSize, 2);

      const offset2 = ICamera.translatePositionSizeToCameraSize(offset, windowSize);

      const finalPosition = Vector.sub(Vector.sub(position, halfFinalSize), Vector.div(offset2, 2));
      render.bounds.min = finalPosition;
      render.bounds.max = Vector.add(Vector.add(finalPosition, finalSize), offset2);
    }

    app.stage.position.x = app.renderer.width / 2;
    app.stage.position.y = app.renderer.height / 2;

    const translatedOffset = ICamera.translatePositionSizeToCameraSize(offset, size);

    app.stage.scale.x = size.x - translatedOffset.x; 
    app.stage.scale.y = size.y - translatedOffset.y;
    app.stage.pivot.x = position.x + (offset.x / 2);
    app.stage.pivot.y = position.y + (offset.y / 2);
  }

  private renderCameraBounds(app: Application) {
    const graphics = PIXI.Sprite.from(PIXI.Texture.WHITE);

    const bounds = this.getBounds();

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

  protected static translatePositionSizeToCameraSize(vector: Vector, size: Vector) {
    return Vector.create(size.y * vector.x, size.x * vector.y);
  }

  protected static translateCameraSizeToPositionSize(vector: Vector, size: Vector) {
    return Vector.create(size.x / vector.x, size.y / vector.y);
  }

  /**
   * @internal
   * @param engine The engine
   */
  public abstract onUpdate(engine: Engine, app: Application);

  public abstract getBounds(): Bounds;
}

container.bind(ICamera).toDynamicValue(() => {
  if (activeCameras.length > 0) {
    for (let index = activeCameras.length - 1; index > 0; index--) {
      const camera = activeCameras[index];

      if (!camera || !camera.isActive()) {
        continue;
      }

      return camera;
    }
    return activeCameras[activeCameras.length - 1];
  }
});

Events.on(engine, 'afterUpdate', (event) => {
  const camera = container.get(ICamera);

  if (!camera) {
    return;
  }

  camera.onUpdate(engine, app);
})

export default ICamera;
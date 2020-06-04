import { injectable } from "inversify";
import container from '../inversify.config';
import { Events, Engine, Bounds, Vector, Render } from "matter-js";
import { Application } from "pixi.js";
import { debugRendererMode } from "../config";

let activeCameras: Array<ICamera> = [];

const engine = container.get(Engine);
const app = container.get(Application);


function multVectors(a: Vector, b: Vector) {
  return Vector.create(a.x * b.x, a.y * b.y);
}

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

  protected updateCameraPositionAndSize(position: Vector, size: Vector) {
    if (debugRendererMode) {
      const render = container.get(Render);

      const finalSize = multVectors(Vector.create(render.options.width, render.options.height), size);

      const centerPosition = Vector.sub(position, Vector.div(finalSize, 2));
      render.bounds.min = centerPosition;
      render.bounds.max = Vector.add(position, finalSize);
    }

    app.stage.position.x = app.renderer.width/2;
    app.stage.position.y = app.renderer.height/2;

    app.stage.scale.copyFrom(size as any);
    app.stage.pivot.copyFrom(position as any);
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
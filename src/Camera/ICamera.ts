import { injectable } from "inversify";
import container from '../inversify.config';
import { Events, Engine, Bounds } from "matter-js";
import { Application } from "pixi.js";

let activeCameras: Array<ICamera> = [];

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

const engine = container.get(Engine);
const app = container.get(Application);
Events.on(engine, 'afterUpdate', (event) => {
  const camera = container.get(ICamera);

  if (!camera) {
    return;
  }

  camera.onUpdate(engine, app);
})

export default ICamera;
import { injectable } from "inversify";
import { Engine, Bounds, Vector } from "matter-js";
import { Application } from "pixi.js";

// Import the camera update function.
import updatePositionAndSize from './Util/updatePositionAndSize';

// Import the hooks
import './Hooks';

export let activeCameras: Array<ICamera> = [];

export let activeCamera: ICamera = undefined;

@injectable()
abstract class ICamera {

  /**
   * Store the index of the camera.
   */
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

  /**
   * Checks if a camera could update.
   */
  public canBeActive() {
    return true;
  }

  /**
   * Checks if the camera is active
   */
  public isActive() {
    return this === activeCamera;
  }

  /**
   * Redirects the update call to the the Utility function.
   * 
   * @param app The app
   * @param position  The camera position
   * @param size The camera scaling (in %)
   * @param offset The camera offset
   */
  protected updateCameraPositionAndSize(app: Application, position: Vector, size: Vector, offset: Vector) {    
    updatePositionAndSize(position, size, offset, this);
  }

  /**
   * @internal
   * 
   * The update function.
   * Should calculate the position, size and the offset and call the ICamera::updateCameraPositionAndSize method if needed.
   * 
   * @param engine The engine
   * @param app The app
   */
  public abstract onUpdate(engine: Engine, app: Application): Bounds;

  /**
   * Returns the bounds for this camera.
   */
  public abstract getBounds(): Bounds;
}

export default ICamera;
import ICamera from "../ICamera";
import { injectable } from "inversify";
import { Application } from "pixi.js";
import { Engine, Bounds, Vector } from "matter-js";

@injectable()
class StaticCamera extends ICamera {

  /**
   * The current camera position.
   */
  private position: Vector = Vector.create();

  /**
   * The current camera size.
   */
  private size: Vector = Vector.create();

  /**
   * The current camera bounds.
   */
  private bounds: Bounds;

  constructor() {
    super();
    
    this.updateBounds();
  }

  /**
   * Sets the current camera position.
   * 
   * @param x
   * @param y
   */
  public setPosition(x: number, y: number): StaticCamera {
    this.position = Vector.create(x, y);
    this.updateBounds();
    return this;
  }

  /**
   * 
   * Sets the current camera size.
   * 
   * @param width 
   * @param height 
   */
  public setSize(width: number, height: number): StaticCamera {
    this.size = Vector.create(width, height);
    this.updateBounds();
    return this;
  }

  /**
   * Calculates the bounds for this camera.
   */
  private updateBounds() {
    this.bounds = Bounds.create([this.position,Vector.add(this.position, this.size)]);
  }

  /**
   * @inheritdoc
   */
  public onUpdate(engine: Engine, app: Application) {
    this.updateCameraPositionAndSize(app, this.position, this.size, Vector.create(0, 0));
    return this.bounds;
  }

  /**
   * Gets the current bounds.
   */
  public getBounds(): Bounds {
    return this.bounds;
  }
}

export default StaticCamera;
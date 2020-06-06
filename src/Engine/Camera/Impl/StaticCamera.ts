import ICamera from "../ICamera";
import { injectable } from "inversify";
import { Application } from "pixi.js";
import { Engine, Bounds, Vector } from "matter-js";

@injectable()
class StaticCamera extends ICamera {

  private position: Vector = Vector.create();

  private size: Vector = Vector.create();

  private bounds: Bounds;

  constructor() {
    super();
    
    this.updateBounds();
  }

  public setPosition(x: number, y: number): StaticCamera {
    this.position = Vector.create(x, y);
    this.updateBounds();
    return this;
  }

  public setSize(width: number, height: number): StaticCamera {
    this.size = Vector.create(width, height);
    this.updateBounds();
    return this;
  }

  private updateBounds() {
    this.bounds = Bounds.create([this.position,Vector.add(this.position, this.size)]);
  }

  public onUpdate(engine: Engine, app: Application) {
    this.updateCameraPositionAndSize(this.position, this.size, Vector.create(0, 0));
  }

  public getBounds(): Bounds {
    return this.bounds;
  }
}

export default StaticCamera;
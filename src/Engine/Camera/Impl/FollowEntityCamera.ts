import ICamera from "../ICamera";
import { Bounds, Body, Engine, Composite, Vector } from 'matter-js';
import { injectable } from "inversify";
import * as PIXI from "pixi.js";
import { Application } from 'pixi.js';
import container from "../../inversify.config";

type FollowEntityCameraOptions = {
  minimalScale: number;
  distanceOffset: number;
}

const defaultEntityCameraOptions: FollowEntityCameraOptions = {
  minimalScale: 0.8, // scale in %
  distanceOffset: .002 // offset in units (when the camera starts scaling)
}

type InternalBounds = {
  min: Vector; 
  max: Vector;
}

@injectable()
class FollowEntityCamera extends ICamera {

  private options: FollowEntityCameraOptions;

  private bounds: InternalBounds|undefined;

  private bodyIds: Record<number, boolean> = [];

  constructor(options: Partial<FollowEntityCameraOptions> = {}) {
    super();

    this.options = Object.assign({},defaultEntityCameraOptions, options);
  }

  addBody(body: Body) {
    this.bodyIds[body.id] = true;
  }

  removeBody(body: Body) {
    this.bodyIds[body.id] = false;
  }

  onUpdate(engine: Engine, app: Application) {
    const boundEntries = Object.entries(this.bodyIds) as any as Array<[number, boolean]>;
    const usedBodyIds = boundEntries.filter(([,isActive]) => isActive).map(([id]) => id);

    if (usedBodyIds.length === 0) {
      return;
    }

    const bodies = usedBodyIds.map((id) => Composite.get(engine.world, id, 'body')) as Array<Body>;

    this.bounds = this.calculateBounds(bodies);

    const graphics = PIXI.Sprite.from(PIXI.Texture.WHITE);

    graphics.x = this.bounds.min.x;
    graphics.y = this.bounds.min.y;

    graphics.width = this.bounds.max.x - this.bounds.min.x;
    graphics.height = this.bounds.max.y - this.bounds.min.y;

    graphics.alpha = .1;

    graphics.tint = 0xFF0000;

    app.stage.addChild(graphics);
    setTimeout(() => {
      app.stage.removeChild(graphics);
    }, 10);

    if (usedBodyIds.length === 2) {
      console.log(this.bounds, bodies);
    }

    const elementSize = Vector.sub(this.bounds.max, this.bounds.min);
    const cameraSize = this.getCameraSize(app, elementSize);
    this.bounds.max = Vector.add(this.bounds.min, cameraSize);

    const cameraPosition = this.getCameraPosition(app, elementSize);

    this.updateCameraPositionAndSize(cameraPosition, cameraSize);
  }

  private updateCameraPositionAndSize(cameraPosition: Vector, cameraSize: Vector) {
    if (this.options.distanceOffset > 0) {

      const distance = Vector.create(this.options.distanceOffset, this.options.distanceOffset);
      const halfDistance = Vector.div(distance, 2);

      super.updateCameraPositionAndSize(
        cameraPosition,
        cameraSize);
        //Vector.sub(cameraPosition, halfDistance), 
        //Vector.add(cameraSize, distance));
    } else {
      super.updateCameraPositionAndSize(cameraPosition, cameraSize);
    }
  }

  private calculateBounds(bodies: Body[]): InternalBounds {
    return Bounds.create(bodies.reduce((allVertices, { vertices }) => [ ...allVertices, ...vertices ], []));
  }

  private getCameraPosition(app: Application, elementSize: Vector) {
    const { min } = this.bounds;

    const halfFinalSize = Vector.div(elementSize, 2);

    return Vector.add(min, halfFinalSize);

    //    return Vector.create(min.x - (size.x) * finalSize.x, min.y - (size.y) * finalSize.y);
  }

  private getCameraSize(app: Application, size: Vector): Vector {
    const { x, y } = size;
    const { width, height } = app.renderer;

    const estimatedScale = Math.min( width / x , height / y);

    const cameraSize = Math.min(estimatedScale, this.options.minimalScale);

    return Vector.create(cameraSize, cameraSize);
  }

  getBounds(): Bounds {
    return this.bounds;
  }

}

export default FollowEntityCamera;
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
  distanceOffset: 0.1 // offset in units (when the camera starts scaling)
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

    const elementBounds = Bounds.create(bodies.reduce((allVertices, { vertices }) => [ ...allVertices, ...vertices ], []));

    this.bounds = elementBounds;

    const elementSize = Vector.sub(elementBounds.max, elementBounds.min);
    const cameraSize = this.getCameraSize(app, elementSize);

    const cameraPosition = this.getCameraPosition(app, elementSize, elementBounds);

    this.updateCameraPositionAndSize(cameraPosition, cameraSize);
  }

  protected updateCameraPositionAndSize(cameraPosition: Vector, cameraSize: Vector) {
    if (this.options.distanceOffset > 0) {

      const distance = Vector.create(this.options.distanceOffset, this.options.distanceOffset);
      const halfDistance = Vector.div(distance, 2);

      super.updateCameraPositionAndSize( cameraPosition, cameraSize, halfDistance );
    } else {
      super.updateCameraPositionAndSize(cameraPosition, cameraSize, Vector.create(0, 0));
    }
  }

  private getCameraPosition(app: Application, elementSize: Vector, elementBounds: Bounds) {
    const { min } = elementBounds;

    const halfFinalSize = Vector.div(elementSize, 2);

    return Vector.add(min, halfFinalSize);
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

  isActive() {
    return super.isActive() && Object.values(this.bodyIds).find((value) => value);
  }
}

export default FollowEntityCamera;
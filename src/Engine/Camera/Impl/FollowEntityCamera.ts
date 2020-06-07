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

  /**
   * The options used to create the camera.
   */
  private options: FollowEntityCameraOptions;

  /**
   * The bounds of the current/last update.
   * 
   * They will change while updating
   */
  private bounds: InternalBounds|undefined;

  /**
   * All the ids for the bodies used by this camera.
   */
  private bodyIds: Record<number, boolean> = [];

  constructor(options: Partial<FollowEntityCameraOptions> = {}) {
    super();

    this.options = Object.assign({}, defaultEntityCameraOptions, options);
  }

  /**
   * Adds a body, so that the camera will follow him.
   * 
   * @param body a body that the camera will keep on the screen.
   */
  addBody(body: Body) {
    this.bodyIds[body.id] = true;
  }

  /**
   * Removes a body, so that the camera does not follow him anymore.
   * 
   * @param body a body that the camera might was keeping on the screen.
   */
  removeBody(body: Body) {
    this.bodyIds[body.id] = false;
  }

  /**
   * @inheritdoc
   */
  onUpdate(engine: Engine, app: Application) {
    // get all the bodies
    const boundEntries = Object.entries(this.bodyIds) as any as Array<[number, boolean]>;
    const usedBodyIds = boundEntries.filter(([,isActive]) => isActive).map(([id]) => id);

    // make sure that we have bodies to use.
    if (usedBodyIds.length === 0) {
      return;
    }

    // get the bodies from the engine.
    const bodies = usedBodyIds.map((id) => Composite.get(engine.world, id, 'body')) as Array<Body>;

    // calculate the bounds.
    const elementBounds = Bounds.create(bodies.reduce((allVertices, { vertices }) => [ ...allVertices, ...vertices ], []));

    // set the bounds.
    this.bounds = elementBounds;

    // calculucate element size.
    const elementSize = Vector.sub(elementBounds.max, elementBounds.min);

    // caluculate size + position of camera.
    const cameraSize = this.getCameraSize(app, elementSize);
    const cameraPosition = this.getCameraPosition(app, elementSize, elementBounds);

    // update size + position of camera.s
    this.updateCameraPositionAndSize(app, cameraPosition, cameraSize);

    return this.bounds;
  }

  /**
   * Calucalates the offset.
   */
  protected getOffset() {
    if (this.options.distanceOffset > 0) {
      
      const distance = Vector.create(this.options.distanceOffset, this.options.distanceOffset);
      const halfDistance = Vector.div(distance, 2);

      return halfDistance;
    }

    return Vector.create(0, 0);
  }

  /**
   * @inheritdoc
   * 
   * Removed offset argument and added calulation for it.
   */
  protected updateCameraPositionAndSize(app: Application, cameraPosition: Vector, cameraSize: Vector) {
    super.updateCameraPositionAndSize(app, cameraPosition, cameraSize, this.getOffset());
  }

  /**
   * Calculates the current camera position.
   * 
   * @param app The application
   * @param elementSize The calculated size of the elements.
   * @param elementBounds The calculated bounds of the elements.
   */
  private getCameraPosition(app: Application, elementSize: Vector, elementBounds: Bounds) {
    const { min } = elementBounds;

    const halfFinalSize = Vector.div(elementSize, 2);

    return Vector.add(min, halfFinalSize);
  }

  /**
   * @param app The application
   * @param size The calculated size of the elements.
   */
  private getCameraSize(app: Application, size: Vector): Vector {
    const { x, y } = size;
    const { width, height } = app.renderer;

    const estimatedScale = Math.min( width / x , height / y);

    const cameraSize = Math.min(estimatedScale, this.options.minimalScale);

    return Vector.create(cameraSize, cameraSize);
  }

  /**
   * @inheritdoc
   */
  getBounds(): Bounds {
    return this.bounds;
  }

  /**
   * @inheritdoc
   */
  canBeActive() {
    return super.canBeActive() && Object.values(this.bodyIds).find((value) => value);
  }
}

export default FollowEntityCamera;
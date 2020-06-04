import ICamera from "../ICamera";
import { Bounds, Body, Engine, Composite, Vector } from 'matter-js';
import { injectable } from "inversify";
import { Application } from "pixi.js";

type FollowEntityCameraOptions = {
  minimalScale: number;
  distanceOffset: number;
}

const defaultEntityCameraOptions: FollowEntityCameraOptions = {
  minimalScale: 0.8, // scale in %
  distanceOffset: 20 // offset in units (when the camera starts scaling)
}

@injectable()
class FollowEntityCamera extends ICamera {

  private options: FollowEntityCameraOptions;

  private bounds: Bounds = Bounds.create([]);

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

    const size = Vector.sub(this.bounds.max, this.bounds.min);
    const resultingSize = this.updateCameraPosition(app, this.updateCameraSize(app, size));

    this.bounds.max = Vector.add(this.bounds.min, resultingSize);
  }

  private calculateBounds(bodies: Body[]): Bounds {
    return Bounds.create(bodies.reduce((allVertices, { vertices }) => [ ...allVertices, ...vertices ], []));
  }

  private updateCameraPosition(app: Application, size: Vector) {
    const { min } = this.bounds;
    const position = Vector.add(min, Vector.div(size, 2));

    app.stage.position.x = app.renderer.width/2;
    app.stage.position.y = app.renderer.height/2;
    app.stage.pivot.copyFrom(position as any);

    return size;
  }

  private updateCameraSize(app: Application, size: Vector): Vector {
    const newSize = Vector.add(size, Vector.create(this.options.distanceOffset, this.options.distanceOffset));

    const { x, y } = newSize;
    const { width, height } = app.renderer;

    const estimatedScale = Math.min( width / x, height / y);

    app.stage.scale.x = app.stage.scale.y = Math.min(estimatedScale, this.options.minimalScale);


    return size;
  }

  getBounds(): Bounds {
    return this.bounds;
  }

}

export default FollowEntityCamera;
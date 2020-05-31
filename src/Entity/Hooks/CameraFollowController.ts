import { Body, Events, Engine } from "matter-js";
import { Application } from 'pixi.js';
import container from '../../inversify.config';

type CameraOptionsType = {
  initialScale: number;
  scaleFactor: number;
  movementFactor: number;
}

const defaultCameraOptions = {
  initialScale: 0.8,
  scaleFactor: 0.02,
  movementFactor: 0.02,
}


function CameraFollowController(entity: Body, options: Partial<CameraOptionsType> = {}) {


  const {
    initialScale,
    scaleFactor,
    movementFactor
  }  = { ...options, ...defaultCameraOptions } as CameraOptionsType

  const app = container.get(Application);
  const engine = container.get(Engine);


  app.stage.position.x = app.renderer.width/2;
  app.stage.position.y = app.renderer.height/2;
  app.stage.scale.x = initialScale;
  app.stage.scale.y = initialScale;

  Events.on(engine, "beforeUpdate", () => {
    app.stage.pivot.x = entity.position.x + (entity.velocity.x * movementFactor);
    app.stage.pivot.y = entity.position.y + (entity.velocity.y * movementFactor);

    const extraScale = ((entity.velocity.x * scaleFactor) + (entity.velocity.y * scaleFactor)) / 2;
    const absuluteExtraScale = Math.abs(extraScale);

    // TODO: Make the camera transition the scale over time 
    app.stage.scale.x = initialScale + absuluteExtraScale;
    app.stage.scale.y = initialScale + absuluteExtraScale;
  });
}

export default CameraFollowController;
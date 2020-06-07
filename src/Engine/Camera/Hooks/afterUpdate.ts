import { Engine, Events } from 'matter-js';
import container from '../../inversify.config';
import ICamera, { activeCameras } from '../ICamera';
import { Application } from 'pixi.js';

const engine = container.get(Engine);
const app = container.get(Application);

function getActiveCamera() {
  if (activeCameras.length === 0) {
    return;
  }

  for (let index = activeCameras.length - 1; index > 0; index--) {
    const camera = activeCameras[index];

    if (!camera || !camera.canBeActive()) {
      continue;
    }

    return camera;
  }
  return activeCameras[activeCameras.length - 1];
}

/**
 * Register an 'afterUpdate' event to the engine.
 */
Events.on(engine, 'afterUpdate', (event) => {
  if (!container.isBound(ICamera)) {
    // If we dont have a method to get a camera, use the method defined above.
    container.bind(ICamera).toDynamicValue(getActiveCamera);
  }

  // Get the camera
  const camera = container.get(ICamera);

  // make sure that we have a camera.
  if (!camera) {
    return;
  }

  // Run the update function.
  camera.onUpdate(engine, app);
})
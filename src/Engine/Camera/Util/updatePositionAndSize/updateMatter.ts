import { Vector, Render } from "matter-js";
import ICamera from "../../ICamera";
import container from "../../../inversify.config";
import sizeToPosition from '../translate/sizeToPosition';
import positionToSize from '../translate/positionToSize';

function updateRenderPosition(position: Vector, size: Vector, offset: Vector, camera: ICamera) {
  const render = container.get(Render);

  const windowSize = Vector.create(render.options.width, render.options.height);
  const finalSize = sizeToPosition(size, windowSize);
  const halfFinalSize = Vector.div(finalSize, 2);

  const offset2 = positionToSize(offset, windowSize);

  const finalPosition = Vector.sub(Vector.sub(position, halfFinalSize), Vector.div(offset2, 2));
  render.bounds.min = finalPosition;
  render.bounds.max = Vector.add(Vector.add(finalPosition, finalSize), offset2);
}

export default updateRenderPosition;
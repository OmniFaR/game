import { Vector } from "matter-js";
import ICamera from "../../ICamera";
import updatePixiPosition from "./updatePixi";
import updateRenderPosition from "./updateMatter";
import { debugRendererMode } from "../../../config";

function updatePositionAndSize(position: Vector, size: Vector, offset: Vector, camera: ICamera) {
  updatePixiPosition(position, size, offset, camera);
  if (debugRendererMode) {
    updateRenderPosition(position, size, offset, camera);
  }
}

export default updatePositionAndSize;
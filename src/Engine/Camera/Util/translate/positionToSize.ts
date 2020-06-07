import { Vector } from "matter-js";

const positionToSize = (vector: Vector, size: Vector) => Vector.create(size.y * vector.x, size.x * vector.y);

export default positionToSize;
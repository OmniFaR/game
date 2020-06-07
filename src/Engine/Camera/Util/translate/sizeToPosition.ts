import { Vector } from "matter-js";

const sizeToPosition = (vector: Vector, size: Vector) => Vector.create(size.x / vector.x, size.y / vector.y);

export default sizeToPosition;
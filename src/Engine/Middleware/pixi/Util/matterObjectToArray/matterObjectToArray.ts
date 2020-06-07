import { Composite, Body } from "matter-js";


function matterObjectToArray(object: any): Body[] {
  if (Array.isArray(object)) {
    return object;
  }

  if (typeof object === "object" && object.type === "body") {
    return [ object ];
  }

  return Composite.allBodies(object);
}

export default matterObjectToArray;
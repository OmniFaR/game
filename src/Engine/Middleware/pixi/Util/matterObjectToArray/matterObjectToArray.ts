import { Composite, Body } from "matter-js";


function matterObjectToArray(object: any): Body[] {
  if (Array.isArray(object)) {
    return object;
  }

  return Composite.allBodies(object);
}

export default matterObjectToArray;
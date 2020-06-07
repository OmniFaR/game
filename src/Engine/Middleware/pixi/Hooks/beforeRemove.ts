import container from "../../../inversify.config";
import Matter from "matter-js";
import { remove } from '../';
import matterObjectToArray from "../Util/matterObjectToArray/matterObjectToArray";

const engine = container.get(Matter.Engine);

Matter.Events.on(engine.world, "beforeRemove", ({ object }) => remove(matterObjectToArray(object)));
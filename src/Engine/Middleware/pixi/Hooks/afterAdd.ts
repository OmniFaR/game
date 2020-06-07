import container from "../../../inversify.config";
import Matter from "matter-js";
import { add } from '../';
import matterObjectToArray from "../Util/matterObjectToArray/matterObjectToArray";

const engine = container.get(Matter.Engine);

Matter.Events.on(engine.world, "afterAdd", ({ object }) => add(matterObjectToArray(object)));
import container from "./inversify.config";
import { Engine, World } from "matter-js";
import Player from "./Entity/Impl/Player";
import IInput from './Input/IInput';

const engine = container.get(Engine);

const sleep = (time: number) => new Promise((resolve) => setTimeout(resolve, time))

async function createInput() {
  const input = container.get(IInput);

  const addInput = async (name: string) => {
    const [promise, cancel] = input.waitForAnyKeyInput();
    input.registerKey(name, await promise);
    await sleep(500);
  };

  input.registerKey("left", 37);
  input.registerKey("right", 39);
  input.registerKey("jump", 38);

//  await addInput("left");
//  await addInput("right");
//  await addInput("jump");

  return input;
}

let addingPlayer = false;

document.getElementById('createPlayer').addEventListener('click', async (event) => {
  event.preventDefault();
  event.stopImmediatePropagation();


  if (addingPlayer) {
    return;
  }

  addingPlayer = true;

  World.add(engine.world, [
    Player(await createInput())
  ])
  
  addingPlayer = false;
})
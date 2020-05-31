import container from '../inversify.config';
import IInput from '../Input/IInput';

const sleep = (time: number) => new Promise((resolve) => setTimeout(resolve, time))

let isFirstInput = true;
async function createInput(): Promise<() => Promise<IInput>> {
  // TODO: Implement a method to select input device.
  // (Press any key on the device you want to use)
  const input = container.get(IInput);

  return async () => {
    const addInput = async (name: string) => {
      const [promise, cancel] = input.waitForAnyKeyInput();
      input.registerKey(name, await promise);
      await sleep(500);
    };
  
    if (isFirstInput) {  
      input.registerKey("left", 37);
      input.registerKey("right", 39);
      input.registerKey("jump", 38);
    } else {
      await addInput("right");
      await addInput("left");
      await addInput("jump");
    }

    isFirstInput = false;
  
    return input;
  }
}

export default createInput;
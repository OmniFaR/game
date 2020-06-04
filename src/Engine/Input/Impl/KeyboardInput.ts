
import { injectable } from "inversify";
import AbstractInput from "../AbstractInput";

let pressedKeys: Record<number, boolean> = {};

document.addEventListener('keydown', ({ keyCode }) => pressedKeys[keyCode] = true);
document.addEventListener('keyup', ({ keyCode}) => pressedKeys[keyCode] = false);

@injectable()
class KeyboardInput extends AbstractInput {

  waitForAnyKeyInput(): [Promise<any>, () => void] {
    let hasBeenRejected = false;
    let rejectFunction = () => { hasBeenRejected = true };
    const promise = new Promise<any>((resolve, reject) => {
      const onKeyDown = ({ keyCode }) => {
        document.removeEventListener('keydown', onKeyDown);
        resolve(keyCode);
      };

      document.addEventListener('keydown', onKeyDown);

      rejectFunction = () => {
        reject();
        document.removeEventListener('keydown', onKeyDown);
      };

      if (hasBeenRejected) {
        rejectFunction();
      }
    });

    return [promise, rejectFunction];
  }

  _keyPressed(name: string): boolean {
    return pressedKeys[name] || false;
  }

  _keyValue(name: string) : number {
    return this._keyPressed(name) ? 1 : 0;
  }
}

export default KeyboardInput;
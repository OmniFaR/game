import { injectable } from 'inversify';
import AbstractInput from '../AbstractInput';

const axisPrefix = 'axis_';

@injectable()
class GamepadController extends AbstractInput {

  private gamepad: Gamepad;

  constructor(index: number) {
    super();

    this.gamepad = navigator.getGamepads()[index];
  }

  _keyPressed(name: string): boolean {
    if (name.startsWith(axisPrefix)) {
      return this._keyPressedAxis(name.substring(axisPrefix.length))
    }

    return this._keyPressedButton(name);
  }

  _keyValue(name: string): number {
    if (name.startsWith(axisPrefix)) {
      return this._keyValueAxis(name.substring(axisPrefix.length));
    }

    return this._keyValueButton(name);
  }

  private _keyPressedAxis(name: string): boolean {
    return this.gamepad.axes[Number(name)] > .5;
  }

  private _keyPressedButton(name: string): boolean {
    return this.gamepad.buttons[Number(name)].pressed;
  }

  private _keyValueAxis(name: string): number {
    return this.gamepad.axes[Number(name)];
  }

  private _keyValueButton(name: string): number {
    return this.gamepad.buttons[Number(name)].value;
  }

  waitForAnyKeyInput(): [Promise<any>, () => void] {
    throw new Error("Method not implemented.");
  }
} 

export default GamepadController;
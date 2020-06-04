import IInput from "./IInput";
import { injectable } from "inversify";

@injectable()
abstract class AbstractInput implements IInput {

  private defaultBindings: Record<string, any> = {};
  private keybindings: Record<string, any> = {};
  private registeredKeys: Array<string> = [];

  /**
   * @inheritdoc
   */
  registerKey(name: string, defaultKey: any) {
    if (this.hasBinding(name)) {
      throw new Error("A key with this name has already been registered.");
    }

    this.registeredKeys.push(name);

    if (defaultKey === undefined) {
      return;
    }

    this.defaultBindings[name] = defaultKey;
  }

  /**
   * @inheritdoc
   */
  setKey(name: string, key: any) {
    if (!this.hasBinding(name)) {
      throw new Error("A key with this name has not been registered.");
    }

    if (this.defaultBindings[key] === key) {
      this.keybindings[key] = undefined;
      return;
    }

    this.keybindings[key] = key;
  }

  /**
   * @inheritdoc
   */
  getBindings(): Record<string, any> {
    return this.keybindings;
  }

  /**
   * @inheritdoc
   */
  setBindings(bindings: Record<string, any>) {
    return this.keybindings = bindings;
  }

  getNames() {
    return this.registeredKeys;
  }

  /**
   * Checks if a key with the given binding is registered.
   * 
   * @param name The name
   */
  private hasBinding(name: string) {
    return this.registeredKeys.includes(name);
  }

  /**
   * Get the current binding for the given key.
   * 
   * @param name 
   */
  private getBindingFor(name: string) {
    if (!this.hasBinding(name)) {
      throw new Error("A key with this name has not been registered.");
    }

    return this.keybindings[name] || this.defaultBindings[name];
  }

  /**
   * @inheritdoc
   */
  abstract waitForAnyKeyInput(): [Promise<any>, () => void];

  /**
   * @inheritdoc
   */
  keyPressed(name: string) {
    return this._keyPressed(this.getBindingFor(name));
  }

  keyValue(name: string) {
    return this._keyValue(this.getBindingFor(name));
  }

  abstract _keyPressed(name: string): boolean;

  abstract _keyValue(name: string): number;
}

export default AbstractInput;
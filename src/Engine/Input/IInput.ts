import { injectable } from "inversify";

@injectable()
abstract class IController {

  /**
   * Returns all the non default bindings.
   */
  abstract getBindings(): Record<string, any>;

  /**
   * 
   * Sets all the non default bindings.
   * 
   * @param bindings The bindings.
   */
  abstract setBindings(bindings: Record<string, any>): void;

  /**
   * 
   * Register a new keybinding.
   * 
   * @param name The name of the key.
   * @param defaultKey The default key.
   */
  abstract registerKey(name: string, defaultKey: any): void;

  /**
   * 
   * Updates a keybinding.
   * 
   * @param name 
   * @param key 
   */
  abstract setKey(name: string, key: string): void;

  /**
   * Waits for any input and returns the given key.
   */
  abstract waitForAnyKeyInput(): [Promise<any>, () => void];

  /**
   * Checks if a keybinding has been pressed.
   * 
   * @param name
   * @return
   */
  abstract keyPressed(name: string): boolean;

  /**
   * Checks if a keybinding has been pressed.
   * 
   * @param name
   * @returns a number between 0 and 1 (It shows how mutch the button was pressed)
   */
  abstract keyValue(name: string): number;

  /**
   * Gets all the registered key names.
   */
  abstract getNames(): Array<string>;
}

export default IController;
import Player from "../../src/Entity/Impl/Player/Player";
import createInput from "./createPlayer_createInput";
import documentReady from "../Util/documentReady";
import createButton from "../Util/createButton";

let addingPlayer = false;

console.log("ok!");

documentReady(() => {
  const element = createButton("Create player");

  element.addEventListener('click', async (event) => {
    event.preventDefault();
    event.stopImmediatePropagation();
  
  
    if (addingPlayer) {
      return;
    }
  
    addingPlayer = true;
  
    let originalText = element.innerText;
    element.innerText = "Waiting for the user to press any key on the desired device.";
    const inputFactory = await createInput();
    element.innerText = "Waiting for inputs to select keys to controll caracter.";
    const input = await inputFactory();
    element.innerText = originalText;
  
    Player(input);
    
    addingPlayer = false;
  })
})
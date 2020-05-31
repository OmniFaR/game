import Player from "../../src/Entity/Impl/Player/Player";
import createInput from "./createPlayer_createInput";
import documentReady from "../Util/documentReady";
import createButton from "../Util/createButton";


documentReady(() => {
  
  const createPlayerButton = createButton("Create player");

  
  let addingPlayer = false;

  createPlayerButton.addEventListener('click', async (event) => {
    event.preventDefault();
    event.stopImmediatePropagation();
  
  
    if (addingPlayer) {
      return;
    }
  
    addingPlayer = true;
  
    let originalText = createPlayerButton.innerText;
    createPlayerButton.innerText = "Waiting for the user to press any key on the desired device.";
    const inputFactory = await createInput();
    createPlayerButton.innerText = "Waiting for inputs to select keys to controll caracter.";
    const input = await inputFactory();
    createPlayerButton.innerText = originalText;
  
    const [player, deletePlayer] = await Player(input);

    const button = createButton(`Delete player (${player.id})`);
    const onClick = () => {
      event.preventDefault(),
      event.stopImmediatePropagation();
      document.removeEventListener('click', onClick);
      button.parentElement.removeChild(button);

      deletePlayer();
    }
    button.addEventListener('click', onClick);
    
    addingPlayer = false;
  })
})
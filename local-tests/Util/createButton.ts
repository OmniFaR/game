
function createButton(name: string) {
  const tempButton = document.createElement('button');

  tempButton.innerText = name;

  return document.body.appendChild(tempButton);
}

export default createButton;
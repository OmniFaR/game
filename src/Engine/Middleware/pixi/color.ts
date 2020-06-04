
function getComputedColor(wantedColor) {
  const element = document.createElement('div');

  element.style.color = wantedColor;
  element.style.width = '0px';
  element.style.height = '0px';
  
  const appendedElement = document.body.appendChild(element);
  const { color } = getComputedStyle(appendedElement);
  document.body.removeChild(appendedElement);

  return color;
}

function colorToRGBA(wantedColor) {
  const color = getComputedColor(wantedColor);
  return color.substring(color.indexOf('(') + 1, color.indexOf(')')).split(',').map(Number);
}


function toHex(value: number) {
  const val = Number(value).toString(16);

  const repeatCount = 2 - val.length;
  if (repeatCount > 0) {
    return "0".repeat(repeatCount) + val;
  }

  return val;
}

function color(color: string): number {
  const [r, g, b] = colorToRGBA(color);

  const hex = '0x' + [r, g, b].map((x) => toHex(x)).join('');
  return parseInt(hex);
}

export default color;
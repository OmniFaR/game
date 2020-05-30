
function main(ctx: CanvasRenderingContext2D) {
  ctx.fillStyle = 'rgb(255, 0, 0)';
  ctx.fillRect(20, 20, 200, 200);
  ctx.fillStyle = 'rgb(0, 255, 0)';
  ctx.font  = '48px sans-serif';
  ctx.fillText("Hello world!", 20, 20, 200);
}

export default main;
import documentReady from './hooks/documentReady';
import main from './main';

const aspectRadtio = 4 / 3;

documentReady().then(async () => {
  console.log("Document is ready!");
  const canvas = document.getElementById('canvas') as HTMLCanvasElement;
  const ctx = canvas.getContext('2d');

  const onResize = () => {
    canvas.style.height = `${canvas.getBoundingClientRect().width / aspectRadtio}px`
  };

  console.log("test hot reload 14!");

  document.addEventListener('resize', onResize);
  onResize();

  main(ctx);
})
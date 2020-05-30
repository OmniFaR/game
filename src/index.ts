import documentReady from './hooks/documentReady';
import main from './main';
import Matter, { Runner, Engine } from 'matter-js';

documentReady().then(async () => {

  const engine = Matter.Engine.create();

  const render = Matter.Render.create({
    element: document.body,
    engine
  });

  const runner = Matter.Runner.create({
    delta: 1000 / 60,
    isFixed: false,
    enabled: false
  });


  (Matter.Render as any).lookAt(render, main(engine));

  Matter.Engine.run(engine);
  Matter.Render.run(render);
  Matter.Runner.run(runner, engine);

})
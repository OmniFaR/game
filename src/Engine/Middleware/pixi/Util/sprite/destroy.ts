import { EngineBody } from '../../../../types';

function destroy(body: Matter.Body) {
  const pixiBody = (body as EngineBody).pixi;
  if (pixiBody && pixiBody.delete && pixiBody.sprite) {
    pixiBody.sprite.destroy();
  }
  (body as EngineBody).pixi = undefined;
}

export default destroy;
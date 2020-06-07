import { Body } from 'matter-js';
import get from './get';

export function update(body: Body) {
  const engineBody = get(body);

  engineBody.pixi.sprite.x = body.position.x;
  engineBody.pixi.sprite.y = body.position.y;

  if (!(body as any).dontTransferAngle) {
    engineBody.pixi.sprite.rotation = body.angle;
  }

  return engineBody;
}
export default update;
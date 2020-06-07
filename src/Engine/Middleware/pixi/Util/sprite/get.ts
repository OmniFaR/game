
import { Body } from 'matter-js';
import { EngineBody } from '../../../../types';
import create from './create';

function get(body: Body): EngineBody {
  return (body as EngineBody).pixi ? (body as EngineBody) : create(body);
}

export default get;
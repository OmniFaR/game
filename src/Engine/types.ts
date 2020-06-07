import Matter from 'matter-js';
import PIXI from 'pixi.js';

export type EngineBodyPixi = {
  sprite: PIXI.Sprite;
  delete: boolean;
};

export type EngineBody = {
  pixi: EngineBodyPixi;
} & Matter.Body;
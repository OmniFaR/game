import Matter from 'matter-js';
import PIXI from 'pixi.js';

export type EngineBodyPixi = {
  sprite: PIXI.Sprite|PIXI.AnimatedSprite;
  delete: boolean;
};

export type EngineBody = {
  pixi: EngineBodyPixi;
} & Matter.Body;
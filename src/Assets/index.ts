import container from "../Engine/inversify.config";
import * as PIXI from 'pixi.js';

const app = container.get(PIXI.Application);

function makeAnimation(name: string, framesCount: number, resources?: PIXI.loaders.Resource) {

  let frames = [];

  for (let i = 0; i <= framesCount; i++) {
    const key = `${name}/${i}.png`;
    frames.push(resources ? resources.textures[key] : PIXI.Texture.from(key));
  }

  return new PIXI.extras.AnimatedSprite(frames);
}

function loadSpriteFile(name: string, file: string): Promise<Partial<Record<string, PIXI.loaders.Resource>>> {
  return new Promise((resolve, reject) => {
    app.loader.add(name, file).load((loader, resources) => resolve(resources));
  });  
}

type DougAssets = {
  idle: PIXI.extras.AnimatedSprite;
  damage: PIXI.extras.AnimatedSprite;
  jump: PIXI.extras.AnimatedSprite;
  walk: PIXI.extras.AnimatedSprite;
}

const loadDougAssetsPromise = new Promise<DougAssets>(async (resolve) => {
  const { player_doug_base } = await loadSpriteFile('player_doug_base', 'assets/_ressources/Player/Doug/sprite.json');

  const idle = makeAnimation('idle', 3, player_doug_base);
  const damage = makeAnimation('damage', 3, player_doug_base);
  const jump = makeAnimation('jump', 3, player_doug_base);
  const walk = makeAnimation('walking', 5, player_doug_base);

  resolve({ idle, damage, jump, walk });
});

export async function loadDougAssets() {
  return await loadDougAssetsPromise;
}
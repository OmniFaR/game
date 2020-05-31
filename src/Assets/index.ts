import * as PIXI from "pixi.js";
import * as Particles from 'pixi-particles';
import container from "../inversify.config";
import { Vector } from "matter-js";

const app = container.get(PIXI.Application);

function makeAnimation(name: string, framesCount: number, resources?: PIXI.LoaderResource) {

  let frames = [];

  for (let i = 0; i <= framesCount; i++) {
    const key = `${name}/${i}.png`;
    frames.push(resources ? resources.textures[key] : PIXI.Texture.from(key));
  }

  return new PIXI.AnimatedSprite(frames);
}

function loadSpriteFile(name: string, file: string): Promise<Partial<Record<string, PIXI.LoaderResource>>> {
  return new Promise((resolve, reject) => {
    app.loader.add(name, file).load((loader, resources) => resolve(resources));
  });  
}

export async function loadDougAssets() {
  const { player_doug_base } = await loadSpriteFile('player_doug_base', 'assets/_ressources/Player/Doug/sprite.json');
  const { player_land_on_ground_particle_json  } = await loadSpriteFile('player_land_on_ground_particle_json', 'assets/_ressources/Player/landOnGround.json');

  const idle = makeAnimation('idle', 3, player_doug_base);
  const damage = makeAnimation('damage', 3, player_doug_base);
  const jump = makeAnimation('jump', 3, player_doug_base);
  const walk = makeAnimation('walking', 5, player_doug_base);
  const player_land_on_ground_particle_factory = (container: PIXI.Container) => new Particles.Emitter(
    app.stage, 
    [PIXI.Texture.from('assets/_ressources/Player/landOnGround.png')], 
    player_land_on_ground_particle_json.data
  );

  return { idle, damage, jump, walk, player_land_on_ground_particle_factory };
}
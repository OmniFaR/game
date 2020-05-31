import { AnimatedSprite } from "pixi.js";

function Animated(sprite: PIXI.AnimatedSprite, options: Record<string, AnimatedSprite|undefined|false>): [(name: string|undefined) => any] {
  let activeAnimation = undefined;
  const setActiveAnimation = (name: string|undefined) => {
    const animation = options[name];

    if (!animation || activeAnimation === name) {
      return;
    }

    activeAnimation = name;

    sprite.textures = animation.textures;
    sprite.animationSpeed = animation.animationSpeed;
    sprite.play();
  };

  return [setActiveAnimation];
}

export default Animated;
import "pixi.js";
import "pixi-layers";
import "pixi-lights";
import { diffuseGroup, normalGroup, lightGroup, PointLight } from "pixi-lights";

const { Application, Container, Sprite, lights, display } = PIXI;

import container from "./inversify.config";

const scene = document.getElementById("scene");

const app = new Application({
  transparent: false,
  resizeTo: scene,
  backgroundColor: 0x000000,
});

(window as any).app = app;

const stage = (app.stage = new display.Stage());

const light = new PointLight(0xffffff, 1);

stage.addChild(new display.Layer(diffuseGroup));
stage.addChild(new display.Layer(normalGroup));
stage.addChild(new display.Layer(lightGroup));

container.bind(Application).toConstantValue(app);

scene.appendChild(app.view);

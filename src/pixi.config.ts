import { Application } from 'pixi.js';
import container from './inversify.config';
import { Engine, Events } from 'matter-js';

const scene = document.getElementById('scene');

const app = new Application({ transparent: false, resizeTo: scene });
container.bind(Application).toConstantValue(app);

scene.appendChild(app.view);
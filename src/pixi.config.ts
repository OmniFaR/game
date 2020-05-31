import { Application } from 'pixi.js';
import container from './inversify.config';

const scene = document.getElementById('scene');

const app = new Application({ transparent: false, resizeTo: scene });
container.bind(Application).toConstantValue(app);

scene.appendChild(app.view);
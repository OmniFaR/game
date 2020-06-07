import './inversify.config';

import './matter.config';
import './pixi.config';
import './proton.config';

import './Middleware';

import IInput from './Input/IInput';
import KeyboardInput from './Input/Impl/KeyboardInput';
import container from './inversify.config';

container.bind(IInput).to(KeyboardInput);
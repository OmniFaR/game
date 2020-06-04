import container from './inversify.config';
import './matter.config';
import './pixi.config';

import './Middleware';

import IInput from './Input/IInput';
import KeyboardInput from './Input/Impl/KeyboardInput';


container.bind(IInput).to(KeyboardInput);
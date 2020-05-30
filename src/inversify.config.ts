import "reflect-metadata";
import { Container } from 'inversify';
import getDecorators from 'inversify-inject-decorators';
import IInput from './Input/IInput';
import KeyboardInput from './Input/Impl/KeyboardInput';

const container = new Container();
const { lazyInject: originalLazyInject } = getDecorators(container);

container.bind(IInput).to(KeyboardInput);

function fixPropertyDecorator<T extends Function>(decorator: T): T {
  return ((...args: any[]) => (
    target: any,
    propertyName: any,
    ...decoratorArgs: any[]
  ) => {
    decorator(...args)(target, propertyName, ...decoratorArgs);
    return Object.getOwnPropertyDescriptor(target, propertyName);
  }) as any;
}

export const lazyInject = fixPropertyDecorator(originalLazyInject);
export default container;
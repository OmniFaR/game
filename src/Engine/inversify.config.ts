import "reflect-metadata";
import { Container } from 'inversify';
import getDecorators from 'inversify-inject-decorators';

const container = new Container();
const { lazyInject: originalLazyInject } = getDecorators(container);

/**
 * Fix for webpack.
 */
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
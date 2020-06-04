
function getEnv<T>(value: any, type: (value: any) => T, defaultValue: T): T {
  if (value !== undefined) {
    return type(value);
  }

  return defaultValue;
}

const booleanFormat = (value: string|undefined) => value && ['true', '1'].includes(value);

export const debugMode = getEnv(process.env.DEBUG_ENABLED, booleanFormat, false);
export const debugRendererMode = getEnv(process.env.DEBUG_RENDER_ENABLED, booleanFormat, debugMode);
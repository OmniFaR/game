
function getEnv<T>(value: any, type: (value: any) => T, defaultValue: T): T {
  if (value !== undefined) {
    return type(value);
  }

  return defaultValue;
}

export const debugMode = getEnv(process.env.DEBUG_ENABLED, Boolean, false);
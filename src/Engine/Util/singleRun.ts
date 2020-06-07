
function singleRun<T extends Function>(fnc: T): T {
  let running = false;


  const newFnc = (...args: any) => {  
    if (running) {
      return;
    }

    running = true;
    let result = fnc();
    Promise.resolve(result).finally(() => running = false);
    return result;
  };

  return newFnc as any as T;
}

export default singleRun;
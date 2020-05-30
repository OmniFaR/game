

function documentReady() {
  if (document.readyState == "complete") {
    return Promise.resolve();
  }

  return new Promise((resolve) => {

    function onReadyStateChanged() {
      if (document.readyState !== "complete") {
        return;
      }

      document.removeEventListener('readystatechange', onReadyStateChanged);
      resolve();
    };

    document.addEventListener('readystatechange', onReadyStateChanged);
  });
}

export default documentReady;
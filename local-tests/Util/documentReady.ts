
function documentReady(callback: () => any) {
  if (document.readyState === "interactive") {
    callback();
    return;
  }

  document.addEventListener('readystatechange', () => {
    if (document.readyState !== "interactive") {
      return;
    }

    callback();
  });
}

export default documentReady;
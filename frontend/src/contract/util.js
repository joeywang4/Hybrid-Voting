function base64ToHex(base64) {
  return window.atob(base64)
    .split('')
    .map(function (aChar) {
      return ('0' + aChar.charCodeAt(0).toString(16)).slice(-2);
    })
    .join('')
    .toUpperCase(); // Per your example output
}

export { base64ToHex }
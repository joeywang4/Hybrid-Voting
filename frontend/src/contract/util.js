function base64ToHex(base64) {
  return window.atob(base64)
    .split('')
    .map(function (aChar) {
      return ('0' + aChar.charCodeAt(0).toString(16)).slice(-2);
    })
    .join('')
    .toUpperCase(); // Per your example output
}

function base64ToBytes32(data, _length=0) {
  let hexData = base64ToHex(data);
  if(_length*2 > hexData.length) hexData = "0".repeat(_length*2 - hexData.length) + hexData;
  let ret = [];
  for(let i = 0;i < Math.floor(hexData.length/64);i++) {
    ret.push("0x"+hexData.substring(i*64, (i+1)*64>hexData.length?hexData.length:(i+1)*64));
  }
  return ret;
}

export { base64ToHex, base64ToBytes32 }
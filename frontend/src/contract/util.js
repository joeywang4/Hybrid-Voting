function base64ToHex(base64) {
  return window.atob(base64)
    .split('')
    .map(function (aChar) {
      return ('0' + aChar.charCodeAt(0).toString(16)).slice(-2);
    })
    .join('')
    .toUpperCase(); // Per your example output
}

function base64ToBytes32(data, byteLength=0) {
  let hexData = base64ToHex(data);
  if(byteLength*2 > hexData.length) hexData = "0".repeat(byteLength*2 - hexData.length) + hexData;
  let ret = [];
  let _len = hexData.length;
  let i = 0;
  for(;i < Math.floor(hexData.length/64);i++) {

    ret = ["0x"+hexData.substring((_len-(i+1)*64), (_len-i*64))].concat(ret);
  }
  if(i*64 < hexData.length) {
    ret = ["0x"+"0".repeat((i+1)*64 - _len)+hexData.substring(0, _len-i*64)].concat(ret);
  }
  return ret;
}

function hexToBase64(_str) {
  if(_str.substring(0, 2) === "0x") _str = _str.substring(2);
  if(_str.length % 2 !== 0) _str = "0".concat(_str);
  return btoa(String.fromCharCode.apply(null,
    _str.replace(/\r|\n/g, "").replace(/([\da-fA-F]{2}) ?/g, "0x$1 ").replace(/ +$/, "").split(" "))
  );
}

function bytes32ToHex(_data, with0x=true) {
  let output = "";
  for(let i = 0;i < _data.length;i++) {
    if(_data[i].substring(0,2) === "0x") output += _data[i].substring(2);
    else output += _data[i];
  }
  return with0x?"0x"+output:output;
}


export { base64ToHex, base64ToBytes32, hexToBase64, bytes32ToHex }
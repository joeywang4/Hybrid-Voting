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
  let i = 0;
  for(;i < Math.floor(hexData.length/64);i++) {
    ret.push("0x"+hexData.substring(i*64, (i+1)*64>hexData.length?hexData.length:(i+1)*64));
  }
  if(i*64 < hexData.length) {
    ret.push("0x"+"0".repeat((i+1)*64 - hexData.length)+hexData.substring(i*64));
  }
  return ret;
}

function hexToBase64(_str) {
  if(_str.substring(0, 2) === "0x") _str = _str.substring(2);
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
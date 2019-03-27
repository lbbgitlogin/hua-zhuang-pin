const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}
const createString = function(arr) {
  let s = '';
  let a = [];
  for (let i = 0; i < arr.length; i++) {
    a.push(arr[i]);
  }
  a.sort();
  for (let i = 0; i < a.length; i++) {
    s += a[i];
    if (i != (a.length - 1)) {
      s += ',';
    }
  }
  return s;
}
const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}
const phoneVaild = size => {
  let rule = /^1[3456789]\d{9}$/;
  let res = {
    status: true,
    tip: '输入正确'
  }
  if (size == '') {
    res.status = false;
    res.tip = '手机号码不能为空！'
    return res;
  }
  if (size.length < 11) {
    res.status = false;
    res.tip = '手机号码格式错误！'
    return res;
  }
  if (!rule.test(size)) {
    res.status = false;
    res.tip = '手机号码格式错误！'
    return res;
  }
  return res;
}

const removeArr = function (array, index) {
  if (index <= (array.length - 1)) {
    for (var i = index; i < array.length; i++) {
      array[i] = array[i + 1];
    }
  }
  else {
    throw new Error('超出最大索引！');
  }
  array.length = array.length - 1;
  return array;
}
 // 获取当前时间 格式yyyy-MM-dd HH:MM:SS
const TransferData = function (timestamp, pattern = '.') {
  // var date = new Date();
  var date = new Date(timestamp * 1000);
  var seperator1 = pattern;
  var seperator2 = ":";
  var month = date.getMonth() + 1;
  var strDate = date.getDate();
  var hour = date.getHours();
  var min = date.getMinutes();
  var second = date.getSeconds();
  if (month >= 1 && month <= 9) {
    month = "0" + month;
  }
  if (strDate >= 0 && strDate <= 9) {
    strDate = "0" + strDate;
  }
  if (hour >= 0 && hour <= 9) {
    hour = "0" + hour;
  }
  if (min >= 0 && min <= 9) {
    min = "0" + min;
  }
  if (second >= 0 && second <= 9) {
    second = "0" + second;
  }
  var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate
    + " " + hour + seperator2 + min;
  return currentdate;
}
// 获取当前时间 格式yyyy-MM-dd HH:MM:SS
const TransferData1 = function (timestamp, pattern = '-') {
  // var date = new Date();
  var date = new Date(timestamp);
  var seperator1 = pattern;
  var seperator2 = ":";
  var month = date.getMonth() + 1;
  var strDate = date.getDate();
  var hour = date.getHours();
  var min = date.getMinutes();
  var second = date.getSeconds();
  if (month >= 1 && month <= 9) {
    month = "0" + month;
  }
  if (strDate >= 0 && strDate <= 9) {
    strDate = "0" + strDate;
  }
  var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate;
  return currentdate;
}
const slipImg = function(str){
  let arr = [];
  str.replace(/<img [^>]*src=['"]([^'"]+)[^>]*>/gi, function (match, capture) {
    arr.push(capture);
  });
  return arr;
}
const toPrice = function(n){
  // return (n/100).toFixed(2)
  return (n / 100);
}
// 获取当前时间 格式yyyy年MM月dd日 HH:MM:SS
const TransferDataFormat = function (time, parmas='1') {
  var date = new Date(time.replace(new RegExp(/-/gm), "/"))
  // var date = new Date(time);

  var month = date.getMonth() + 1;
  var strDate = date.getDate();
  var hour = date.getHours();
  var min = date.getMinutes();
  var second = date.getSeconds();
  if (month >= 1 && month <= 9) {
    month = "0" + month;
  }
  if (strDate >= 0 && strDate <= 9) {
    strDate = "0" + strDate;
  }
  // if (hour >= 0 && hour <= 9) {
  //   hour = "0" + hour;
  // }
  // if (min >= 0 && min <= 9) {
  //   min = "0" + min;
  // }
  // if (second >= 0 && second <= 9) {
  //   second = "0" + second;
  // }
  var currentdate = '';
  if (parmas == '1'){
    currentdate = date.getFullYear() + '年' + month + '月' + strDate
    + "日";
  }else {
    currentdate = date.getFullYear() + '.' + month + '.' + strDate;
  }
  return currentdate;
}

const findSIndex = function find(str, cha, num) {
  var x = str.indexOf(cha);
  for (var i = 0; i < num; i++) {
    x = str.indexOf(cha, x + 1);
  }
  return x;
}
module.exports = {
  formatTime: formatTime,
  phoneVaild: phoneVaild,
  removeArr: removeArr,
  TransferData: TransferData,
  TransferData1: TransferData1,
  slipImg: slipImg,
  toPrice: toPrice,
  TransferDataFormat: TransferDataFormat,
  createString: createString,
  findSIndex: findSIndex
}

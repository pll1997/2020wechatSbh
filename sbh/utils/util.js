let app = null;
const md5 = require("./md5.js");
const CryptoJS = require('./tripledes.js');
/**
 * 将时间搓转字符串
 * @param {*} date 
 */
const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()
  // + ' ' + [hour, minute, second].map(formatNumber).join(':')
  return [year, month, day].map(formatNumber).join('-');
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

/**
 * 将输入内容转为utf8字符串
 * @param {*} inputStr 
 */
function chat2utf8(inputStr) {
  var outputStr = "";
  for (var i = 0; i < inputStr.length; i++) {
    var temp = inputStr.charCodeAt(i);
    if (temp < 128) {
      outputStr += String.fromCharCode(temp);
    } else if (temp < 2048) {
      outputStr += String.fromCharCode((temp >> 6) | 192);
      outputStr += String.fromCharCode((temp & 63) | 128);
    } else if (temp < 65536) {
      outputStr += String.fromCharCode((temp >> 12) | 224);
      outputStr += String.fromCharCode(((temp >> 6) & 63) | 128);
      outputStr += String.fromCharCode((temp & 63) | 128);
    } else {
      outputStr += String.fromCharCode((temp >> 18) | 240);
      outputStr += String.fromCharCode(((temp >> 12) & 63) | 128);
      outputStr += String.fromCharCode(((temp >> 6) & 63) | 128);
      outputStr += String.fromCharCode((temp & 63) | 128);
    }
  }
  return outputStr;
}

/**
 * 对数据进行签名
 * @param {*} p 需要签名的数据,JSON或Array格式
 */
const signData = p => {
  //对参数进行排序
  var res = Object.keys(p).sort(),
    str = "";
  for (var key in res) {
    var index = res[key],
      item = p[res[key]];
    str += index + "=" + item + "&";
  }
  return md5.md5(chat2utf8(str.replace(/&$/, "")));
}

/**
 * 计算二次加密密码
 * @param {*} device 设备信息
 */
function getdynamicPassword(device) {
  return signData(device).substring(8, 16);
}

/**
 * 组装客户端数据
 * @param {*} token 登录后的token,此token为服务器返回的token,非微信token
 */
function initClient() {
  let datetime = new Date();
  let timestamp = (datetime.getTime() / 1000).toFixed(0);
  return {
    platform: app.globalData.systeminfo.platform + " " + app.globalData.systeminfo.version,
    version: "1.0",
    timestamp: timestamp,
    meid: app.globalData.wxuuid,
    token: wx.getStorageSync('token'),
    os: app.globalData.systeminfo.system,
    phone: app.globalData.systeminfo.brand + " " + app.globalData.systeminfo.model,
    lang: app.globalData.systeminfo.language,
    appid: wx.getAccountInfoSync().miniProgram.appId
  }
}

/**
 *  客户端加密函数
 * @param {*} str 需要加密的字符串
 * @param {*} password 加密密码
 */
function encrypt(str, password) {
  return CryptoJS.DES.encrypt(str, password, {
    iv: password,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7
  }).ciphertext.toString(CryptoJS.enc.Base64);
}

/**
 *  客户端解密函数
 * @param {*} str 密文字符串
 * @param {*} password 解密密码
 */
function decrypt(str, password) {
  return CryptoJS.DES.decrypt({
    ciphertext: CryptoJS.enc.Base64.parse(str)
  }, password, {
    iv: password,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7
  }).toString(CryptoJS.enc.Utf8);
}

function setApp(Wxapp) {
  if (null == app)
    app = Wxapp;
}

/**
 *  检查token是否有效 发送请求
 * @param {*} uri 服务器相对于根目录的地址,需要以斜杠"/"开始
 * @param {*} apiversion 服务器接口版本 v1
 * @param {*} post 请求的内容,JSON格式
 * @param {*} success 成功回调函数,判断成功失败依据为服务端返回码,返回码为0时为成功
 * @param {*} error 失败回调函数,若发生异常,如服务器内部错误,网络错误时回调函数,在返回码为非0时也会调用此函数
 * @param {*} complate 请求完成回调函数,不管成功失败,均会执行此函数
 */
function checkLoginAndRequest(uri, apiversion, post, success, error, complate) {
  app.checkLogin(
    function () {
      request(uri, apiversion, post, success, error, complate);
    });
}

/**
 *  向后端服务器发起请求
 * @param {*} uri 服务器相对于根目录的地址,需要以斜杠"/"开始
 * @param {*} apiversion 服务器接口版本
 * @param {*} post 请求的内容,JSON格式
 * @param {*} success 成功回调函数,判断成功失败依据为服务端返回码,返回码为0时为成功
 * @param {*} error 失败回调函数,若发生异常,如服务器内部错误,网络错误时回调函数,在返回码为非0时也会调用此函数
 * @param {*} complate 请求完成回调函数,不管成功失败,均会执行此函数
 */
function request(uri, apiversion, post, success, error, complate) {
  /*初始化客户端信息*/
  let device = initClient();
  // console.log(device);
  /*获取动态密码*/
  let dynamicpass = CryptoJS.enc.Utf8.parse(getdynamicPassword(device));
  /*请求加密报文 */
  let encrypted = "";
  if (post) {
    /*对请求数据进行加密*/
    encrypted = encrypt(JSON.stringify(post), dynamicpass);
  }
  /*获取外层固定加密密码*/
  let encryptPassword = CryptoJS.enc.Utf8.parse(app.globalData.encryptPassword);
  /*加密后的接口参数回填*/
  device.param = encrypted;
  /*对请求数据进行签名*/
  device.sign = signData(device);
  /*对请求数据进行外壳加密 */
  let postData = encrypt(JSON.stringify(device), encryptPassword);
  /*使用微信小程序发起网络请求*/
  wx.request({
    url: app.parseUrl(uri, apiversion),
    data: {
      requestData: postData
    },
    header: {
      "content-type": "application/x-www-form-urlencoded"
    },
    method: "POST",
    timeout: 1000 * 10,
    success: function (res) {
      if (200 != res.statusCode) {
        wx.showToast({
          icon: "none",
          duration: 2000,
          title: '服务器状态错误',
        });
        return
      }
      /*对返回结果进行外壳解密*/
      let response = decrypt(res.data, encryptPassword);
      /*对解密结果进行JSON格式化*/
      response = JSON.parse(response);
      console.log(response);
      /*验证服务端签名*/
      if ("rtnCode" in response == true) {
        /*判断签名是否正确*/
        let resign = response.sign;
        /* 移除签名字段 */
        delete response.sign;
        /*本地计算签名*/
        let locsign = signData(response);
        /*进行签名比对*/
        if (locsign == resign) {
          /*解析实际数据*/
          if (0 == response.rtnCode) {
            /*解密返回数据*/
            let result = decrypt(response.result, dynamicpass);
            result = JSON.parse(result);
            if (success && "function" == typeof success)
              success(result);
          } else if (100102 == response.rtnCode) {
            // 登录已失效,重新登录
            app.getToken(
              function () {
                request(uri, apiversion, post, success, error, complate);
              });
          } else if (100107 == response.rtnCode) {
            // 用户已在其他设备登录,重新登录;
            app.getUserInfo(
              function () {
                request(uri, apiversion, post, success, error, complate);
              });
          } else if (100100 == response.rtnCode) {
            // 获取用户openid失败"
            wx.showToast({
              title: response.rtnMsg,
              icon: 'none',
              duration: 2000
            });
            return;
          } else {
            if (error && "function" == typeof error) {
              error.apply(this, [response]);
            }
          }
        } else {
          if (error && "function" == typeof error) {
            error.call(this, {
              rtnCode: 1009001,
              rtnMsg: "签名验证失败"
            });
          }
        }
      } else {
        if (error && "function" == typeof error)
          error.call(this, {
            rtnCode: 100901,
            rtnMsg: "解析返回结果失败"
          });
      }
    },
    fail: function (res) {
      if (error && "function" == typeof error) {
        error.call(this, {
          rtnCode: 0,
          rtnMsg: "网络异常"
        });
      }
    },
    complete: function (res) {
      if (uri != "/shop/api/basic") {
        setTimeout(function () {
          wx.hideLoading();
        }, 2000)
      }
    }
  });
}

/**
 * 上传文件
 * @param {*} uri 
 * @param {*} apiversion 
 * @param {*} file 
 * @param {*} post 
 * @param {*} success 
 * @param {*} error 
 * @param {*} complate 
 */
function uploadFile(uri, apiversion, file, post, success, error, filekey) {
  /*初始化客户端信息*/
  let device = initClient();
  // console.log(device);
  /*获取动态密码*/
  let dynamicpass = CryptoJS.enc.Utf8.parse(getdynamicPassword(device));
  /*请求加密报文 */
  let encrypted = "";
  if (post) {
    /*对请求数据进行加密*/
    encrypted = encrypt(JSON.stringify(post), dynamicpass);
  }
  /*获取外层固定加密密码*/
  let encryptPassword = CryptoJS.enc.Utf8.parse(app.globalData.encryptPassword);
  /*加密后的接口参数回填*/
  device.param = encrypted;
  /*对请求数据进行签名*/
  device.sign = signData(device);
  /*对请求数据进行外壳加密 */
  let postData = encrypt(JSON.stringify(device), encryptPassword);
  /*使用微信小程序发起网络请求*/
  wx.uploadFile({
    url: app.parseUrl(uri, apiversion),
    filePath: file,
    name: "file",
    formData: {
      requestData: postData
    },
    header: {
      "Content-Type": "multipart/form-data",
    },
    method: "POST",
    //timeout: 1000 * 10,
    success: function (res) {
      /*对返回结果进行外壳解密*/
      let response = decrypt(res.data, encryptPassword);
      /*对解密结果进行JSON格式化*/
      response = JSON.parse(response);
      console.log(response)
      /*验证服务端签名*/
      if ("rtnCode" in response == true) {
        /*判断签名是否正确*/
        let resign = response.sign;
        /* 移除签名字段 */
        delete response.sign;
        /*本地计算签名*/
        let locsign = signData(response);
        /*进行签名比对*/
        if (locsign == resign) {
          /*解析实际数据*/
          if (0 == response.rtnCode) {
            /*解密返回数据*/
            let result = decrypt(response.result, dynamicpass);
            result = JSON.parse(result);
            if (success && "function" == typeof success)
              success(result);
          } else if (100102 == response.rtnCode) {
            // 登录已失效,重新登录
            app.getToken(
              function () {
                request(uri, apiversion, post, success, error, complate);
              });
          } else {
            if (error && "function" == typeof error) {
              error.apply(this, [response]);
            }
          }
        } else {
          if (error && "function" == typeof error) {
            error.call(this, {
              rtnCode: 1009001,
              rtnMsg: "签名验证失败"
            });
          }
        }
      } else {
        if (error && "function" == typeof error)
          error.call(this, {
            rtnCode: 100901,
            rtnMsg: "解析返回结果失败"
          });
      }
    },
    fail: function (res) {
      if (error && "function" == typeof error) {
        error.call(this, {
          rtnCode: 0,
          rtnMsg: "网络异常"
        });
      }
    },
    complete: function (res) {
      setTimeout(() => {
        wx.hideLoading();
      }, 2000);
    }
  });
}

/**
 * 姓名替换方法封装(刘**)
 * @param {*} name 
 */
function formatName(name) {
  var newStr = "";
  if (name.length === 2) {
    newStr = name.substring(0, 1) + '*';
  } else if (name.length > 2) {
    var char = '*';
    newStr = name.substring(0, 1) + char + name.charAt(name.length - 1);
  } else {
    newStr = name;
  }
  return newStr;
};

/**
 * 电话替换方法 手机号码中间四位显示为*号 
 * @param {*} array 
 */
function formatPhone(array) {
  var phone = array.substring(0, 3) + '****' + array.substring(7);
  return phone;
}

function Rad(d) {
  //根据经纬度判断距离
  return d * Math.PI / 180.0;
}
/**
 * 计算距离函数
 * @param {*} lat1  用户的纬度
 * @param {*} lng1  用户的经度
 * @param {*} lat2  商家的纬度
 * @param {*} lng2  商家的经度
 */
function getDistance(lat1, lng1, lat2, lng2) {
  var radLat1 = Rad(lat1);
  var radLat2 = Rad(lat2);
  var a = radLat1 - radLat2;
  var b = Rad(lng1) - Rad(lng2);
  var s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a / 2), 2) + Math.cos(radLat1) * Math.cos(radLat2) * Math.pow(Math.sin(b / 2), 2)));
  s = s * 6378.137;
  s = Math.round(s * 10000) / 10000;
  s = s.toFixed(1) //保留两位小数 + 'km'
  // console.log('经纬度计算的距离:' + s)
  return s
}

/**
 * 腾讯转百度
 * @param {*} lng 
 * @param {*} lat 
 */
function qqMapTransBMap(lng, lat) {
  let x_pi = 3.14159265358979324 * 3000.0 / 180.0;
  let x = lng;
  let y = lat;
  let z = Math.sqrt(x * x + y * y) + 0.00002 * Math.sin(y * x_pi);
  let theta = Math.atan2(y, x) + 0.000003 * Math.cos(x * x_pi);
  let lngs = z * Math.cos(theta) + 0.0065;
  let lats = z * Math.sin(theta) + 0.006;
  return {
    lng: lngs,
    lat: lats
  };
}

/**
 * 百度转腾讯 
 * @param {*} lng 
 * @param {*} lat 
 */
function BMapTransqqMap(lng, lat) {
  let x_pi = 3.14159265358979324 * 3000.0 / 180.0;
  let x = lng - 0.0065;
  let y = lat - 0.006;
  let z = Math.sqrt(x * x + y * y) + 0.00002 * Math.sin(y * x_pi);
  let theta = Math.atan2(y, x) + 0.000003 * Math.cos(x * x_pi);
  let lngs = z * Math.cos(theta);
  let lats = z * Math.sin(theta);
  return {
    lng: lngs,
    lat: lats
  };
}

/**
 * 数组排列
 * @param {*} attr  数组数据
 * @param {*} rev   排列方式 参数没有传递 默认升序排列
 */
function sortFun(attr, rev) {
  if (rev == undefined) {
    rev = 1;
  } else {
    rev = (rev) ? 1 : -1;
  }
  return function (a, b) {
    a = a[attr];
    b = b[attr];
    if (a < b) {
      return rev * -1;
    }
    if (a > b) {
      return rev * 1;
    }
    return 0;
  }
}

/**
 * 防止多次点击函数触发多次（函数节流)
 * @param {*} func 
 * @param {*} marginTime 
 */
function throttleFunc(func, marginTime) {
  if (marginTime == undefined || marginTime == null) {
    marginTime = 1700
  }
  let lastTime = null
  return function () {
    let currentTime = +new Date()
    if (currentTime - lastTime > marginTime || !lastTime) {
      func.apply(this, arguments)
      lastTime = currentTime
    }
  }
};

/**
 * 数值转换(分转元)
 * @param {*} number 
 */
function toFix(number) {
  var str = (number / 100).toFixed(2) + '';
  var intSum = str.substring(0, str.indexOf(".")).replace(/\B(?=(?:\d{3})+$)/g, ','); //取到整数部bai分du
  var dot = str.substring(str.length, str.indexOf(".")) //取到小zhi数部分
  // detailData.reduce_amount = intSum + dot;
  return intSum + dot;
}

/**
 * 验证手机号
 * @param {*} phoneMobile 
 */
function yzphone(phoneMobile) {
  if (phoneMobile == '') {
    wx.showToast({
      title: '手机号不能为空',
      icon: 'none',
      duration: 3000
    });
    return false;
  }
  var myreg = /^(((13[0-9]{1})|(14[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(17[0-9]{1}))+\d{8})$/;
  if (phoneMobile.length === 0) {
    wx.showToast({
      title: '输入的手机号为空',
      icon: 'none',
      duration: 3000
    });
    return false;
  } else if (phoneMobile.length < 11) {
    wx.showToast({
      title: '手机号长度有误！',
      icon: 'none',
      duration: 3000
    });
    return false;
  } else if (!myreg.test(phoneMobile) || phoneMobile == undefined) {
    wx.showToast({
      title: '手机号有误！',
      icon: 'none',
      duration: 3000
    });
    return false;
  } else {
    return true;
  }
};

/**
 * 向外部暴露接口
 */
module.exports = {
  formatTime: formatTime,
  request: request,
  setApp: setApp,
  initClient: initClient,
  checkLoginAndRequest: checkLoginAndRequest,
  formatName: formatName,
  formatPhone: formatPhone,
  uploadFile: uploadFile,
  getDistance: getDistance, // 根据经纬度计算距离
  qqMapTransBMap: qqMapTransBMap,
  BMapTransqqMap: BMapTransqqMap,
  sortFun: sortFun,
  throttleFunc: throttleFunc,
  toFix: toFix,
  yzphone: yzphone
}
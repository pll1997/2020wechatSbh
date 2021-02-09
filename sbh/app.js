const util = require("./utils/util.js");
var backFun='';
var ys='https://ksjfp.ksj.52api.net/';  //演示
var kf='https://cj.ksj.52api.net/';     //开发
App({
  /**
   *  全局数据保存对象
   * */
  globalData: {
    BASEURL:ys,  
    userInfo: null,
    token: "",
    memberinfo: null,
    systeminfo: null,
    encryptPassword: "gyyjxffp",
    wxuuid: "",
    apiversion: "v1",
    github:'https://raw.githubusercontent.com/',
    share: false,  // 分享默认为false
    navheight: 0,
    windowHeight:'',
  },
  onShow:function(options){
    if(options.scene=='1037'){
      this.globalData.token = options.referrerInfo.extraData.token;
      wx.setStorageSync('token', options.referrerInfo.extraData.token);
      wx.setStorageSync('refresh_token',options.referrerInfo.extraData.refresh_token);
      wx.setStorageSync('createTime',options.referrerInfo.extraData.createTime);
      wx.setStorageSync('expired',options.referrerInfo.extraData.expired);
    }else{
    }
  },
  onLaunch: function (options) {
    // 小程序版本检测更新
    this.autoUpdate();
    this.navbar(options);
   
  },
  /*自定义头部的公共传参 */
  nvabarData:function(that,showCapsule,title,centent,navback){
    // 组件所需的参数
   var nvabarData={
      showCapsule: showCapsule, //是否显示左上角图标   1表示显示    0表示不显示
      title: title, //导航栏 中间的标题
      centent:centent,//控制是带返回的标题还是自定义的搜索之类 title custom
      navback:navback //左边显示返回按钮还是其它图案，如（扫一扫图标）backicon custom
    };
    that.setData({
      nvabarData:nvabarData
    });
  },
  /**自定义头部 */
  navbar:function(options){
    // 判断是否由分享进入小程序
    if (options.scene == 1007 || options.scene == 1008) {
      this.globalData.share = true
    } else {
      this.globalData.share = false
    };
    //获取设备顶部窗口的高度（不同设备窗口高度不一样，根据这个来设置自定义导航栏的高度）
    wx.getSystemInfo({
      success: (res) => {
        this.globalData.navheight = res.statusBarHeight+46;
        this.globalData.windowHeight=res.windowHeight-this.globalData.navheight;
      }
    });
    
  },
  /**
   * 版本更新
   */
  autoUpdate:function(){
    var self=this
    // 获取小程序更新机制兼容
    if (wx.canIUse('getUpdateManager')) {
      const updateManager = wx.getUpdateManager()
      //1. 检查小程序是否有新版本发布
      updateManager.onCheckForUpdate(function (res) {
        // 请求完新版本信息的回调
        if (res.hasUpdate) {
          //2. 小程序有新版本，则静默下载新版本，做好更新准备
          updateManager.onUpdateReady(function () {
            console.log(new Date())
            wx.showModal({
              title: '更新提示',
              content: '新版本已经准备好，是否重启应用？',
              success: function (res) {
                if (res.confirm) {
                  //3. 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
                  updateManager.applyUpdate()
                } else if (res.cancel) {
                  //如果需要强制更新，则给出二次弹窗，如果不需要，则这里的代码都可以删掉了
                  wx.showModal({
                    title: '温馨提示~',
                    content: '本次版本更新涉及到新的功能添加，旧版本无法正常访问的哦~',
                    success: function (res) {     
                      self.autoUpdate()
                      return;                 
                    }
                  })
                }
              }
            })
          })
          updateManager.onUpdateFailed(function () {
            // 新的版本下载失败
            wx.showModal({
              title: '已经有新版本了哟~',
              content: '新版本已经上线啦~，请您删除当前小程序，重新搜索打开哟~',
            })
          })
        }
      })
    } else {
      // 如果希望用户在最新版本的客户端上体验您的小程序，可以这样子提示
      wx.showModal({
        title: '提示',
        content: '当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。'
      })
    }
  },
  /**
   * 获取openid 
   * @param {*} backfun 
   */
  getUserInfo: function (backfun) {
    backFun=backfun;
    var t = this;
    wx.login({
      success: function (o) {
        var n = o.code;
        var postData = {
          code: n,
          tbl:"member",
          callback:""
        };
        // 获取用户openid
        util.request('/member/wxapi/jscode2session', t.globalData.apiversion, postData, t.successFun, function (res) {
          console.log('失败接口：',res);
          if (res.rtnCode == '100101') {
            wx.setStorageSync('openid', res.rtnMsg);
            setTimeout(() => {
              var pages = getCurrentPages(); //获取加载的页面
              var currentPage = pages[pages.length-1]; //获取当前页面的对象
              var url = currentPage.route; //当前页面url
              if(url !='pages/login/login'){
                wx.reLaunch({
                  url: '/pages/login/login',
                })
              }
            }, 1000);
            return;
          }
        });
      }
    });
  },
  // 获取openid的成功回调
  successFun: function (res) {
    console.log(wx.getStorageSync('token')+"*********")
    backFun;
    wx.showToast({icon: 'success', title: '登录成功', duration: 3000})
    //将token存到本地存储中
    wx.setStorageSync('token', res.token);
    this.setToken(res.token);
    //将uid存到本地存储中
    wx.setStorageSync('uid', res.uid);
    //将当前时间存到本地存储
    let createTime = new Date().getTime();
    wx.setStorageSync('createTime', createTime);
    //将token有效时间存到本地存储;
    wx.setStorageSync('expired', res.expired);
    //将刷新token字段存到本地存储;
    wx.setStorageSync('refresh_token', res.refresh_token);
    let pages = getCurrentPages(); //获取加载的页面
    let currentPage = pages[pages.length - 1]; //获取当前页面的对象
    let url = currentPage.route; //当前页面url
    var t = this;
    setTimeout(function(){
      wx.reLaunch({
        url: '/pages/tabBar/index/index',
      })
    },2000);
  },
  setMember: function (memberinfo) {
    this.globalData.memberinfo = memberinfo;
    if (this.userMemberReadyCallback) {
      this.userMemberReadyCallback(member);
    }
  },
  /**
   * 保存token
   * @param {*} token 
   */
  setToken: function (token) {
    this.globalData.token = token;
    if (this.userMemberReadyCallback) {
      this.userTokenReadyCallback(token);
    }
  },
  /**
   * 规范化向后端服务器请求的url
   * @param {*} uri 
   */
  parseUrl: function (uri, apiversion) {
    if (!apiversion) apiversion = "v1";
    return this.globalData.BASEURL + uri.replace(/^\/*/, "/") + "?api=" + apiversion;
  },
  /**
   *  检查token是否过期
   *  @param {*} backfun 
   */
  checkLogin: function (backfun) {
    var t = this;
    let time = new Date().getTime();
    let createTime = wx.getStorageSync('createTime');
    let token = wx.getStorageSync('token');
    let expired = wx.getStorageSync('expired');
    let refresh_token=wx.getStorageSync('refresh_token');
    wx.hideLoading();
      if (!token) {
        // 不存在token，调用登录
        if(!refresh_token){
          if(backfun=='my'){
            console.log('// 不存在token，调用登录');
            t.getSetting(t, t.getUserInfo())
          }
          else{
            t.getSetting(t, 'nothat')
          }
          return;
        }
      } else if ((time - createTime) > (expired / 2) * 1000) {
        // token失效,调用接口重新请求token
        console.log('token 过期了');
        t.getToken(backfun);
      } 
      else {
        // token有效，不做操作
        backfun();
      }
  },
  /**
   * 查看是否授权
   * @param {*} that 
   * @param {*} backfun 
   */
  getSetting:function(that,backfun){
    wx.getSetting({
      success: function(res) {
        if (res.authSetting['scope.userInfo']) {
          if (wx.getStorageSync('token') == "" || wx.getStorageSync('token') == undefined) {
            //未登录，需要登陆
            if(backfun=='my'){
              //用户跳转授权页面
               wx.reLaunch({  url: '/pages/author/author',})
            }else{
              that.setData({
                  nodata:'未登录，需要登陆才能查看与操作哦~'
              })
            }
            return;
          }
          else{
            //已登陆，调用本页面方法
            backfun;
            return;
          }
        } else {
          
          //用户没有授权
          if(backfun=='myjs'){
            wx.showToast({ title: '需登陆才可相应操作~', icon: 'none', duration: 3000,});
          }else if(backfun=='my'){
            //用户未授权跳转授权页面
             wx.reLaunch({  url: '/pages/author/author',})
          }else{
            if(backfun=='nothat'){ }
            else{
              console.log('demo:未登录，需要登陆才能查看与操作哦');
              that.setData({
                  nodata:'未登录，需要登陆才能查看与操作哦~'
              })
            }
            
          }
          return;
        }
      }
    });
  },
  /**
   * 获取token
   * @param {*} backfun 
   */
  getToken: function (backfun) {
    var t = this;
    wx.removeStorageSync('token');
    let refresh_token = wx.getStorageSync("refresh_token");
    console.log('refresh_token:',refresh_token);
    util.request('/shop/api/refreshtoken', t.globalData.apiversion, 
    {
      refresh_token: refresh_token
    }, function (res) {
      //将token存到本地存储中
      wx.setStorageSync('token', res.token);
      //将uid存到本地存储中
      wx.setStorageSync('uid', res.uid);
      //将当前时间存到本地存储
      let createTime = new Date();
      wx.setStorageSync('createTime', createTime);
      //将token有效时间存到本地存储;
      wx.setStorageSync('expired', res.expired);
      wx.setStorageSync('refresh_token', res.refresh_token);
      backfun();
    }, function (res) {
      if (res.rtnCode == 1) {
        return;
      } else {
        t.getToken(backfun);
      }
    })
  },
  /**
   * 封装全局返回上一页 
   * @param {*} 
   */
  back: function () {
    wx.navigateBack({
      delta: 1, //返回上一个页面
    })
  },
  /**
   * 封装全局的提示框
   * @param {*} title 
   */
  showToast:function(title){
    wx.showToast({
      title: title,
      icon: 'none',
      duration:3000
    })
  },
  getUtil: function () {
    return util;
  },
})
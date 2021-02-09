const app = getApp();
Component({
  properties: {
    navbarData: {   //navbarData   由父页面传递的数据，变量名字自命名
      type: Object,
      value: {},
      observer: function (newVal, oldVal,cententval,navback) {
      }
    }
  },
  data: {
    navheight: '',
    //默认值  默认显示左上角
    navbarData: {
      showCapsule: 1,
    },
    github:app.globalData.github,
    github_token:app.globalData.github_token,
  },
  attached: function () {
    // 获取是否是通过分享进入的小程序
    this.setData({
      share: app.globalData.share
    })
    // 定义导航栏的高度   方便对齐
    this.setData({
      navheight: app.globalData.navheight
    })
    // console.log('navbarData:',this.data.navbarData);
  },
  methods: {
    // 返回上一页面
    _navback(event) {
      // 当前页面为“成长记录”时，对返回按钮进行劫持，直接跳转到首页
      if(this.data.navbarData.title === '成长记录'){
        console.log(this.data.navbarData.title);
        wx.switchTab({
          url: '/pages/tabBar/index/index',
          success: function (e) { 
            var page = getCurrentPages().pop(); 
            if (page == undefined || page == null) return; 
            page.onLoad(); 
          }
        })
        return ;
      }
      wx.navigateBack()
    },
  }
})


// pages/tabBar/personal/personal.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list:[],
    github:app.globalData.github,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //顶部文字颜色
    wx.setNavigationBarColor({
      frontColor: '#ffffff', // 必写项
      backgroundColor: '#febc34', // 传递的颜色值
    })
    this.interactive();
  },
  
  interactive:function(e){
    var that=this;
    const list=[
      {src:that.data.github+'pll1997/2020wechatSbh/master/img/my/my_sxuzhi@3x.png',text:'参会通知',url:'',show:true}
      ,{src:that.data.github+'pll1997/2020wechatSbh/master/img/my/my_idcard@3x.png',text:'我的名片夹',url:'', show:true}
      ,{src:that.data.github+'pll1997/2020wechatSbh/master/img/my/my_collect@3x.png',text:'我的收藏',url:'',show:true}
      ,{src:that.data.github+'pll1997/2020wechatSbh/master/img/my/my_jiabin@3x.png',text:'关联嘉宾',url:'',show:true}
      ,{src:that.data.github+'pll1997/2020wechatSbh/master/img/my/my_safe@3x.png',text:'账号安全',url:'',show:true}
      ,{src:that.data.github+'pll1997/2020wechatSbh/master/img/my/my_erweima@3x.png',text:'我的二维码',url:'',show:true}
      ,{src:that.data.github+'pll1997/2020wechatSbh/master/img/my/my_piao@3x.png',text:'我的订单',url:'',show:true}
      ,{src:that.data.github+'pll1997/2020wechatSbh/master/img/my/my_shopping@3x.png',text:'我的购物车',url:'',show:true}
      ,{src:that.data.github+'pll1997/2020wechatSbh/master/img/my/my_guizhou@3x.png',text:'贵州风采',url:'',mt:50, show:true}
      ,{src:that.data.github+'pll1997/2020wechatSbh/master/img/my/my_hangban@3x.png',text:'航班管家',url:'',show:true}
      ,{src:that.data.github+'pll1997/2020wechatSbh/master/img/my/my_liuyan@3x.png',text:'我要留言',url:'',show:true}
      ,{src:that.data.github+'pll1997/2020wechatSbh/master/img/my/my_about@3x.png',text:'关于我们',url:'',show:true}
    ];
    
    that.setData({
      list:list
    });
  },

   
})
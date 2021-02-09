// pages/tabBar/guanmodian/guanmodian.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    height: app.globalData.navheight+1, // 此页面 页面内容距最顶部的距离
    github:app.globalData.github,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    app.nvabarData(this,'1','观摩点','title','');
    this.xwlist();
  },
  xwlist:function(){
   let xwlist=[
     {
       img:'pll1997/2020wechatSbh/master/img/default/myzhanwei.png',
       tlt:'我是标题我是标题我是标题我是标题我是标题',
       janj:'我是简介2行我是简介',
     },
     {
       img:'pll1997/2020wechatSbh/master/img/default/myzhanwei.png',
       tlt:'我是标题我是标题我是标题我是标题我是标题',
       janj:'我是简介2行我是简介2行我是简介2行我是简介2行我是简介2行我是简介2行我是简介2行我是简介2行',
     },
     {
       img:'pll1997/2020wechatSbh/master/img/default/myzhanwei.png',
       tlt:'我是标题我是标题我是标题我是标题我是标题',
       janj:'我是简介2行我是简介2行我是简介2行我是简介2行我是简介2行我是简介2行我是简介2行我是简介2行',
     },
     {
      img:'pll1997/2020wechatSbh/master/img/default/myzhanwei.png',
      tlt:'我是标题我是标题我是标题我是标题我是标题',
      janj:'我是简介2行我是简介',
    },
    {
      img:'pll1997/2020wechatSbh/master/img/default/myzhanwei.png',
      tlt:'我是标题我是标题我是标题我是标题我是标题',
      janj:'我是简介2行我是简介2行我是简介2行我是简介2行我是简介2行我是简介2行我是简介2行我是简介2行',
    },
    {
      img:'pll1997/2020wechatSbh/master/img/default/myzhanwei.png',
      tlt:'我是标题我是标题我是标题我是标题我是标题',
      janj:'我是简介2行我是简介2行我是简介2行我是简介2行我是简介2行我是简介2行我是简介2行我是简介2行',
    },
     
   ];
   this.setData({
     xwlist:xwlist
   });
  },
})
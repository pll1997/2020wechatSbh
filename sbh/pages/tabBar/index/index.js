const app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    height: app.globalData.navheight+1, // 此页面 页面内容距最顶部的距离
    github:app.globalData.github,
    banner: [],
    icon:'',
    videolist:[],
    xwlist:[],
    hidden:false
 },
 onLoad:function(option){
  app.nvabarData(this,'1','主页','title','custom');
  this.interactive();
 },
 interactive:function(){
  this.banner();
  this.icon();
  this.videolist();
  this.xwlist();
 },
 xwlist:function(){
  let xwlist=[
    {
      img:'pll1997/2020wechatSbh/master/img/default/myzhanwei.png',
      tlt:'我是标题我是标题我是标题我是标题我是标题',
      janj:'我是简介2行我是简介2行我是简介2行我是简介2行我是简介2行我是简介2行我是简介2行我是简介2行',
      time:'2020-2-4 19:12'
    },
    {
      img:'pll1997/2020wechatSbh/master/img/default/myzhanwei.png',
      tlt:'我是标题我是标题我是标题我是标题我是标题',
      janj:'我是简介2行我是简介2行我是简介2行我是简介2行我是简介2行我是简介2行我是简介2行我是简介2行',
      time:'2020-2-4 19:12'
    },
    {
      img:'pll1997/2020wechatSbh/master/img/default/myzhanwei.png',
      tlt:'我是标题我是标题我是标题我是标题我是标题',
      janj:'我是简介2行我是简介2行我是简介2行我是简介2行我是简介2行我是简介2行我是简介2行我是简介2行',
      time:'2020-2-4 19:12'
    },
    
  ];
  this.setData({
    xwlist:xwlist
  });
 },
 videolist:function(){
   let videolist=[
     {img:'pll1997/2020wechatSbh/master/img/my/my_bg@3x.png',tlt:'精工适量',gs:'贵州天眼公司'},
     {img:'pll1997/2020wechatSbh/master/img/my/my_bg@3x.png',tlt:'精工适量',gs:'贵州天眼公司'},
     {img:'pll1997/2020wechatSbh/master/img/my/my_bg@3x.png',tlt:'精工适量',gs:'贵州天眼公司'},
   ];
   this.setData({
    videolist:videolist
   });
 },
 banner:function(){
  var that = this;
  var banner = [
    {"url": 'pll1997/2020wechatSbh/master/img/my/my_bg@3x.png' },
    {"url": 'pll1997/2020wechatSbh/master/img/my/my_bg@3x.png' },
    {"url": 'pll1997/2020wechatSbh/master/img/my/my_bg@3x.png' }
  ];
  that.setData({ banner: banner})
 },
 icon:function(){
  var icon=[
    {'url':'pll1997/2020wechatSbh/master/img/home/home_time@3x.png',text:'日程'},
    {'url':'pll1997/2020wechatSbh/master/img/home/home_store@3x.png',text:'展商'},
    {'url':'pll1997/2020wechatSbh/master/img/home/home_chanpin@3x.png',text:'展品'},
    {'url':'pll1997/2020wechatSbh/master/img/home/home_zhanweitu@3x.png',text:'展位图'},
    {'url':'pll1997/2020wechatSbh/master/img/home/home_ticket@3x.png',text:'购票'},
    {'url':'pll1997/2020wechatSbh/master/img/home/home_card@3x.png',text:'名片强'},
    {'url':'pll1997/2020wechatSbh/master/img/home/home_shipin@3x.png',text:'视频'},
    {'url':'pll1997/2020wechatSbh/master/img/home/home_zhibo@3x.png',text:'直播'},
  ];
  this.setData({icon: icon});
 },
})
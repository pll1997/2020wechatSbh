// pages/tabBar/zanhui/zanhui.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    height: app.globalData.navheight+1, // 此页面 页面内容距最顶部的距离
    windowHeight:app.globalData.windowHeight-1,
    github:app.globalData.github,
    navbarTitle: [
      {tlt:"展商",id:'0'},
      {tlt:"展品",id:'1'},
    ],
    navbarActiveIndex: 0,
    list:[],
    zplist:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    app.nvabarData(this,'1','展会','title','');
    this.list();
    this.zplist();
  },
  list:function(){
    let list=[
      {src:'',name:'贵州盛安科技有限公司'},{src:'',name:'贵州盛安科技有限公司'},
      {src:'',name:'贵州盛安科技有限公司'},{src:'',name:'贵州盛安科技有限公司'},
      {src:'',name:'贵州盛安科技有限公司'},{src:'',name:'贵州盛安科技有限公司'},
      {src:'',name:'贵州盛安科技有限公司'},{src:'',name:'贵州盛安科技有限公司'},
      {src:'',name:'贵州盛安科技有限公司'},{src:'',name:'贵州盛安科技有限公司'},
      {src:'',name:'贵州盛安科技有限公司'},{src:'',name:'贵州盛安科技有限公司'},
    ];
    this.setData({
      list:list
    });
  },
  zplist:function(){
    let zplist=[
      {tlt:'大数据应用',jianj:'我是简介'},
      {tlt:'大数据应用',jianj:'我是简介'},
      {tlt:'大数据应用',jianj:'我是简我是简介我是简介介'},
    ];
    this.setData({
      zplist:zplist
    });
  },


  /**选项卡的滑动事件 */
  onBindAnimationFinish: function ({ detail}) {
    this.btn(detail.current);
  },
  /**选项卡点击事件*/
  onNavBarTap: function (event) {
    let navbarTapIndex = event.currentTarget.dataset.navbarIndex;
    this.btn(navbarTapIndex);
  },
  /**控制选项卡-滑动或被点击事件 */
  btn:function(Index){
    // 设置data属性中的navbarActiveIndex为当前点击的navbar
    this.setData({
      navbarActiveIndex: Index
    });
  }
})
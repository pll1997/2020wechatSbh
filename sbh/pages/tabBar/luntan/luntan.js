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
      {tlt:"论坛",id:'0'},
      {tlt:"嘉宾",id:'1'},
    ],
    navbarActiveIndex: 0,
    ltlist:[],
    option:{
      optiem:[],
      opdz:[],
      opzt:[],
    },
    selectedFlag: [false, false, false],
    tabindex:'',
    opindex: '-1', 
    tab:[{id:0,name:'时间'},{id:1,name:'地点'},{id:2,name:'主题'},],
    // 带有遮罩层的下拉菜单    
    letter:[],
    jblist:[],
    jbListId: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    app.nvabarData(this,'1','论坛','title','');
    this.ltlist();
    this.option();
    this.letter();
    this.jblist();
    
  },
  //点击字母
  letterTap(e) {
    const Item = e.currentTarget.dataset.item;
    this.setData({
      jbListId: Item
    });
  },
  jblist:function(){
    var jblist= [
     { letter: "A", data: [{ id:'',src:'',tlt:'爱娃'}] },
     { letter: "B", data: [{ id:'',src:'',tlt:'函数'}] },
     { letter: "C", data: [{ id:'',src:'',tlt:'爱娃'}] },
     { letter: "D", data: [{ id:'',src:'',tlt:'函数'}] },
     { letter: "E", data: [{ id:'',src:'',tlt:'爱娃'}] },
     { letter: "F", data: [{ id:'',src:'',tlt:'函数'}] },
     { letter: "G", data: [{ id:'',src:'',tlt:'爱娃'}] },
     { letter: "H", data: [{ id:'',src:'',tlt:'函数'}] },
     { letter: "I", data: [{ id:'',src:'',tlt:'爱娃'}] },
     { letter: "J", data: [{ id:'',src:'',tlt:'函数'}] },
     { letter: "K", data: [{ id:'',src:'',tlt:'爱娃'}] },
     { letter: "L", data: [{ id:'',src:'',tlt:'函数'}] },
     { letter: "M", data: [{ id:'',src:'',tlt:'函数'}] },
     { letter: "N", data: [{ id:'',src:'',tlt:'爱娃'}] },
     { letter: "O", data: [{ id:'',src:'',tlt:'函数'}] },
     { letter: "G", data: [{ id:'',src:'',tlt:'爱娃'}] },
     { letter: "P", data: [{ id:'',src:'',tlt:'函数'}] },
     { letter: "Q", data: [{ id:'',src:'',tlt:'爱娃'}] },
     { letter: "R", data: [{ id:'',src:'',tlt:'函数'}] },
     { letter: "S", data: [{ id:'',src:'',tlt:'爱娃'}] },
     { letter: "T", data: [{ id:'',src:'',tlt:'函数'}] },
     { letter: "U", data: [{ id:'',src:'',tlt:'函数'}] },
     { letter: "V", data: [{ id:'',src:'',tlt:'爱娃'}] },
     { letter: "W", data: [{ id:'',src:'',tlt:'函数'}] },
     { letter: "X", data: [{ id:'',src:'',tlt:'爱娃'}] },
     { letter: "Y", data: [{ id:'',src:'',tlt:'函数'}] },
     { letter: "Z", data: [{ id:'',src:'',tlt:'函数'}] },
    ];
   this.setData({
    jblist:jblist
   });
  },
  letter:function(e){
    let letter=["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"];
    this.setData({
      letter:letter
    });
  },
  tapoption:function(e){
    var that=this;
    var tabindex=e.currentTarget.dataset.tabindex;
    var index=e.currentTarget.dataset.index;
    var name=e.currentTarget.dataset.name;
    switch (tabindex) {
      case 0:
        that.setData({
          ['tab[0].name']:name
        });
        break;
      case 1:
        that.setData({
          ['tab[1].name']:name
        });
        break;
      case 2:
        that.setData({
          ['tab[2].name']:name
        });
        break;
    }
    this.setData({
      ['selectedFlag['+tabindex+']']:false,
      opindex:index
    });

  },
  // 时间等选项卡 -- 点击下拉显示框
  tab:function(e){
    var index=e.currentTarget.dataset.index;
    var id=e.currentTarget.dataset.id;
    if (this.data.selectedFlag[index]){
      this.data.selectedFlag[index] = false;
    }else{
      this.data.selectedFlag[index] = true;
    }
    switch (index) {
      case 0:
        this.data.selectedFlag[1] = false;
        this.data.selectedFlag[2] = false;
        break;
      case 1:
        this.data.selectedFlag[0] = false;
        this.data.selectedFlag[2] = false;
        break;
      case 2:
        this.data.selectedFlag[0] = false;
        this.data.selectedFlag[1] = false;
        break;
    }

    this.setData({
      selectedFlag: this.data.selectedFlag,
      tabindex:index,
      openPicker: !this.data.openPicker, 
    })
  },
  ltlist:function(){
    let ltlist=[
      {src:'',tlt:'贵州盛安科技有限公司',dizi:'我是地址',time:'2017-12-25 8:00 至 2017-12-25 12:00'},
      {src:'',tlt:'贵州盛安科技有限公司',dizi:'我是地址',time:'2017-12-25 8:00 至 2017-12-25 12:00'},
      {src:'',tlt:'贵州盛安科技有限公司',dizi:'我是地址',time:'2017-12-25 8:00 至 2017-12-25 12:00'},
    ];
    this.setData({
      ltlist:ltlist
    });
  },
  option:function(){
    var arry=[];
    let optiem=[
      {val:'',name:'全部'},
      {val:'',name:'2019-2-5'},
    ];
    let opdz=[
      {val:'',name:'全部'},
      {val:'',name:'贵阳市云岩区'},
    ];
    let opzt=[
      {val:'',name:'全部'},
      {val:'',name:'高端对话'},
      {val:'',name:'高端对话'},
      {val:'',name:'高端对话'},{val:'',name:'高端对话'},
      {val:'',name:'高端对话'},{val:'',name:'高端对话'},{val:'',name:'高端对话'},{val:'',name:'高端对话'},
      {val:'',name:'高端对话'},{val:'',name:'高端对话'},{val:'',name:'高端对话'},{val:'',name:'高端对话'},
      {val:'',name:'高端对话'},{val:'',name:'高端对话'},{val:'',name:'高端对话'},{val:'',name:'大数据分析'},
    ];
    arry.push(optiem,opdz,opzt);
    this.setData({
      option:arry
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
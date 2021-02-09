github 的 图片链接使用示例：
https://raw.githubusercontent.com/pll1997/2020wechatSbh/master/img/home/saomiao%403x.png?token=ANXRXUREVSOAMZKAMSIHUXDADJ2CQ
进入项目后-找到图片-右键复制图片链接
src: pll1997/2020wechatSbh/master/img/home/saomiao%403x.png
github:'https://raw.githubusercontent.com/',
github_token:'?token=ANXRXUVAD3K7OIXUNL22EWLADENUA',
图片调用方法：
<image class="sys" src="{{github}}pll1997/2020wechatSbh/master/img/home/saomiao%403x.png"></image>

<!-- 顶部导航封装--star -->
所需界面调用方法：
app.nvabarData(本身,'是否显示左边图标','中间标题','控制中间是标题还是自定义的搜索之类','左边显示返回图标还是其它');
app.nvabarData(this,'1','主页','backicon','custom');

// 组件所需的参数
    nvabarData: {
      showCapsule: 1, //是否显示左上角图标   1表示显示    0表示不显示
      title: '奉贤区早教', //导航栏 中间的标题
      centent:'title',//控制是带返回的标题还是自定义的搜索之类 title表示标题 custom表示自定义
      navback:'custom' //左边显示返回按钮还是其它图案，如（扫一扫图标）backicon 表示返回图标 custom表示自定义
    },
<!-- 顶部导航封装--end -->
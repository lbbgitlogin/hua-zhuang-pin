//index.js
//获取应用实例
const app = getApp()
let touchDot = 0; //触摸时的原点 
let touchDotY = 0; //触摸时的原点 y
let time = 0; // 时间记录，用于滑动时且时间小于1s则执行左右滑动 
let interval = ""; // 记录/清理时间记录 
Page({
  data: {
    videoShow:false,
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    imgUrls: [
      {
        bimg: 'https://statics.maiscrm.com/k-bright/images/index-4-2.jpg?version=1',
      },
      {
        bimg: 'https://statics.maiscrm.com/k-bright/images/index-4-3.jpg?version=1',
      },
      {
        bimg: '../../images/index-4-4.jpg?version=1',
      }
    ],
    config:{
      interval: 5000,
      duration: 600,
      current: 0,
    },
    lastCurrent: 0,
    subCurrent:0,
    isactive: '0',//0 正常 1，到底部，2，到顶部
    isactive1: '0',//0 正常 1，到底部，2，到顶部
    isplay: false,
    scrollTop: 0,
    scrollTop1: 0,
    initialTime: 0,
    preIndex: 0,
    //所有图片的高度  
    imgheights: [],
    //图片宽度 
    imgwidth: 750,
    //默认  
    currentimg: 0,
    istouch:false,
    vHeight: 375
  },
  // 跳转明星产品
  toPro: function(e){
    let index = e.currentTarget.dataset.id;
    // console.log(index);
    // if (index == 0 || index == 1){
      wx.switchTab({
        url: '/pages/product/product',
      })
    // }
    
  },
  imageLoad1:function(e){
    console.log(e);
  },
  // 获取banner列表图片高度数组
  imageLoad: function (e) {//获取图片真实宽度  
    var imgwidth = e.detail.width,
      imgheight = e.detail.height,
      //宽高比  
      ratio = imgwidth / imgheight;
    // console.log(imgwidth, imgheight)
    //计算的高度值
    var viewHeight = 750 / ratio;
    var imgheight = viewHeight;
    var imgheights = this.data.imgheights;
    //把每一张图片的对应的高度记录到数组里  
    imgheights[e.target.dataset.id] = imgheight;
    this.setData({
      imgheights: imgheights
    })
    // console.log(imgheights)
  },
  bindtimeupdate: function(e){
    // console.log(e);
    if (!this.data.isplay){return false}
    this.setData({
      initialTime: e.detail.currentTime
    })
    // currentTime, duration
  },
  // 视频播放
  play() {
    
    this.setData({
      isplay: true
    })
  },
  // 视频暂停
  pause() {
    
    this.setData({
      isplay: false
    })
  },
  // 改变banner下标
  bindchange1: function (e) {
    console.log(e);
    // console.log(this.data.lastCurrent + ',' + e.detail.current);
    this.data.istouch = false;
    // if (e.detail.source == "touch") {
      //防止swiper控件卡死
      // if (e.detail.current == 0 && this.data.preIndex > 1) {//卡死时，重置current为正确索引
      //   console.log('卡死了')
      //   this.data.config.current = this.data.preIndex;
      //   this.setData({ config: this.data.config });
      // }
      // else {//正常轮转时，记录正确页码索引
      //   this.setData({ preIndex: e.detail.current });
      // }
      this.data.config.current = e.detail.current;
      this.setData({ config: this.data.config });
    // }
    if (this.data.lastCurrent > e.detail.current){
      this.data.isactive = '1';
    }else{
      this.data.isactive = '2';
    }
    this.data.lastCurrent = e.detail.current
  },
  // 触摸开始事件 
  touchStart: function (e) {
    touchDot = e.touches[0].pageX; // 获取触摸时的原点 
    touchDotY = e.touches[0].pageY; // 获取触摸时的原点 
    // 使用js计时器记录时间  
    interval = setInterval(function () {
      time++;
    }, 100);
  },
  // 触摸移动事件 
  touchMove: function (e) {
    let touchMove = e.touches[0].pageX;
    let touchMoveY = e.touches[0].pageY;
    // 向左滑动  
    if (touchMove - touchDot <= -40 && time < 10) {
      console.log('左滑页面');
    }
    // 向右滑动 
    if (touchMove - touchDot >= 40 && time < 10) {
      console.log('向右滑动');
    }
    // 向下滑动 
    if (touchMoveY - touchDotY >= 40 && time < 10) {
      console.log('向下滑动');
    }
    // 向上滑动 
    if (touchMoveY - touchDotY <= -40 && time < 10) {
      console.log('向上滑动');
    }
  },
  // 触摸结束事件 
  touchEnd: function (e) {
    let _this = this;
    // console.log(this.data.istouch);
    if(this.data.istouch){return false}
    this.data.istouch = true;
    let touchMove = e.changedTouches[0].pageX;
    let touchMoveY = e.changedTouches[0].pageY;
    // console.log(this.data.isactive + ',' + touchMoveY + ',' + touchDotY)
    let index = e.currentTarget.dataset.current;
    
    if(this.data.isactive == '1'){
      // 向下滑动 
      // if (touchMoveY - touchDotY <= -40 && time < 10) {
      //   this.data.config.current = index + 1;
      //   this.setData({
      //     config: this.data.config,
      //     isactive: '2',
      //   })
      //   // touchDotY = 0; 
      //   clearInterval(interval); // 清除setInterval 
      //   time = 0;
        
      //   return false;
      // }  else{
      //   this.data.isactive = '0';
      //   this.setData({
      //     isactive: '0'
      //   })
      // } 
    } else if (this.data.isactive == '2'){
      // 向上滑动 
      if (touchMoveY - touchDotY >= 40 && time < 10) {
        this.data.config.current = index - 1;
        this.setData({
          config: this.data.config,
          isactive: '2'
        })
        // touchDotY = 0;  
        clearInterval(interval); // 清除setInterval 
        time = 0;
        
        return false;
      } else {
        this.data.isactive = '0';
        this.setData({
          isactive: '0'
        })
      }
    }
    this.data.istouch = false;
    // touchDotY = e.changedTouches[0].pageY;
    clearInterval(interval); // 清除setInterval 
    time = 0;
  },
  
  bindplay: function(e){
    // if(e.type == 'play'){
      this.setData({
        isplay: true
      })
      
    // }
  },
  bindpause: function(){
    this.setData({
      isplay: false
    })
  },
  //改变模态框显示隐藏
  changeDailog: function(e){
    
    let s = e.currentTarget.dataset.status;
    if (s){
      this.videoCtx = wx.createVideoContext('myVideo');
      this.videoCtx.play();
      getApp().confirmUser('c_Watch_Video', { Campaign_ID:'dts_campaign_K-Bright_2018_miniprogram'});
      getApp().tagUser(['ACT_3_9']);
    }else{
      this.videoCtx.pause()
    }
    this.setData({
      videoShow: s
    })
    
  },
  //改变整体swiper切换
  changeStep: function(e) {
    let index = e.currentTarget.dataset.current;
    this.data.config.current = index - 1;
    this.setData({
      config: this.data.config
    })
  },
  // 改变第四屏swiper切换
  changeStepSub: function (e) {
    let index = e.currentTarget.dataset.current;
    this.setData({
      subCurrent: index
    })
  },
  //改变第四屏swiper 点击小点点切换事件
  bindchange: function(e){
    // console.log(e);event.detail
    this.setData({
      subCurrent: e.detail.current
    })
  },
  // scroll-view 往下拉到顶部
  upper: function (e) {
    let index = e.currentTarget.dataset.current;
    let _this = this;
    _this.data.isactive = '2';
  },
  // scroll-view 往上拉到底部
  lower: function (e) {
    let index = e.currentTarget.dataset.current;
    let _this = this;
    _this.data.isactive = '1';
  },
  //往下角标点击事件
  chageCurrent: function (e) {
    // console.log(e);
    let _this = this;
    let index = e.currentTarget.dataset.current;
    this.data.config.current = index;
    this.setData({
      config: this.data.config
    })
  },
  onLoad: function () {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse){
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
    try {
      var res = wx.getSystemInfoSync();
      app.globalData.isphone = res.screenHeight > 750 ? true : false;
      // console.log(res)
      this.setData({
        vHeight: res.windowWidth
      })
    } catch (e) {
      // Do something when catch error
    }
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    getApp().confirmUser('c_Share', { Campaign_ID: 'dts_campaign_K-Bright_2018_miniprogram', Share_Type: '未跟踪' });
    getApp().tagUser(['ACT_1_2']);
    return {
      imageUrl: getApp().globalData.shareUrl,
      title: getApp().globalData.shareTitle,
      path: '/pages/index/index?id=' + getApp().globalData.userInfo.openId,
    }
  }
})

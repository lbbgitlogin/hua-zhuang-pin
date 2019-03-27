// pages/start/start.js
let touchDot = 0; //触摸时的原点 
let touchDotY = 0; //触摸时的原点 y
let time = 0; // 时间记录，用于滑动时且时间小于1s则执行左右滑动 
let interval = ""; // 记录/清理时间记录 
//获取应用实例
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    step: '0',
    step1Img: 'https://statics.maiscrm.com/k-bright/images/comein.jpg',
    step2Img: 'https://statics.maiscrm.com/k-bright/images/login-bg.jpg'
  },

  // 触摸开始事件 
  touchStart: function(e) {
    touchDot = e.touches[0].pageX; // 获取触摸时的原点 
    touchDotY = e.touches[0].pageY; // 获取触摸时的原点 
    // 使用js计时器记录时间  
    interval = setInterval(function() {
      time++;
    }, 100);
  },
  // 触摸移动事件 
  touchMove: function(e) {
    let touchMove = e.touches[0].pageX;
    let touchMoveY = e.touches[0].pageY;
    // console.log("touchMove:" + touchMove + " touchDot:" + touchDot + " diff:" + (touchMove - touchDot));
    // console.log("touchMoveY:" + touchMoveY + " touchDot:" + touchDot + " diff:" + (touchMove - touchDot));
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
      this.changeStep();
    }
  },
  // 触摸结束事件 
  touchEnd: function(e) {
    clearInterval(interval); // 清除setInterval 
    time = 0;
  },
  
  getInfo: function(code) {
    let _this = this;
    
  },
  getUserInfo: function(e) {
    console.log(e)
    let _this = this;
    if (e.detail.userInfo) {//授权确定
      wx.login({
        success: r => {
          console.log(r);
          // 发送 res.code 到后台换取 openId, sessionKey, unionId
          wx.request({
            url: getApp().globalData.baseUrl + '/v2/weapp/oauth',
            data: {
              code: r.code,
              scope: 'base',
              watermark: { "appid": "wxecf996094aee42f0" },
              encrypted_data: e.detail.encryptedData,
              iv: e.detail.iv
            },
            method: 'POST',
            header: app.globalData.ReqHeader,
            success: function (re) {
              console.log(re);
              if (re.statusCode != 200){
                return false;
              }
              wx.setStorageSync('openId', re.openId);
              app.globalData.userInfo = re.data;
              app.globalData.ReqHeader['x-access-token'] = re.data.accessToken;    
              wx.switchTab({
                url: '../index/index'
              })   
            }
          })
        }
      })
    } else {//授权取消
      wx.showModal({
        title: '授权提示',
        content: '为更好体验K-BRIGHT小程序，请先授权登录！',
        showCancel: false,
        success: function(res) {
          if (res.confirm) {
            console.log('用户点击确定');
            // _this.getUserInfo();
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
    }
  },
  loadend: function() {
    wx.hideToast()
  },
  changeStep() {
    if (!this.data.hasUserInfo && this.data.canIUse) {
      this.setData({
        step: '1'
      })
      return false;
    }
    // wx.navigateTo({
    //   url: '../search/search',
    // })
    wx.switchTab({
      url: '../user/user'
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    // app.wxlogin();
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
      wx.switchTab({
        url: '../index/index'
      })
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
        wx.switchTab({
          url: '../index/index'
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
          wx.switchTab({
            url: '../index/index'
          })
        }
      })
    }
    // wx.showToast({
    //   title: '图片加载中...',
    //   icon: 'loading',
    //   duration: 10000,
    //   mask: true
    // })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  // onShareAppMessage: function() {
  //   console.log(0);
  // }
})
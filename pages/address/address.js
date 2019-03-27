// pages/address/address.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [],
    type: '0',
    id: '',
  },
  // 获取列表
  getData: function () {
    let _this = this;
    wx.request({
      url: getApp().globalData.baseRquest+'/v2/member/addresses',
      data: {},
      header: getApp().globalData.ReqHeader,
      method: 'GET',
      success: function (res) {
        // console.log(res);
        if (res.statusCode != 200){
          wx.showToast({
            title: '获取数据失败，请重试！',
            icon: 'none',
            duration: 2000
          })
          return false;
        }
        _this.setData({
          list: res.data.items
        })
      },
      fail: function (err) {
        console.log(err);
        wx.showToast({
          title: '获取数据失败，请重试！',
          icon: 'none',
          duration: 2000
        })
      }
    });  
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.data.type = options.type;
    this.data.id = options.id;
    this.setData({
      type: this.data.type,
      id: this.data.id,
    })
  },
  // 刷新
  refreshData:function(event){
    let s = event.detail.status;
    this.getData();
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    // this.onLoad();
    this.getData();
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    this.onLoad();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
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
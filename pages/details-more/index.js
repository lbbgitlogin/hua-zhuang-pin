// pages/details-more/index.js
const utils = require('../../utils/util.js'); 
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [],
    id: ''
  },
  // 获取商品数据
  getData: function () {
    let _this = this;
    wx.showLoading({
      title: '加载中',
    })
    wx.request({
      url: getApp().globalData.baseRquest + '/v2/mall/goods/' + this.data.id,
      data: {},
      header: getApp().globalData.ReqHeader,
      method: 'GET',
      success: function (res) {
        // console.log(res);
        wx.hideLoading()
        if (res.statusCode != 200) {
          wx.showToast({
            title: '获取数据失败，请重试！',
            icon: 'none',
            duration: 2000
          })
          return false;
        }
        let imgs = [];
        if (res.data.product.intro){
          imgs = utils.slipImg(res.data.product.intro);
        }
        _this.setData({
          list: imgs
        })
        // wx.setNavigationBarTitle({
        //   title: res.data.product.name,
        // })
      },
      fail: function (err) {
        // console.log(err);
        wx.hideLoading()
        wx.showToast({
          title: '获取数据失败，请重试！',
          icon: 'none',
          duration: 1500
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let id = options.id;
    this.data.id = id;
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
  
  }
})
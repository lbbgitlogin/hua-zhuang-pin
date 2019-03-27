// pages/logistics/logistics.js
var util = require('../../utils/MD5.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    number:'',
    name: '',
    con: '',
    list: [],
    topTxt: ''
  },
  // 获取我的订单详情
  getOrderData: function () {
    let _this = this;
    wx.showLoading({
      title: '加载中',
    })
    wx.request({
      url: getApp().globalData.baseRquest + '/v2/mall/member/orders/' + this.data.id,
      data: {},
      method: 'GET',
      header: getApp().globalData.ReqHeader,
      success: function (res) {
        console.log(res);
        // wx.hideLoading();
        if (res.statusCode != 200) {
          wx.showToast({
            title: '获取数据失败，请重试！',
            icon: 'none',
            duration: 1000
          })
          wx.hideLoading();
          return false;
        }
        _this.setData({
          info: res.data,
        })
      },
      fail: function (err) {
        // wx.hideLoading()
        wx.showToast({
          title: '获取数据失败，请重试！',
          icon: 'none',
          duration: 1000
        })
      }
    });
  },
  // 获取物流信息
  getData: function () {
    let _this = this;
    wx.showLoading({
      title: '加载中',
    })
    wx.request({
      url: getApp().globalData.baseRquest + '/modules/micromall/delivery/get-logistics-info',
      data: {
        com:_this.data.con,
        num: _this.data.number,
        form: '',
        to: '',
        resultv2:'0'
      },
      method: 'POST',
      header: getApp().globalData.ReqHeader,
      success: function (res) {
        console.log(res);
        wx.hideLoading();
        if (res.statusCode != 200) {
          wx.showToast({
            title: '获取数据失败，请重试！',
            icon: 'none',
            duration: 1000
          })
          return false;
        }
        _this.data.topTxt = res.data.state == '0' ? '在途中' : res.data.state == '1' ? '已揽收' : res.data.state == '2' ? '疑难' : res.data.state == '3' ? '已签收' : res.data.state == '4' ? '退签' : res.data.state == '5' ? '派送中' : res.data.state == '6' ? '退回' : res.data.state == '7' ? '转单' : '';
        // 包括0在途中、1已揽收、2疑难、3已签收、4退签、5同城派送中、6退回、7转单等7个状态
        let arr = [];
        arr = res.data.data ? res.data.data : [];
        for (let i = 0; i < arr.length; i++) {
          arr[i].Mtime = arr[i].time.substr(5, 5);
          arr[i].Dtime = arr[i].time.substr(11,5);
        }
        _this.setData({
          list: arr,
          topTxt: _this.data.topTxt
        })
      },
      fail: function (err) {
        wx.hideLoading()
        wx.showToast({
          title: '获取数据失败，请重试！',
          icon: 'none',
          duration: 1000
        })
      }
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options);
    let number = options.number || '801144867040341151';//快递单号
    let con = options.con || 'yuantong';//快递公司编码
    let name = options.name || '圆通';//快递公司名称
    this.setData({
      number,
      con,
      name
    })
    // this.data.number = ;//快递单号
    // this.data.con = ;//快递公司编码
    // this.data.name = ;//快递公司名称
    console.log(options.orderNumber)
    if (options.orderNumber){
      getApp().confirmUser('c_Check_Express_Info', { Campaign_ID: 'dts_campaign_K-Bright_2018_miniprogram', Order_Number: options.orderNumber });
    }
    if (!this.data.number){
      return false
    }
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
    getApp().confirmUser('c_Share', { Campaign_ID: 'dts_campaign_K-Bright_2018_miniprogram', Share_Type: '未跟踪' });
    getApp().tagUser(['ACT_1_2']);
    return {
      imageUrl: getApp().globalData.shareUrl,
      title: getApp().globalData.shareTitle,
      path: '/pages/index/index?id=' + getApp().globalData.userInfo.openId,
    }
  }
})
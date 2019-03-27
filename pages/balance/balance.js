// pages/balance/balance.js
const utils = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list:[],
    totalPrice: 0,
    addInfo: {id:''}
  },
  //获取结算产品
  getData: function () {
    let _this = this;
    wx.showLoading({
      title: '加载中',
    })
    wx.request({
      url: getApp().globalData.baseRquest + '/v2/mall/member/shoppingCarts',
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
        let all = 0;
        let arr = [];
        for (let i = 0; i < res.data.items.length; i++) {
          if (res.data.items[i].isChecked) {
            res.data.items[i].goods.totalprice = parseFloat(res.data.items[i].goods.price) * res.data.items[i].goods.total;
            all = all + res.data.items[i].goods.totalprice;
            arr.push(res.data.items[i]);
            res.data.items[i].goods.totalprice = utils.toPrice(res.data.items[i].goods.totalprice);
            // let fshow = res.data.items[i].goods.name.indexOf('：');
            // if (fshow > -1) {
            //   res.data.items[i].goods.name1 = res.data.items[i].goods.name.substr(res.data.items[i].goods.name.length - 4, 4);
            //   res.data.items[i].goods.name2 = res.data.items[i].goods.name.substr(0, res.data.items[i].goods.name.length - 4);
            // } else {
            //   res.data.items[i].goods.name2 = res.data.items[i].goods.name
            // }
            res.data.items[i].stype = res.data.items[i].goods.name.indexOf('固体精华') > -1 ? '固体精华' : res.data.items[i].goods.name.indexOf('面膜') > -1 ? '面膜' : '';
            // if (res.data.items[i].stype == '固体精华') {
            //   res.data.items[i].goods.name1 = res.data.items[i].goods.name.substr(res.data.items[i].goods.name.length - 4, 4);
            //   res.data.items[i].goods.name2 = res.data.items[i].goods.name.substr(0, res.data.items[i].goods.name.length - 5);
            // } else if (res.data.items[i].stype == '面膜') {
            //   res.data.items[i].goods.name1 = res.data.items[i].goods.name.substr(res.data.items[i].goods.name.length - 3, 3);
            //   res.data.items[i].goods.name2 = res.data.items[i].goods.name.substr(0, res.data.items[i].goods.name.length - 4);
            // }
            let fshow = res.data.items[i].goods.name.indexOf('：');
            if (fshow < 0) {
              res.data.items[i].goods.name2 = res.data.items[i].goods.name;
            } else {
            res.data.items[i].goods.name1 = res.data.items[i].goods.name.substr(fshow + 1, res.data.items[i].goods.name.length);
            res.data.items[i].goods.name2 = res.data.items[i].goods.name.substr(0, fshow + 1);
            }
            // res.data.items[i].goods.img = res.data.items[i].goods.image;
            res.data.items[i].goods.img = res.data.items[i].goods.specs.picture ? res.data.items[i].goods.specs.picture.url : res.data.items[i].goods.image;
            // _this.getDetails(res.data.items[i].goods.id, '0', res.data.items[i].id, res.data.items[i].goods.specs.description)
          }
          
        }
        _this.setData({
          list: arr,
          totalPrice: utils.toPrice(all)
        })
      },
      fail: function (err) {
        // console.log(err);
        wx.hideLoading()
        wx.showToast({
          title: '获取数据失败，请重试！',
          icon: 'none',
          duration: 2000
        })
      }
    })
  },
  // 获取产品详情
  getDetails: function (id, type, oid,spec) {
    let _this = this;
    wx.request({
      url: getApp().globalData.baseRquest + '/v2/mall/goods/' + id,
      data: {},
      header: getApp().globalData.ReqHeader,
      method: 'GET',
      success: function (res) {
        // console.log(res);
        if (res.statusCode != 200) {
          wx.showToast({
            title: '获取数据失败，请重试！',
            icon: 'none',
            duration: 2000
          })
          return false;
        }
        let list = _this.data.list;
        let tryout = res.data.product.number.substr(res.data.product.number.length - 1, 2) == '2' ? true : false;
        for (let i = 0; i < list.length; i++) {
          if (list[i].id == oid) {
            if (tryout) {
              if (spec.substr(4, 1) == '7') {
                list[i].goods.img = res.data.product.pictures[2].url;
              } else {
                list[i].goods.img = res.data.product.pictures[3].url;
              }
              // list[i].goods.img = res.data.product.pictures[2].url;
            } else {
              list[i].goods.img = res.data.product.pictures[0].url;
            }
          }
        }
        _this.setData({
          list: list
        })
      },
      fail: function (err) {
        // console.log(err);
        wx.showToast({
          title: '获取数据失败，请重试！',
          icon: 'none',
          duration: 1500
        })
      }
    })
  },
  // 获取地址
  getAdd: function(){
    let _this = this;
    wx.request({
      url: getApp().globalData.baseRquest + '/v2/member/addresses',
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
        let info = {id: ''};
        for (let i = 0; i < res.data.items.length;i++){
          if (res.data.items[i].isDefault){
            info = res.data.items[i];
          }
        }
        if(info.id != ''){
          getApp().globalData.addInfo = info;
        }
        _this.setData({
          addInfo: info
        })
      },
      fail: function (err) {
        // console.log(err);
        wx.showToast({
          title: '获取数据失败，请重试！',
          icon: 'none',
          duration: 2000
        })
      }
    })
  },
  // 创建订单／
  createOrder: function(){
    let _this = this;
    if (_this.data.addInfo.id == ''){
      wx.showToast({
        title: '请先选择收货地址！',
        icon: 'none',
        duration: 2000
      })
      return false;
    }
    wx.showLoading({
      title: '加载中',
    })
    let form = {
      "membershipDiscountId": "",
      "memberAddressId": _this.data.addInfo.id,
      "message": "",
      "deliveryMethod": ""
    }
    console.log(form);
    wx.request({
      url: getApp().globalData.baseRquest + '/v2/mall/member/orders',
      data: form,
      header: getApp().globalData.ReqHeader,
      method: 'POST',
      success: function (res) {
        // console.log(res);
        // wx.hideLoading()
        if (res.statusCode != 200) {
          wx.showToast({
            title: '下单失败，请重试！',
            icon: 'none',
            duration: 2000
          })
          return false;
        }
        _this.getWechatParams(res.data.id);
        getApp().globalData.addInfo.id = '';
      },
      fail: function (err) {
        // console.log(err);
        wx.hideLoading()
        wx.showToast({
          title: '下单失败，请重试！',
          icon: 'none',
          duration: 2000
        })
      }
    })
  },
  // 微信支付
  getWechatParams: function(id){
    let _this = this;
    wx.request({
      url: getApp().globalData.baseRquest + '/v2/mall/member/orders/'+id+'/unifiedorder',
      data: {},
      header: getApp().globalData.ReqHeader,
      method: 'GET',
      success: function (res) {
        // console.log(res);
        // wx.hideLoading()
        if (res.statusCode != 200) {
          wx.showToast({
            title: '支付失败，请重试！',
            icon: 'none',
            duration: 2000
          })
          getApp().globalData.isUser = '1';
          wx.switchTab({
            url: '/pages/user/user',
          })
          return false;
        }
        _this.wechatPay(res.data.timeStamp, res.data.nonceStr, res.data.package, res.data.signType, res.data.paySign)
      },
      fail: function (err) {
        // console.log(err);
        wx.hideLoading()
        wx.showToast({
          title: '支付失败，请重试！',
          icon: 'none',
          duration: 2000
        })
        getApp().globalData.isUser = '1';
        wx.switchTab({
          url: '/pages/user/user',
        })
      }
    })
  },
  wechatPay: function (timeStamp, nonceStr, package1, signType, paySign){
    let _this = this;
    wx.requestPayment({
      'timeStamp': timeStamp,
      'nonceStr': nonceStr,
      'package': package1,
      'signType': signType,
      'paySign': paySign,
      'success': function (res) {
        getApp().globalData.isUser = '1';
        wx.switchTab({
          url: '/pages/user/user',
        })
      },
      'fail': function (res) {
        console.log(res);
        getApp().globalData.isUser = '1';
        wx.switchTab({
          url: '/pages/user/user',
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getData();
    this.getAdd();
    getApp().confirmUser('c_Clear_Goods', { Campaign_ID: 'dts_campaign_K-Bright_2018_miniprogram' });
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
    // this.getAdd()
    this.setData({
      addInfo: getApp().globalData.addInfo
    })
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
    // this.getData();
    // this.getAdd()
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
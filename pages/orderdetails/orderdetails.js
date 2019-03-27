// pages/orderdetails/orderdetails.js
const utils = require('../../utils/util.js');
const util = require('../../utils/MD5.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    info:'',
    id:'',
    addInfo: {id:''},
    list: []
  },
  // 联系客服按钮
  contact: function(){
    
    getApp().confirmUser('c_Contact_Service', { Campaign_ID: 'dts_campaign_K-Bright_2018_miniprogram' });
  },

  operate: function(e){
    console.log(e);
    let _this = this;
    let type = e.currentTarget.dataset.type;
    wx.showModal({
      title: type == '0' ? '收货提示' : '取消订单提示',
      content: type == '0' ? '确定已经收到产品？' : '确定要将该订单取消？',
      success: function (res) {
        if (res.confirm) {
          // console.log('用户点击确定');
          if (type == '0') {//设为默认
            _this.confirmOrder();
          } else if (type == '1') {
            _this.cancelOrder();
          }
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },

  //确认收货
  confirmOrder: function(){
    let _this = this;

    wx.showLoading({
      title: '加载中',
    })
    wx.request({
      url: getApp().globalData.baseRquest + '/v2/mall/member/orders/' + this.data.id + '/confirmReceived',
      data: {},
      method: 'PUT',
      header: getApp().globalData.ReqHeader,
      success: function (res) {
        console.log(res);
        wx.hideLoading();
        if (res.statusCode != 200) {
          wx.showToast({
            title: '确认收货失败，请重试！',
            icon: 'none',
            duration: 1000
          })
          return false;
        }
        _this.getOrderData();
        var pages = getCurrentPages();
        if (pages.length > 1) {
          //上一个页面实例对象
          var prePage = pages[pages.length - 2];
          //关键在这里
          prePage.onLoad()
        }
      },
      fail: function (err) {
        wx.hideLoading()
        wx.showToast({
          title: '确认收货失败，请重试！',
          icon: 'none',
          duration: 1000
        })
      }
    });
  },
  //取消订单
  cancelOrder: function () {
    let _this = this;
    wx.showLoading({
      title: '加载中',
    })
    
    wx.request({
      url: getApp().globalData.baseRquest + '/v2/mall/member/orders/' + this.data.id+'/cancel',
      data: {},
      method: 'PUT',
      header: getApp().globalData.ReqHeader,
      success: function (res) {
        console.log(res);
        wx.hideLoading();
        if (res.statusCode != 200) {
          wx.showToast({
            title: '取消订单失败，请重试！',
            icon: 'none',
            duration: 1000
          })
          return false;
        }
        getApp().confirmUser('c_Check_Order_Detail', { Campaign_ID: 'dts_campaign_K-Bright_2018_miniprogram', Order_Number: this.data.info.number });
        _this.getOrderData();
        var pages = getCurrentPages();
        if (pages.length > 1) {
          //上一个页面实例对象
          var prePage = pages[pages.length - 2];
          //关键在这里
          prePage.onLoad()
        }
      },
      fail: function (err) {
        wx.hideLoading()
        wx.showToast({
          title: '取消订单失败，请重试！',
          icon: 'none',
          duration: 1000
        })
      }
    });
  },
  // 获取我的订单详情
  getOrderData: function () {
    let _this = this;
    wx.showLoading({
      title: '加载中',
    })
    wx.request({
      url: getApp().globalData.baseRquest + '/v2/mall/member/orders/'+this.data.id,
      data: {},
      method: 'GET',
      header: getApp().globalData.ReqHeader,
      success: function (res) {
        console.log(res);
        wx.hideLoading();
        // return false;
        if (res.statusCode != 200) {
          wx.showToast({
            title: '获取数据失败，请重试！',
            icon: 'none',
            duration: 1000
          })
          return false;
        }
        getApp().confirmUser('c_Check_Order_Detail', { Campaign_ID: 'dts_campaign_K-Bright_2018_miniprogram', Order_Number: res.data.number, Order_Status: res.data.status });
        res.data.address.id = '1';
        res.data.totalPrice = utils.toPrice(res.data.totalPrice);
        res.data.createdAt = utils.TransferData(res.data.createdAt);
        for (let i = 0; i < res.data.goods.length;i++){
          res.data.goods[i].price = utils.toPrice(res.data.goods[i].price);
          res.data.goods[i].stype = res.data.goods[i].name.indexOf('固体精华') > -1 ? '固体精华' : res.data.goods[i].name.indexOf('面膜') > -1 ? '面膜' : '';
          let fshow = res.data.goods[i].name.indexOf('：');
          if (fshow < 0) {
            res.data.goods[i].name2 = res.data.goods[i].name;
          } else {
            res.data.goods[i].name1 = res.data.goods[i].name.substr(fshow + 1, res.data.goods[i].name.length);
            res.data.goods[i].name2 = res.data.goods[i].name.substr(0, fshow + 1);
          }
          // if (res.data.goods[i].stype == '固体精华') {
          //   res.data.goods[i].name1 = res.data.goods[i].name.substr(res.data.goods[i].name.length - 4, 4);
          //   res.data.goods[i].name2 = res.data.goods[i].name.substr(0, res.data.goods[i].name.length - 5);
          // } else if (res.data.goods[i].stype == '面膜') {
          //   res.data.goods[i].name1 = res.data.goods[i].name.substr(res.data.goods[i].name.length - 3, 3);
          //   res.data.goods[i].name2 = res.data.goods[i].name.substr(0, res.data.goods[i].name.length - 4);
          // }
          // res.data.goods[i].img = res.data.goods[i].image;
          res.data.goods[i].img = res.data.goods[i].specs.picture ? res.data.goods[i].specs.picture.url : res.data.goods[i].image;
          // _this.getDetails(res.data.goods[i].id, i, res.data.goods[i].specs.propertyIds, res.data.goods[i].specs.description);
        }
        _this.setData({
          info: res.data,
          list: res.data.goods,
          addInfo: res.data.address
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
  // 获取产品详情
  getDetails: function (id, idx,spc,spec) {
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
        // let spc1 = util.hexMD5(spc);
        // let img = '';
        // for (let i in res.data.specs.externalSkus) {
        //   if (i == spc1) {
        //     img = res.data.specs.externalSkus[i];
        //   }
        // }
        // list[idx].img = img;
        let tryout = res.data.product.number.substr(res.data.product.number.length - 1, 2) == '2' ? true : false;
        
        if (tryout) {
          if (spec.substr(4, 1) == '7') {
            list[idx].img = res.data.product.pictures[2].url;
          } else {
            list[idx].img = res.data.product.pictures[3].url;
          }
          // list[idx].img = res.data.product.pictures[2].url;
        } else {
          list[idx].img = res.data.product.pictures[0].url;
        }
        
        _this.setData({
          list: list
        })
        // console.log(list);
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
  // 支付
  getWechatParams: function () {
    let _this = this;
    wx.showLoading({
      title: '加载中',
    })
    wx.request({
      url: getApp().globalData.baseRquest + '/v2/mall/member/orders/' + this.data.id + '/unifiedorder',
      data: {},
      header: getApp().globalData.ReqHeader,
      method: 'GET',
      success: function (res) {
        // console.log(res);
        wx.hideLoading()
        if (res.statusCode != 200) {
          wx.showToast({
            title: '支付失败，请重试！',
            icon: 'none',
            duration: 2000
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
      }
    })
  },
  wechatPay: function (timeStamp, nonceStr, package1, signType, paySign) {
    let _this = this;
    wx.requestPayment({
      'timeStamp': timeStamp,
      'nonceStr': nonceStr,
      'package': package1,
      'signType': signType,
      'paySign': paySign,
      'success': function (res) {
        _this.getOrderData();
        var pages = getCurrentPages();
        if (pages.length > 1) {
          //上一个页面实例对象
          var prePage = pages[pages.length - 2];
          //关键在这里
          prePage.onLoad()
        }
      },
      'fail': function (res) {
        console.log(res);
        
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let id = options.id;
    // let id = '5b7f9f84a7fca300adc55593';
    this.data.id = id;
    this.setData({
      id: id
    })
    this.getOrderData();
    
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
    this.getOrderData();
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
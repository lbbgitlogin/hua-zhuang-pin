// pages/user/user.js
const util = require('../../utils/MD5.js');
const utils = require('../../utils/util.js');
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
    activeId:'1',
    list:[],
    orderList: [],
    page:1,
    isMore: true,
    requestList: [],
    isphone: true,
    isload: true
  },
  // 授权确定
  getUserInfo: function (e) {
    let _this = this;
    if (e.detail.userInfo) {//授权确定
      wx.login({
        success: r => {
          console.log(r);
          wx.getUserInfo({
            success: res => {
          // 发送 res.code 到后台换取 openId, sessionKey, unionId
            wx.request({
              url: getApp().globalData.baseUrl + '/v2/weapp/oauth',
              data: {
                code: r.code,
                scope: 'userinfo',
                watermark: { "appid": getApp().globalData.appid },
                encrypted_data: res.encryptedData,
                iv: res.iv
              },
              method: 'POST',
              header: app.globalData.ReqHeader,
              success: function (re) {
                console.log(re);
                if (re.statusCode != 200) {
                  return false;
                }
                getApp().getMenberId(re);
                wx.setStorageSync('openId', re.openId);
                wx.setStorageSync('userInfo', re.data);
                wx.setStorageSync('x-access-token', re.data.accessToken); 
                wx.setStorageSync('lastlogintime', Date.parse(new Date()));
                app.globalData.lastlogintime = Date.parse(new Date());
                app.globalData.userInfo = re.data;
                app.globalData.ReqHeader['x-access-token'] = re.data.accessToken;
                _this.setData({
                  userInfo: re.data,
                  hasUserInfo: true,
                })
                wx.showTabBar({
                  aniamtion:true
                })
                if (_this.data.activeId == '1') {
                  _this.getOrderData();
                } else {
                  _this.getApplyData();
                }
              }
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
        success: function (res) {
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
  // 立即支付
  myPay: function(e){
    // console.log(e);
    // return false;
    let id = e.detail.id;
    this.getWechatParams(id);
  },
  // 微信支付调用
  getWechatParams: function (id) {
    let _this = this;
    wx.request({
      url: getApp().globalData.baseRquest + '/v2/mall/member/orders/' + id + '/unifiedorder',
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
        _this.refresh();
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
    console.log(options);
    let type = '';
    if(options.type){
      type = options.type;
    }
    // this.getData();
    // console.log(app.globalData.userInfo)
    let _this = this;
    wx.getUserInfo({
      success: res => {
        // app.globalData.userInfo = res.userInfo
        _this.setData({
          userInfo: app.globalData.userInfo,
          hasUserInfo: true
        })
        let nowtime = Date.parse(new Date());
        if (app.globalData.lastlogintime) {
          if (nowtime - app.globalData.lastlogintime > 60 * 60 * 5 * 1000) {
            _this.wxlogin();
            return false;
          }
        }
        // if (!app.globalData.userInfo) {
        //   _this.wxlogin();
        //   return false;
        // }
        console.log(type)
        _this.data.activeId = type ? type : app.globalData.isUser;
        // console.log(_this.data.activeId)
        _this.setData({
          activeId: _this.data.activeId
        })
        _this.refresh();
      },
      fail: function (e) {
        wx.hideTabBar({
          aniamtion:false
        })
        // if (app.globalData.isphone == 'iPhone X') {
          _this.setData({
            isphone: getApp().globalData.isphone
          })
        // } else {
        //   _this.setData({
        //     isphone: false
        //   })
        // }
      }
    })
    getApp().confirmUser('c_Entry_MyInfo', { Campaign_ID: 'dts_campaign_K-Bright_2018_miniprogram'});
  },
  // tab切换
  changeActive: function(event){
    // console.log(event.currentTarget.dataset.activebeta);
    if (this.data.activeId == event.currentTarget.dataset.activebeta){
      return false;
    }
    this.data.activeId = event.currentTarget.dataset.activebeta;
    this.data.page = 1;
    this.data.isMore = true;
    getApp().globalData.isUser = this.data.activeId;
    this.setData({
      activeId: this.data.activeId,
      page: this.data.page,
      isMore: this.data.isMore
    })
    if (this.data.activeId == '1') {
      this.data.orderList = [];
      this.setData({
        orderList: []
      })
      this.getOrderData();
      getApp().confirmUser('c_View_Order', { Campaign_ID: 'dts_campaign_K-Bright_2018_miniprogram' });
    } else {
      this.data.list = [];
      this.setData({
        list: []
      })
      this.getApplyData();
      getApp().confirmUser('c_View_Trial', { Campaign_ID: 'dts_campaign_K-Bright_2018_miniprogram' });
    }
  },
  // 获取我的订单列表
  getOrderData: function(){
    let _this = this;
    _this.setData({
      isload: true
    })
    
    wx.request({
      url: getApp().globalData.baseRquest + '/v2/mall/member/orders?listCondition.page=' + _this.data.page +'&listCondition.perPage=2',
      data: {},
      method: 'GET',
      header: app.globalData.ReqHeader,
      success: function (res) {
        // console.log(res);
        if (res.statusCode != 200) {
          _this.setData({
            isload: false
          })
          wx.showToast({
            title: '获取数据失败，请重试！',
            icon: 'none',
            duration: 1000
          })
          return false;
        }
        if (res.data.orders.length < 1) {
          _this.setData({
            isMore: false,
            isload: false
          })
          return false;
        }
        if (_this.data.page === 0) {
          for(let i=0;i<res.data.orders.length;i++){
            for (let j = 0; j < res.data.orders[i].goods.length;j++){
              res.data.orders[i].goods[j].specs.description = res.data.orders[i].goods[j].specs.description.substr(4);
              res.data.orders[i].goods[j].img = res.data.orders[i].goods[j].specs.picture ? res.data.orders[i].goods[j].specs.picture.url : res.data.orders[i].goods[j].image;
              // _this.getDetails(res.data.orders[i].goods[j].id, res.data.orders[i].id, j, '1', res.data.orders[i].goods[j].specs.propertyIds, res.data.orders[i].goods[j].specs.description);
            }
          }
          _this.setData({
            orderList: res.data.orders
          })
        } else {
          let d = _this.data.orderList;
          for (let i = 0; i < res.data.orders.length; i++) {
            for (let j = 0; j < res.data.orders[i].goods.length; j++) {
              res.data.orders[i].goods[j].specs.description = res.data.orders[i].goods[j].specs.description.substr(4);
              res.data.orders[i].goods[j].img = res.data.orders[i].goods[j].specs.picture ? res.data.orders[i].goods[j].specs.picture.url : res.data.orders[i].goods[j].image;
              // _this.getDetails(res.data.orders[i].goods[j].id, res.data.orders[i].id, j, '1', res.data.orders[i].goods[j].specs.propertyIds, res.data.orders[i].goods[j].specs.description);
            }
          }
          let a = [...d, ...res.data.orders];
          _this.setData({
            orderList: a
          })
        }
        if (res.data.orders.length < 2) {
          _this.setData({
            isMore: false
          })
        }
        _this.setData({
          isload: false
        })
      },
      fail: function (err) {
        _this.setData({
          isload: false
        })
        wx.showToast({
          title: '获取数据失败，请重试！',
          icon: 'none',
          duration: 1000
        })
      }
    });  
  },
  // 商品详情
  getDetails: function (id, oid, idx, type, spc, spec) {
    let _this = this;
    var req = wx.request({
      url: getApp().globalData.baseRquest + '/v2/mall/goods/' + id,
      data: {},
      header: getApp().globalData.ReqHeader,
      method: 'GET',
      success: function (res) {
        // console.log(res);
        if (res.statusCode != 200) {
          // wx.showToast({
          //   title: '获取数据失败，请重试！',
          //   icon: 'none',
          //   duration: 2000
          // })
          return false;
        }
        if(type == '1'){
          let list = _this.data.orderList;
          let tryout = res.data.product.number.substr(res.data.product.number.length - 1, 2) == '2' ? true : false;
          for (let i = 0; i < list.length; i++) {
            if (list[i].id == oid) {
              if (tryout) {
                if (spec.substr(0, 1) == '7') {
                  list[i].goods[idx].img = res.data.product.pictures[2].url;
                } else {
                  list[i].goods[idx].img = res.data.product.pictures[3].url;
                }
                // list[i].goods[idx].img = res.data.product.pictures[3].url;
              } else {
                list[i].goods[idx].img = res.data.product.pictures[1].url;
              }
            }
          }
          _this.setData({
            orderList: list
          })
        }else{
          let list = _this.data.list;
          let s = '';
          for (let i = 0; i < res.data.product.specifications[0].properties.length;i++){
            if (res.data.product.specifications[0].properties[i].id == spc){
              s = res.data.product.specifications[0].properties[i].name
            }
          }
          // let spc1 = util.hexMD5(spc);
          // let img = '';
          // for (let i in res.data.specs.externalSkus) {
          //   if (i == spc1) {
          //     img = res.data.specs.externalSkus[i];
          //   }
          // }
          for (let i = 0; i < list.length; i++) {
            if (list[i].id == oid) {
              // list[i].goods[idx].img = img;
              console.log(s);
              if (s.substr(0, 1) == '7') {
                list[i].goods[idx].img = res.data.product.pictures[2].url;
              } else {
                list[i].goods[idx].img = res.data.product.pictures[3].url;
              }
            }
          }
          _this.setData({
            list: list
          })
          console.log(list)
        }

        // console.log(list);
      },
      fail: function (err) {
        // console.log(err);
        // wx.showToast({
        //   title: '获取数据失败，请重试！',
        //   icon: 'none',
        //   duration: 1500
        // })
      }
    })
    let arrl = _this.data.requestList;
    arrl.push(req)
    _this.data.requestList = arrl;
  },
  // 获取我的申请列表
  getApplyData: function(){
    let _this = this;
    _this.setData({
      isload: true
    })
    wx.request({
      url: getApp().globalData.baseRquest + '/modules/samplesack/open/get-orders?listCondition.page=' + _this.data.page + '&listCondition.perPage=11&memberId=' + app.globalData.userInfo.member.id,
      data: {},
      method: 'GET',
      header: app.globalData.ReqHeader,
      success: function (res) {
        
        console.log(res);
        if (res.statusCode != 200) {
          _this.setData({
            isload: false
          })
          wx.showToast({
            title: '获取数据失败，请重试！',
            icon: 'none',
            duration: 1000
          })
          return false;
        }
        if (res.data.items.length < 1){
          _this.setData({
            isMore: false,
            isload: false
          })
          return false;
        }
        if(_this.data.page === 0){
          _this.data.list = res.data.items;
          for (let i = 0; i < res.data.items.length;i++){
            for (let j = 0; j < res.data.items[i].goods.length;j++){
              res.data.items[i].goods[j].name1 = res.data.items[i].goods[j].name.substr(res.data.items[i].goods[j].name.length - 4, 4);
              res.data.items[i].goods[j].name2 = res.data.items[i].goods[j].name.substr(0, res.data.items[i].goods[j].name.length - 4);
              // console.log(res.data.items[i].goods[j].pictures.length);
              res.data.items[i].goods[j].image = res.data.items[i].goods[j].pictures[5].url;
              // _this.getDetails(res.data.items[i].goods[j].id, res.data.items[i].id, j, '0', res.data.items[i].goods[j].specs.propertyIds, res.data.items[i].goods[j].specs.description);
              _this.getTime(res.data.items[i].goods[0].id, res.data.items[i].id,i);
            }
          }
          _this.setData({
            list: res.data.items
          })
        }else{
          let d = _this.data.list;
          for (let i = 0; i < res.data.items.length; i++) {
            for (let j = 0; j < res.data.items[i].goods.length; j++) {
              res.data.items[i].goods[j].name1 = res.data.items[i].goods[j].name.substr(res.data.items[i].goods[j].name.length - 4, 4);
              res.data.items[i].goods[j].name2 = res.data.items[i].goods[j].name.substr(0, res.data.items[i].goods[j].name.length - 4);
              // console.log(res.data.items[i].goods[j].pictures.length);
              res.data.items[i].goods[j].image = res.data.items[i].goods[j].pictures[5].url;
              // _this.getDetails(res.data.items[i].goods[j].id, res.data.items[i].id, j, '0', res.data.items[i].goods[j].specs.propertyIds, res.data.items[i].goods[j].specs.description);
              _this.getTime(res.data.items[i].goods[0].id, res.data.items[i].id, i);
            }
          }
          let a = [...d, ...res.data.items];
          _this.setData({
            list: a
          })
        }
        // for (let i = 0; i < res.data.items.length;i++){
        //   _this.getTime(res.data.items[i].goods[0].id, res.data.items[i].id);
        // }
        if (res.data.items.length < 2) {
          _this.setData({
            isMore: false
          })
        }
        _this.setData({
          isload: false
        })
      },
      fail: function (err) {
        _this.setData({
          isload: false
        })
        wx.showToast({
          title: '获取数据失败，请重试！',
          icon: 'none',
          duration: 1000
        })
      }
    }); 
  },
  // 刷新
  refresh: function(){
    this.data.page = 1;
    this.data.isMore = true;
    this.setData({
      page: this.data.page,
      isMore: this.data.isMore,
    })
    if (this.data.activeId == '1') {
      this.data.orderList = [];
      this.setData({
        orderList: []
      })
      this.getOrderData();
      
    } else {
      for (let i = 0; i < this.data.requestList.length; i++) {
        this.data.requestList[i].abort()
      }
      this.data.list = [];
      this.setData({
        list: []
      })
      this.getApplyData();
      
    }
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    
  },
  // 获取申领试用时间
  getTime: function (id,aid,index) {
    let _this = this;
    wx.request({
      url: getApp().globalData.baseRquest + '/modules/samplesack/open/get-goods-interval',
      data: {
        goodsId: id
      },
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
        res.data.startTime = utils.TransferDataFormat(res.data.startTime);
        res.data.endTime = utils.TransferDataFormat(res.data.endTime, '0');
        res.data.openingTime = utils.TransferDataFormat(res.data.openingTime,'0');
        let list = _this.data.list;
        list[index].opentime = res.data.openingTime;
        let sindex = utils.findSIndex(res.data.name,'】',2)+1;
        // console.log(sindex)
        list[index].name3 = res.data.name.substr(sindex);
        list[index].name4 = res.data.name.substr(0, sindex);
        if (list[index].goods[0].pictures.length >= 12){
          if (res.data.name.substr(res.data.name.length - 3) == "16粒装") {
            
            list[index].goods[0].img = list[index].goods[0].pictures[3].url;
          } else {
            list[index].goods[0].img = list[index].goods[0].pictures[2].url;
          }
        }else{
          list[index].goods[0].img = list[index].goods[0].pictures[2].url;
        }
        
        // for(let i=0;i<list.length;i++){
        //   if(list[i].id == aid){
        //     list[i].opentime = res.data.endTime
        //   }
        // }
        _this.setData({
          list: list
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
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    let _this = this;
    wx.getUserInfo({
      success: res => {
        _this.setData({
          userInfo: app.globalData.userInfo,
          hasUserInfo: true
        })
      },
      fail: function (e) {

      }
    })
    // this.refresh();
    
    // if (app.globalData.userInfo && app.globalData.userInfo.member) {
    //   this.setData({
    //     userInfo: app.globalData.userInfo,
    //     hasUserInfo: true
    //   })
    // } else if (this.data.canIUse) {
    //   // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
    //   // 所以此处加入 callback 以防止这种情况
    //   app.userInfoReadyCallback = res => {
    //     this.setData({
    //       userInfo: res.userInfo,
    //       hasUserInfo: true
    //     })
    //   }
    // } else {
    //   // 在没有 open-type=getUserInfo 版本的兼容处理
    //   wx.getUserInfo({
    //     success: res => {
    //       app.globalData.userInfo = res.userInfo
    //       this.setData({
    //         userInfo: res.userInfo,
    //         hasUserInfo: true
    //       })
    //     }
    //   })
    // }
    // if (!app.globalData.userInfo){
    //   this.wxlogin();
    //   return false;
    // }
    // if (!app.globalData.userInfo.member) {
    //   return false;
    // }
    
  },
  // 登录
  wxlogin: function () {
    let _this = this;
    wx.login({
      success: r => {
        wx.getUserInfo({
          success: res => {
            // _this.globalData.userInfo = res.userInfo
            wx.request({            //后台接口地址
              url: app.globalData.baseUrl + '/v2/weapp/oauth',
              data: {
                code: r.code,
                scope: 'userinfo',
                watermark: {
                  "appid": app.globalData.appid
                },
                encrypted_data: res.encryptedData,
                iv: res.iv
              },
              method: 'POST',
              header: app.globalData.ReqHeader,
              success: function (re) {
                // console.log(re);
                if (re.statusCode != 200) {
                  return false;
                }
                wx.setStorageSync('openId', re.data.openId);
                wx.setStorageSync('userInfo', re.data);
                wx.setStorageSync('x-access-token', re.data.accessToken);
                wx.setStorageSync('lastlogintime', Date.parse(new Date()));
                app.globalData.lastlogintime = Date.parse(new Date());
                app.globalData.userInfo = re.data;
                app.globalData.ReqHeader['x-access-token'] = re.data.accessToken;
                _this.setData({
                  userInfo: re.data,
                  hasUserInfo: true
                })
                _this.refresh();
              }
            })
            // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
            // 所以此处加入 callback 以防止这种情况
            if (_this.userInfoReadyCallback) {
              _this.userInfoReadyCallback(res)
            }
          },
          fail: e => {
            wx.request({            //后台接口地址
              url: app.globalData.baseUrl + '/v2/weapp/oauth',
              data: {
                code: r.code,
                scope: 'base',
                watermark: {
                  "appid": app.globalData.appid
                },
                encrypted_data: '',
                iv: ''
              },
              method: 'POST',
              header: app.globalData.ReqHeader,
              success: function (re) {
                // console.log(re);
                if (re.statusCode != 200) {
                  return false;
                }
                wx.setStorageSync('openId', re.data.openId);
                wx.setStorageSync('userInfo', re.data);
                wx.setStorageSync('lastlogintime', Date.parse(new Date()));
                app.globalData.lastlogintime = Date.parse(new Date());
                wx.setStorageSync('x-access-token', re.data.accessToken);
                app.globalData.userInfo = re.data;
                app.globalData.ReqHeader['x-access-token'] = re.data.accessToken;
                _this.setData({
                  userInfo: re.data,
                  hasUserInfo: false
                })
              }
            })
          }
        })
      },
    })
  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    for (let i = 0; i < this.data.requestList.length; i++) {
      this.data.requestList[i].abort()
    }
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
    this.refresh();
    // 停止下拉动作
    wx.stopPullDownRefresh();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    if(!this.data.isMore){
      return false;
    }
    this.data.page = this.data.page+1;
    this.setData({
      page: this.data.page
    })
    if(this.data.activeId == '1'){
      this.getOrderData();
    }else{
      this.getApplyData();
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
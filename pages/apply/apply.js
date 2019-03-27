// pages/apply/apply.js
const utils = require('../../utils/util.js'); 
Page({

  /**
   * 页面的初始数据
   */
  data: {
    modalshow: false,
    id: '',
    info: '',
    bgimg:'',
    type: '',
    isphone: true,
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    isAuto: false,
    isApply: false
  },
  // 显示隐藏活动说明
  changenStatus: function (event) {
    console.log(event);
    if (event.currentTarget.dataset.status){
      getApp().confirmUser('c_View_Activity_Rule', { Campaign_ID: 'dts_campaign_K-Bright_2018_miniprogram'});
    }
    this.setData({
      modalshow: event.currentTarget.dataset.status
    })
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
        let info = {};
        // console.log(this.data.info)
        // let fshow = res.data.product.name.indexOf('：');
        info.specName = res.data.product.name.indexOf('固体精华') > -1 ? '7粒装' : res.data.product.name.indexOf('面膜') > -1 ? '4片装' : '';
        let fshow = res.data.product.name.indexOf('：');
        if (fshow < 0) {
          info.name2 = res.data.product.name;
        } else {
          info.name1 = res.data.product.name.substr(fshow + 1, res.data.product.name.length);
          info.name2 = res.data.product.name.substr(0, fshow);
        }
        // console.log(info)
        // if (info.specName == '7粒装') {
        //   info.name1 = res.data.product.name.substr(res.data.product.name.length - 4, 4);
        //   info.name2 = res.data.product.name.substr(0, res.data.product.name.length - 5);
        //   info.name3 = "【" + info.name1 + "】固体精华 " + '七粒装';
        // } else if (info.specName == '4片装'){
        //   // info.name2 = res.data.product.name;
        //   info.name1 = res.data.product.name.substr(res.data.product.name.length - 3, 3);
        //   info.name2 = res.data.product.name.substr(0, res.data.product.name.length - 4);
        // }
        info.pic = res.data.product.pictures;
        info.id = res.data.id;
        info.name = res.data.product.name;
        info.total = 1;
        info.specs = {
          propertyIds: utils.createString([res.data.product.specifications[0].properties[0].id])
        }
        info.specsLen = res.data.product.specifications[0].properties.length;
        
        getApp().globalData.applyInfo = info;
        _this.setData({
          info: info,
          bgimg: res.data.product.pictures[4].url
        })
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
  //立即申领
  applyNow: function(){
    let _this = this;
    if(this.data.isApply){
      getApp().globalData.isUser = '2';
      wx.switchTab({
        url: '/pages/user/user',
      })
      return false;
    }
    this.getTime();
    return false
  },
  // 获取申领时间
  getTime: function () {
    let _this = this;
    wx.request({
      url: getApp().globalData.baseRquest + '/modules/samplesack/open/get-goods-interval',
      data: {
        goodsId: this.data.id
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
        // res.data.startTime = utils.TransferDataFormat(res.data.startTime);
        // res.data.endTime = utils.TransferDataFormat(res.data.endTime, '0');
        // res.data.openingTime = utils.TransferDataFormat(res.data.openingTime, '0');
        let nowtime = Date.parse(new Date());
        let startTime = Date.parse(new Date(res.data.startTime.replace(new RegExp(/-/gm), "/")));
        let endTime = Date.parse(new Date(res.data.endTime.replace(new RegExp(/-/gm), "/")));
        if (nowtime < startTime) {
          let time = utils.TransferDataFormat(res.data.startTime, '1').substr(5);
          wx.showModal({
            title: '申领提示',
            content: '活动将于' + time + '开始 敬请期待',
            showCancel: false,
            success: function (res) {
              if (_this.data.type == '1'){
                return false;
              }
              wx.switchTab({
                url: '/pages/index/index',
              })
            }
          })
          return false;
        } else if (nowtime > endTime) {
          wx.showModal({
            title: '申领提示',
            content: '活动已结束 敬请期待下一次',
            showCancel: false,
            success: function (res) {
              if (_this.data.type == '1') {
                return false;
              }
              wx.switchTab({
                url: '/pages/index/index',
              })
            }
          })
          return false;
        }
        wx.navigateTo({
          url: '/pages/question/question?id=' + _this.data.id,
        })
      },
      fail: function (err) {
        // console.log(err);
        // wx.showToast({
        //   title: '获取数据失败，请重试！',
        //   icon: 'none',
        //   duration: 2000
        // })
      }
    })
  },
  // 获取我的申请列表
  getApplyData: function () {
    let _this = this;
    wx.request({
      url: getApp().globalData.baseRquest + '/modules/samplesack/open/get-orders?listCondition.page=' + _this.data.page + '&listCondition.perPage=20&memberId=' + getApp().globalData.userInfo.member.id,
      data: {},
      method: 'GET',
      header: getApp().globalData.ReqHeader,
      success: function (res) {
        console.log(res);
        if (res.statusCode != 200) {
          wx.showToast({
            title: '获取数据失败，请重试！',
            icon: 'none',
            duration: 1000
          })
          return false;
        }
        let isApply = false;
        for (let i = 0; i < res.data.items.length; i++) {
          if (res.data.items[i].goods[0].id == _this.data.id) {
            isApply = true;
          }
        }
        _this.setData({
          isApply: isApply
        })
      },
      fail: function (err) {
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
    // console.log(options);
    let id = options.id;
    // let id = '5b8e54a18f5bc015034d395a';
    this.data.id = id;
    this.data.type = options.type ? options.type : '0';
    this.setData({
      id: id,
      // isphone: getApp().globalData.isphone
    })
    
    let _this = this;
    // this.getData();
    try {
      var res = wx.getSystemInfoSync();
      getApp().globalData.isphone = res.windowHeight > 680 ? true : false;
      // console.log(res)
      this.setData({
        isphone: getApp().globalData.isphone
      })
    } catch (e) {
      // Do something when catch error
    }
    wx.getUserInfo({
      success: res => {
        // app.globalData.userInfo = res.userInfo
        _this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true,
          isAuto: true
        })
        let nowtime = Date.parse(new Date());
        // console.log(getApp().globalData.lastlogintime);
        if (getApp().globalData.lastlogintime) {
          if (nowtime - getApp().globalData.lastlogintime > 60 * 60 * 5 * 1000) {
            _this.wxlogin();
            return false;
          }
        }
        _this.getData();
        _this.getApplyData();
        getApp().confirmUser('c_Apply_for_Sampling', { Campaign_ID: 'dts_campaign_K-Bright_2018_miniprogram', Product_SKU: _this.data.info.name + _this.data.info.specName });
        getApp().tagUser(['ACT_2_6']);
      },
      fail: function (e) {
        console.log(e)
      }
    })
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
                header: getApp().globalData.ReqHeader,
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
                  getApp().globalData.lastlogintime = Date.parse(new Date());
                  getApp().globalData.userInfo = re.data;
                  getApp().globalData.ReqHeader['x-access-token'] = re.data.accessToken;
                  _this.setData({
                    userInfo: re.data,
                    hasUserInfo: true,
                    isAuto: true
                  })
                  _this.getData();
                  _this.getApplyData();
                  getApp().confirmUser('c_Apply_for_Sampling', { Campaign_ID: 'dts_campaign_K-Bright_2018_miniprogram', Product_SKU: _this.data.info.name + _this.data.info.specName });
                  getApp().tagUser(['ACT_2_6']);
                },
                fail: function (err) {
                  // console.log(err);
                  wx.showToast({
                    title: '登录失败，请重试！',
                    icon: 'none',
                    duration: 2000
                  })
                  _this.setData({
                    isAuto: false
                  })
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
  // 登录
  wxlogin: function () {
    let _this = this;
    wx.login({
      success: r => {
        wx.getUserInfo({
          success: res => {
            // _this.globalData.userInfo = res.userInfo
            wx.request({            //后台接口地址
              url: getApp().globalData.baseUrl + '/v2/weapp/oauth',
              data: {
                code: r.code,
                scope: 'userinfo',
                watermark: {
                  "appid": getApp().globalData.appid
                },
                encrypted_data: res.encryptedData,
                iv: res.iv
              },
              method: 'POST',
              header: getApp().globalData.ReqHeader,
              success: function (re) {
                // console.log(re);
                if (re.statusCode != 200) {
                  return false;
                }
                wx.setStorageSync('openId', re.data.openId);
                wx.setStorageSync('userInfo', re.data);
                wx.setStorageSync('x-access-token', re.data.accessToken);
                wx.setStorageSync('lastlogintime', Date.parse(new Date()));
                getApp().globalData.lastlogintime = Date.parse(new Date());
                getApp().globalData.userInfo = re.data;
                getApp().globalData.ReqHeader['x-access-token'] = re.data.accessToken;
                _this.setData({
                  userInfo: re.data,
                  hasUserInfo: true
                })
                _this.getData();
                _this.getApplyData();
                getApp().confirmUser('c_Apply_for_Sampling', { Campaign_ID: 'dts_campaign_K-Bright_2018_miniprogram', Product_SKU: _this.data.info.name + _this.data.info.specName });
                getApp().tagUser(['ACT_2_6']);
              }
            })
            // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
            // 所以此处加入 callback 以防止这种情况
            if (_this.userInfoReadyCallback) {
              _this.userInfoReadyCallback(res)
            }
          },
          fail: e => {
            
          }
        })
      },
    })
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
    this.getData();
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
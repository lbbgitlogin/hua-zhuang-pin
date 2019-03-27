// pages/applyresult/applyresult.js
const utils = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    modalshow: true,
    txt:'',
    id: '',
    info: '',
    type: '',
    status: '',
    addInfo: '',
    time:'',
    rewardList: [],
    isTrue: false,
    vheight: 0,
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    isphone: true,
    isAuto: false,
  },
  //改变模态框显示隐藏
  changeDailog: function (e) {
    let s = e.currentTarget.dataset.status;
    this.setData({
      isTrue: s
    })

  },
  // 返回
  goBack: function(){
    if (this.data.info.auditStatus == 'pass'){
      wx.navigateTo({
        url: '/pages/address/address?type=1&id='+this.data.id,
      })
      return false;
    } else if (this.data.info.auditStatus == 'accepted'){
      if (this.data.info.shipment){
        wx.navigateTo({
          url: '/pages/logistics/logistics?number=' + this.data.info.shipment.number + '&con=' + this.data.info.shipment.expCom + '&name=' + this.data.info.shipment.expName+'',
        })
      }else{
        wx.navigateTo({
          url: '/pages/logistics/logistics?number=&con=&name=',
        })
      }
      return false
    }
    if(this.data.type == '1'){
      wx.navigateBack();
      return false;
    }
    getApp().globalData.isUser = '2';
    wx.switchTab({
      url: '/pages/user/user',
    })
  },
  changenStatus: function(event){
    this.setData({
      modalshow: event.currentTarget.dataset.status
    })
  },
  // 获取商品数据
  getData: function () {
    let _this = this;
    // wx.showLoading({
    //   title: '加载中',
    // })
    wx.request({
      url: getApp().globalData.baseRquest + '/modules/samplesack/open/get-order-detail/' + this.data.id,
      data: {},
      header: getApp().globalData.ReqHeader,
      method: 'GET',
      success: function (res) {
        // console.log(res);
        // wx.hideLoading()
        if (res.statusCode != 200) {
          wx.showToast({
            title: '获取数据失败，请重试！',
            icon: 'none',
            duration: 2000
          })
          return false;
        }
        _this.setData({
          info: res.data,
        })
        
        // if(!_this.data.time){
          _this.getTime(res.data.goods[0].id);
        // }
        if (res.data.auditStatus == 'fail'){//fail
          _this.getRList(res.data.goods[0].id);
        }
      },
      fail: function (err) {
        // console.log(err);
        // wx.hideLoading()
        wx.showToast({
          title: '获取数据失败，请重试！',
          icon: 'none',
          duration: 1500
        })
      }
    })
  },
  // 修改收货地址
  changeAdd: function () {
    let _this = this;
    wx.showLoading({
      title: '加载中',
    })
    wx.request({
      url: getApp().globalData.baseRquest + '/modules/samplesack/open/update-address/' + this.data.id,
      data: {
        memberAddressId: this.data.addInfo.id
      },
      header: getApp().globalData.ReqHeader,
      method: 'PUT',
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
        _this.getData(); 
        _this.getInfo();
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
                  wx.showTabBar({
                    aniamtion: true
                  })
                  _this.getData();
                  _this.getInfo();
                  // _this.getApplyData();
                  // _this.getCartData();
                },
                fail: function (err) {
                  // console.log(err);
                  wx.showToast({
                    title: '登录失败，请重试！',
                    icon: 'none',
                    duration: 2000
                  })
                  _this.setData({
                    isAuto: true
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
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let id = options.id;
    let type = options.type;
    // let id = '5b8f4c24d8a6d23b514bfc32';
    // let type = '0';
    this.data.id = id;
    this.data.type = type;
    this.data.status = options.status;

    // console.log(type);
    // if(type == '1'){
    //   wx.reLaunch({
    //     url: '/pages/applyresult/applyresult?id=' + id + '&status=' + options.status + '&type=1'
    //   })
    // }
    this.setData({
      id: id,
      vheight: getApp().globalData.shh - getApp().globalData.ww - getApp().globalData.ssh
    })
    if(type == '3'){
      let _this = this;
      try {
        var res = wx.getSystemInfoSync();
        getApp().globalData.isphone = res.windowHeight > 624 ? true : false;
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
          // _this.wxlogin();
          // return false;
          let nowtime = Date.parse(new Date());
          // console.log(getApp().globalData.lastlogintime);
          if (getApp().globalData.lastlogintime) {
            if (nowtime - getApp().globalData.lastlogintime > 60 * 60 * 5 * 1000) {
              _this.wxlogin();
              return false;
            }
          }
          this.getData();
          this.getInfo();
        },
        fail: function (e) {
          
        }
      })
    }else{
      this.setData({
        isAuto: true
      })
      this.getData();
      this.getInfo();
    }
    // if (this.data.status == 'pass'){
    //   this.getAdd();
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
                  hasUserInfo: true,
                  isAuto: true
                })
                _this.getData();
                _this.getInfo();
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
              url: getApp().globalData.baseUrl + '/v2/weapp/oauth',
              data: {
                code: r.code,
                scope: 'base',
                watermark: {
                  "appid": getApp().globalData.appid
                },
                encrypted_data: '',
                iv: ''
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
                  hasUserInfo: false,
                  isAuto: true
                })
                _this.getData();
                _this.getInfo();
              }
            })
          }
        })
      },
    })
  },
  // 获取地址
  getAdd: function () {
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
        let info = { id: '' };
        for (let i = 0; i < res.data.items.length; i++) {
          if (res.data.items[i].isDefault) {
            info = res.data.items[i];
          }
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
  // 获取申领时间
  getTime: function(id){
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
        res.data.endTime = utils.TransferDataFormat(res.data.endTime);
        res.data.openingTime = utils.TransferDataFormat(res.data.openingTime);
        res.data.openingTime1 = res.data.openingTime.substr(5);
        if (res.data.startTime.substr(0, 4) == res.data.endTime.substr(0, 4)){
          res.data.endTime = res.data.endTime.substr(5);
        }
        _this.setData({
          time: res.data,
        })
        // console.log(res.data.goods.name + res.data.name.substr(res.data.name.length-3));
        getApp().confirmUser('c_Check_Trial_Result', { Campaign_ID: 'dts_campaign_K-Bright_2018_miniprogram', Product_SKU: res.data.goods.name + res.data.name.substr(res.data.name.length-3) });
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
  // 获取获奖名单
  getRList: function (id) {
    let _this = this;
    wx.request({
      url: getApp().globalData.baseRquest + '/modules/samplesack/open/get-reward-list',
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
        _this.setData({
          rewardList: res.data.items
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
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    // if (this.data.status == 'pass') {
    //   this.getAdd();
    // }
    
  },
  // 获取是否关注公众号
  getInfo: function () {
    let _this = this;
    // wx.showLoading({
    //   title: '加载中',
    // })
    wx.request({
      url: getApp().globalData.baseRquest + '/v2/member',
      data: {},
      header: getApp().globalData.ReqHeader,
      method: 'GET',
      success: function (res) {
        // console.log(res);
        // wx.hideLoading()
        if (res.statusCode != 200) {
          wx.showToast({
            title: '获取数据失败，请重试！',
            icon: 'none',
            duration: 2000
          })
          return false;
        }
        let istrue = false;
        // let channelId = getApp().globalData.userInfo.channelId;
        let channelId = '5b5aae35148552bca96cbd01';
        if (res.data.socials.length < 1) {
          istrue: false
        }
        for (let i = 0; i < res.data.socials.length; i++) {
          if (res.data.socials[i].channel == channelId) {
            istrue = res.data.socials[i].subscribed;
          }
        }
        _this.setData({
          isTrue: istrue
        })
      },
      fail: function (err) {
        // wx.hideLoading()
        wx.showToast({
          title: '获取数据失败，请重试！',
          icon: 'none',
          duration: 1500
        })
      }
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
    // console.log(this.data.type);
    // if (this.data.type == '0'){
    //   wx.switchTab({
    //     url: '/pages/user/user',
    //   })
    // }
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
    getApp().confirmUser('c_Share', { Campaign_ID: 'dts_campaign_K-Bright_2018_miniprogram', Share_Type:'未跟踪' });
    getApp().tagUser(['ACT_1_2']);
    return {
      imageUrl: getApp().globalData.shareUrl,
      title: getApp().globalData.shareTitle,
      path: '/pages/index/index?id=' + getApp().globalData.userInfo.openId,
    }
  }
})
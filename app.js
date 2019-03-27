//app.js
App({
  onLaunch: function(option) {
    // console.log(option);
    let shareid = option.query.id;
    this.globalData.shareid = shareid;
    this.screenSize();
    // wx.getStorageSync('')
    let userInfo = wx.getStorageSync('userInfo');
    let token = wx.getStorageSync('x-access-token');
    let code = wx.getStorageSync('code');
    let lastlogintime = wx.getStorageSync('lastlogintime');
    // console.log(userInfo);
    // return false;
    if (lastlogintime){
      this.globalData.lastlogintime = lastlogintime;
    }
    if (userInfo){
      this.globalData.userInfo = userInfo;
    }
    if (code) {
      this.globalData.logincode = code;
    }
    if (token) {
      this.globalData.ReqHeader['x-access-token'] = token;
    }
    // wx.loadFontFace({
    //   family: 'HYg2gj',
    //   source: 'url("https://statics.maiscrm.com/k-bright/font/HYg2gj.ttf")',
    //   success: console.log('HYg2gj'),
    // })
    // wx.loadFontFace({
    //   family: 'HYb2gj',
    //   source: 'url("https://statics.maiscrm.com/k-bright/font/HYDaHeiJ.ttf")',
    //   success: console.log('HYb2gj'),
    // })
    
    // wx.loadFontFace({
    //   family: 'HYb1gj',
    //   source: 'url("https://statics.maiscrm.com/k-bright/font/HYb1gj.ttf")',
    //   success: console.log('HYb1gj'),
    // })
    // wx.loadFontFace({
    //   family: 'HYZhongHeiJ',
    //   source: 'url("https://statics.maiscrm.com/k-bright/font/HYZhongHeiJ.ttf")',
    //   success: console.log('HYZhongHeiJ'),
    // })
    // wx.loadFontFace({
    //   family: 'HYa1gj',
    //   source: 'url("https://statics.maiscrm.com/k-bright/font/HYa1gj.ttf")',
    //   success: console.log,
    // })
  },
  onShow: function(){
    // console.log(1);
    this.wxlogin();
  },
  // 静默授权获取MemberID
  getMenberId: function(val){
    let _this = this;
    if (!_this.globalData.isTraking) { return false; }
    wx.login({
      success: r => {
        wx.getUserInfo({
          success: res => {
            // console.log(r);
            // _this.globalData.userInfo = res.userInfo
            wx.request({            //后台接口地址
              url: _this.globalData.baseUrl + '/v2/weapp/oauth',
              data: {
                scope: 'base-member',
                code: r.code,
                watermark: {
                  "appid": _this.globalData.appid
                },
                encrypted_data: res.encryptedData,
                iv: res.iv
              },
              method: 'POST',
              header: _this.globalData.ReqHeader,
              success: function (re) {
                // console.log(re);
                if (re.statusCode != 200) {
                  return false;
                }
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
              url: _this.globalData.baseUrl + '/v2/weapp/oauth',
              data: {
                scope: 'base-member',
                code: r.code,
                watermark: {
                  "appid": _this.globalData.appid
                },
                encrypted_data: res.encryptedData,
                iv: res.iv
              },
              method: 'POST',
              header: _this.globalData.ReqHeader,
              success: function (re) {
                console.log(re);
                if (re.statusCode != 200) {
                  return false;
                }
              }
            })
          }
        })
      },
    })
    
  },
  // 给用户打标签
  tagUser: function(arr){
    // console.log(arr);
    let _this = this;
    if (!_this.globalData.isTraking) { return false; }
    wx.request({            //后台接口地址
      url: _this.globalData.baseRquest + '/v2/member/tag/add',
      data: {
        tags: arr
      },
      method: 'PUT',
      header: _this.globalData.ReqHeader,
      success: function (re) {
        // console.log(re);
        if (re.statusCode != 200) {
          return false;
        }
      }
    })
  },
  // 提交用户事件
  confirmUser: function (type, propers) {
    // console.log(type);
    // console.log(propers);
    let _this = this;
    if (!_this.globalData.isTraking) { return false; }
    wx.request({            //后台接口地址
      url: _this.globalData.baseRquest + '/v2/member/events',
      data: {
        type: type,
        eventProperties: JSON.stringify(propers)
      },
      method: 'POST',
      header: _this.globalData.ReqHeader,
      success: function (re) {
        // console.log(re);
        if (re.statusCode != 200) {
          return false;
        }
        
      }
    })
  },
  // 更新用户缺省属性
  updateUser: function (gender,age) {
    // console.log(gender + ',' + age);
    let _this = this;
    if (!_this.globalData.isTraking) { return false; }
    wx.request({            //后台接口地址
      url: _this.globalData.baseRquest + '/v2/member',
      data: {
        properties: [{
          "propertyId": "gender",
          "valueString": {
            "value": gender == '男' ? 'male' : gender == '女' ? 'female' : 'unknown'
          },
        }, {
            "propertyId": "age",
            "valueString": {
              "value": age
            },
          }]
      },
      method: 'PUT',
      header: _this.globalData.ReqHeader,
      success: function (re) {
        // console.log(re);
        if (re.statusCode != 200) {
          return false;
        }
      }
    })
  },
  wxlogin1: function () {
    let _this = this;
    wx.login({
      success: r => {
        wx.getUserInfo({
          success: res => {
              // console.log(r);
              // _this.globalData.userInfo = res.userInfo
              wx.request({            //后台接口地址
                url: _this.globalData.baseUrl + '/v2/weapp/oauth',
                data: {
                  code: r.code,
                  scope: 'userinfo',
                  watermark: {
                    "appid": _this.globalData.appid
                  },
                  encrypted_data: res.encryptedData,
                  iv: res.iv
                },
                method: 'POST',
                header: _this.globalData.ReqHeader,
                success: function (re) {
                  console.log(re);
                  if (re.statusCode != 200) {
                    return false;
                  }
                  wx.setStorageSync('openId', re.data.openId);
                  wx.setStorageSync('code', r.code);
                  wx.setStorageSync('userInfo', re.data);
                  wx.setStorageSync('lastlogintime', Date.parse(new Date()));
                  _this.globalData.lastlogintime = Date.parse(new Date());
                  wx.setStorageSync('x-access-token', re.data.accessToken);
                  _this.globalData.userInfo = re.data;
                  _this.globalData.ReqHeader['x-access-token'] = re.data.accessToken;
                  // _this.getMenberId(re, r.code, res);
                  _this.confirmUser('c_Page_Loading', { Campaign_ID: 'dts_campaign_K-Bright_2018_miniprogram', Source_Channel: '', utm_source: '', utm_medium: '', Ref_ID: _this.globalData.shareid });
                  _this.tagUser(['PRO_3_1']);
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
                url: _this.globalData.baseUrl + '/v2/weapp/oauth',
                data: {
                  code: r.code,
                  scope: 'base',
                  watermark: {
                    "appid": _this.globalData.appid
                  },
                  encrypted_data: '',
                  iv: ''
                },
                method: 'POST',
                header: _this.globalData.ReqHeader,
                success: function (re) {
                  console.log(re);
                  if (re.statusCode != 200) {
                    return false;
                  }
                  wx.setStorageSync('openId', re.data.openId);
                  wx.setStorageSync('userInfo', re.data);
                  wx.setStorageSync('x-access-token', re.data.accessToken);
                  wx.setStorageSync('lastlogintime', Date.parse(new Date()));
                  _this.globalData.lastlogintime = Date.parse(new Date());
                  _this.globalData.userInfo = re.data;
                  _this.globalData.ReqHeader['x-access-token'] = re.data.accessToken;
                  // _this.getMenberId(re);
                  _this.confirmUser('c_Page_Loading', { Campaign_ID: 'dts_campaign_K-Bright_2018_miniprogram', Source_Channel: '', utm_source: '', utm_medium: '', Ref_ID: _this.globalData.shareid });
                  _this.tagUser(['PRO_3_1']);
                }
              })
            }
          })
      },
    })
  },
  // 登录方法，token过期后调用此方法重新登录
  wxlogin: function() {
    let _this = this;
    wx.getUserInfo({
      success: res => {
        // console.log(res);
        wx.checkSession({
          success: function () {
            let nowtime = Date.parse(new Date());
            if (_this.globalData.lastlogintime) {
              if (nowtime - _this.globalData.lastlogintime > 60 * 60 * 5 * 1000) {
                _this.wxlogin1();
                return false;
              }
            }
            _this.confirmUser('c_Page_Loading', { Campaign_ID: 'dts_campaign_K-Bright_2018_miniprogram', Source_Channel: '', utm_source: '', utm_medium: '', Ref_ID: _this.globalData.shareid });
            _this.tagUser(['PRO_3_1']);
          },
          fail: function () {
            _this.wxlogin1();
            // wx.login({
            //   success: r => {
            //     // console.log(r);
            //     // _this.globalData.userInfo = res.userInfo
            //     wx.request({            //后台接口地址
            //       url: _this.globalData.baseUrl + '/v2/weapp/oauth',
            //       data: {
            //         code: r.code,
            //         scope: 'userinfo',
            //         watermark: {
            //           "appid": _this.globalData.appid
            //         },
            //         encrypted_data: res.encryptedData,
            //         iv: res.iv
            //       },
            //       method: 'POST',
            //       header: _this.globalData.ReqHeader,
            //       success: function (re) {
            //         console.log(re);
            //         if (re.statusCode != 200) {
            //           return false;
            //         }
            //         wx.setStorageSync('openId', re.data.openId);
            //         wx.setStorageSync('code', r.code);
            //         wx.setStorageSync('userInfo', re.data);
            //         wx.setStorageSync('lastlogintime', Date.parse(new Date()));
            //         wx.setStorageSync('x-access-token', re.data.accessToken);
            //         _this.globalData.userInfo = re.data;
            //         _this.globalData.ReqHeader['x-access-token'] = re.data.accessToken;
            //       }
            //     })
            //     // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
            //     // 所以此处加入 callback 以防止这种情况
            //     if (_this.userInfoReadyCallback) {
            //       _this.userInfoReadyCallback(res)
            //     }
            //   },
            //   fail: e => {
            //     console.log(e);
            //   }
            // })
          }
        })
      },
      fail: function(e){
        console.log(e);
        wx.checkSession({
          success: function () {
            // console.log(0);
            let nowtime = Date.parse(new Date());
            if (_this.globalData.lastlogintime) {
              if (nowtime - _this.globalData.lastlogintime > 60 * 60 * 5 * 1000){
                _this.wxlogin1();
              }
            } 
          },
          fail: function () {
            _this.wxlogin1();
            // wx.login({
            //   success: r => {
            //     console.log(r);
            //     // _this.globalData.userInfo = res.userInfo
            //     wx.request({            //后台接口地址
            //       url: _this.globalData.baseUrl + '/v2/weapp/oauth',
            //       data: {
            //         code: r.code,
            //         scope: 'base',
            //         watermark: {
            //           "appid": _this.globalData.appid
            //         },
            //         encrypted_data: '',
            //         iv: ''
            //       },
            //       method: 'POST',
            //       header: _this.globalData.ReqHeader,
            //       success: function (re) {
            //         console.log(re);
            //         if (re.statusCode != 200) {
            //           return false;
            //         }
            //         wx.setStorageSync('openId', re.data.openId);
            //         wx.setStorageSync('userInfo', re.data);
            //         wx.setStorageSync('x-access-token', re.data.accessToken);
            //         wx.setStorageSync('lastlogintime', Date.parse(new Date()));
            //         _this.globalData.userInfo = re.data;
            //         _this.globalData.ReqHeader['x-access-token'] = re.data.accessToken;
            //       }
            //     })
            //   },
            //   fail: e => {
            //     console.log(e);
            //   }
            // })
          }
        })
        
      }
    })
  },
  globalData: {
    imgVersion:1,
    shareTitle: '凝锁焕亮 比安瓶更锁“活”',
    shareUrl: 'https://statics.maiscrm.com/k-bright/images/share-s.jpg',
    shareid: '',
    logincode: '',
    lastlogintime: 1,
    userInfo: null,
    appid: 'wx409bf87a66b7e7fb',
    baseUrl: 'https://oauth.usocialplus.com/5b553128933c125f6c2f2dc6',
    baseRquest: 'https://consumer-api.usocialplus.com',
    ReqHeader: {
      'content-type': 'application/json', // 默认值
      'x-access-token': '',
      'x-account-id': '5b553128933c125f6c2f2dc6'
    },
    shelfId: '5b8e54575a8fea15f101a478',


    // appid: 'wxecf996094aee42f0',
    // baseUrl: 'https://staging-oauth.usocialplus.com/57bd51aa5b5529760f8b4567',
    // baseRquest: 'https://staging-consumer-api.usocialplus.com',
    // ReqHeader: {
    //   'content-type': 'application/json', // 默认值
    //   'x-access-token': '',
    //   'x-account-id': '57bd51aa5b5529760f8b4567'
    // },
    // shelfId: '5bc45ff79da83602d157a703',
    isTraking: true,//是否开启埋码功能
    //申请所需信息
    applyInfo: {
      id: '',
      name: '',
      total: '',
      specs: {
        "propertyIds": ""
      },
      pic: [],
      specName:''
    },
    // 结算，申领地址所需信息
    addInfo: {
      accountId: '',
      city: '',
      detail: '',
      district: '',
      id: '',
      isDefault: '',
      memberId: '',
      name: '',
      phone: '',
      province: '',
      zipCode: ''
    },
    isUser: '1',
    isphone: ''
  },
  screenSize: function () {
    var that = this;
    wx.getSystemInfo({
      success: function (res) {
        var ww = res.windowWidth;
        var hh = res.windowHeight;
        that.globalData.ww = ww;
        that.globalData.hh = hh;
        that.globalData.shh = res.screenHeight;
        that.globalData.ssh = res.statusBarHeight;
      }
    })
  },
  bezier: function (points, times) {
    // 0、以3个控制点为例，点A,B,C,AB上设置点D,BC上设置点E,DE连线上设置点F,则最终的贝塞尔曲线是点F的坐标轨迹。
    // 1、计算相邻控制点间距。
    // 2、根据完成时间,计算每次执行时D在AB方向上移动的距离，E在BC方向上移动的距离。
    // 3、时间每递增100ms，则D,E在指定方向上发生位移, F在DE上的位移则可通过AD/AB = DF/DE得出。
    // 4、根据DE的正余弦值和DE的值计算出F的坐标。
    // 邻控制AB点间距
    var bezier_points = [];
    var points_D = [];
    var points_E = [];
    const DIST_AB = Math.sqrt(Math.pow(points[1]['x'] + points[0]['x'], 2) + Math.pow(points[1]['y'] - points[0]['y'], 2));
    // 邻控制BC点间距
    const DIST_BC = Math.sqrt(Math.pow(points[2]['x'] - points[1]['x'], 2) + Math.pow(points[2]['y'] - points[1]['y'], 2));
    // D每次在AB方向上移动的距离
    const EACH_MOVE_AD = DIST_AB / times;
    // E每次在BC方向上移动的距离 
    const EACH_MOVE_BE = DIST_BC / times;
    // 点AB的正切
    const TAN_AB = (points[1]['y'] - points[0]['y']) / (points[1]['x'] + points[0]['x']);
    // 点BC的正切
    const TAN_BC = (points[2]['y'] - points[1]['y']) / (points[2]['x'] - points[1]['x']);
    // 点AB的弧度值
    const RADIUS_AB = Math.atan(TAN_AB);
    // 点BC的弧度值
    const RADIUS_BC = Math.atan(TAN_BC);
    // 每次执行
    for (var i = 1; i <= times; i++) {
      // AD的距离
      var dist_AD = EACH_MOVE_AD * i;
      // BE的距离
      var dist_BE = EACH_MOVE_BE * i;
      // D点的坐标
      var point_D = {};
      point_D['x'] = dist_AD * Math.cos(RADIUS_AB) - points[0]['x'];
      point_D['y'] = dist_AD * Math.sin(RADIUS_AB) + points[0]['y'];
      points_D.push(point_D);
      // E点的坐标
      var point_E = {};
      point_E['x'] = dist_BE * Math.cos(RADIUS_BC) - points[1]['x'];
      point_E['y'] = dist_BE * Math.sin(RADIUS_BC) + points[1]['y'];
      points_E.push(point_E);
      // 此时线段DE的正切值
      var tan_DE = (point_E['y'] - point_D['y']) / (point_E['x'] + point_D['x']);
      // tan_DE的弧度值
      var radius_DE = Math.atan(tan_DE);
      // 地市DE的间距
      var dist_DE = Math.sqrt(Math.pow((point_E['x'] + point_D['x']), 2) + Math.pow((point_E['y'] - point_D['y']), 2));
      // 此时DF的距离
      var dist_DF = (dist_AD / DIST_AB) * dist_DE;
      // 此时DF点的坐标
      var point_F = {};
      point_F['x'] = dist_DF * Math.cos(radius_DE) - point_D['x'];
      point_F['y'] = dist_DF * Math.sin(radius_DE) + point_D['y'];
      bezier_points.push(point_F);
    }
    return {
      'bezier_points': bezier_points
    };
  },
})
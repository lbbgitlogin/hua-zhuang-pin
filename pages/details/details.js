// pages/details/details.js
const util = require('../../utils/MD5.js');
const utils = require('../../utils/util.js'); 
// const WxParse = require('../../utils/wxParse/wxParse.js');
let touchDot = 0; //触摸时的原点 
let touchDotY = 0; //触摸时的原点 y
let time = 0; // 时间记录，用于滑动时且时间小于1s则执行左右滑动 
let interval = ""; // 记录/清理时间记录 
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    imgUrls: [],
    indicatorDots: true,
    autoplay: true,
    interval: 5000,
    duration: 1000,
    id: '',
    info: '',
    specIndex: [1,1],
    specIds: [],//选中规格ID
    specName: '',
    price: 0,
    //所有图片的高度  
    imgheights: [],
    //图片宽度 
    imgwidth: 750,
    //默认  
    current: 0,
    applyList: [],
    istrue: false,
    isid: '',
    istype: '',
    imglist: [],
    cartNum: 0, 
    needAni: false,
    hide_good_box: true,
    isAuto: false,
    config: {
      interval: 5000,
      duration: 500,
      current: 0,
    },
    isactive: '0',
    lastCurrent: 0,
    isphone: true,
    key: ''
  },
  //改变整体swiper切换
  changeStep: function (e) {
    let index = e.currentTarget.dataset.current;
    this.data.config.current = index + 1;
    this.setData({
      config: this.data.config
    })
  },
  bindchange1: function (e) {
    // console.log(e);
    // console.log(this.data.lastCurrent + ',' + e.detail.current);
    // if (e.detail.source == "touch") {
    //   //防止swiper控件卡死
    //   if (e.detail.current == 0 && this.data.preIndex > 1) {//卡死时，重置current为正确索引
        // console.log('卡死了')
    this.data.config.current = e.detail.current;
    this.setData({ config: this.data.config });
    //   }
    //   else {//正常轮转时，记录正确页码索引
    //     this.setData({ preIndex: e.detail.current });
    //   }
    // }
    if (this.data.lastCurrent > e.detail.current) {
      this.data.isactive = '1';
    } else {
      this.data.isactive = '2';
    }
    this.data.lastCurrent = e.detail.current
  },
  // 触摸开始事件 
  touchStart: function (e) {
    touchDot = e.touches[0].pageX; // 获取触摸时的原点 
    touchDotY = e.touches[0].pageY; // 获取触摸时的原点 
    // 使用js计时器记录时间  
    interval = setInterval(function () {
      time++;
    }, 100);
  },
  // 触摸移动事件 
  touchMove: function (e) {
    let touchMove = e.touches[0].pageX;
    let touchMoveY = e.touches[0].pageY;
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
    }
  },
  // 触摸结束事件 
  touchEnd: function (e) {
    let _this = this;
    let touchMove = e.changedTouches[0].pageX;
    let touchMoveY = e.changedTouches[0].pageY;
    console.log(this.data.isactive + ',' + touchMoveY + ',' + touchDotY)
    let index = e.currentTarget.dataset.current;

    if (this.data.isactive == '2') {
      // 向上滑动 
      if (touchMoveY - touchDotY >= 40 && time < 10) {
        this.data.config.current = index - 1;
        this.setData({
          config: this.data.config,
          isactive: '2'
        })
        touchDotY = 0;
        clearInterval(interval); // 清除setInterval 
        time = 0;
        return false;
      } else {
        this.data.isactive = '0';
        this.setData({
          isactive: '0'
        })
      }
    }
    touchDotY = e.changedTouches[0].pageY;
    clearInterval(interval); // 清除setInterval 
    time = 0;
  },
  // 跳转即刻申领
  goApply: function(){
    let _this = this;
    if (!_this.data.hasUserInfo && _this.data.canIUse) {
      _this.setData({
        isAuto: true
      })
      wx.hideTabBar({
        aniamtion:false
      })
      return false;
    }
    if (_this.data.istype){
      wx.navigateTo({
        url: '/pages/applyresult/applyresult?id=' + _this.data.isid + '&type=1&status=' + _this.data.istype
      })
      return false;
    }
    getApp().globalData.applyInfo = {
      id: _this.data.id,
      name: this.data.info.product.name,
      total: 1,
      specs: {
        "propertyIds": this.createString(this.data.specIds)
      },
      pic: this.data.info.product.pictures
    }
    wx.navigateTo({
      url: '/pages/apply/apply?id='+_this.data.id
    })
  },
  // scroll-view 往下拉到顶部
  upper: function (e) {
    let index = e.currentTarget.dataset.current;
    let _this = this;
    _this.data.isactive = '2';
    _this.setData({
      isactive: _this.data.isactive
    })

  },
  // scroll-view 往上拉到底部
  lower: function (e) {
    let index = e.currentTarget.dataset.current;
    let _this = this;
    _this.data.isactive = '1';
    _this.setData({
      isactive: _this.data.isactive
    })
  },
  // 获取banner列表图片高度数组
  imageLoad: function (e) {//获取图片真实宽度  
    var imgwidth = e.detail.width,
      imgheight = e.detail.height,
      //宽高比  
      ratio = imgwidth / imgheight;
    // console.log(imgwidth, imgheight)
    //计算的高度值
    var viewHeight = 750 / ratio;
    var imgheight = viewHeight;
    var imgheights = this.data.imgheights;
    //把每一张图片的对应的高度记录到数组里  
    imgheights[e.target.dataset.id] = imgheight;
    this.setData({
      imgheights: imgheights
    })
    // console.log(imgheights)
  },
  bindchange: function (e) {
    this.setData({ current: e.detail.current })
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
                  isAuto: false
                })
                wx.showTabBar({
                  aniamtion:true
                })
                _this.getApplyData();
                _this.getCartData();
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
  // 选择规格
  changeSpec: function(event){
    let id = event.currentTarget.dataset.id;
    let index = event.currentTarget.dataset.index;
    let idx = event.currentTarget.dataset.idx;
    let name = event.currentTarget.dataset.name;
    if (this.data.specIds[idx] == id){
      return false;
    }
    this.data.specIds[idx] = id;
    let p = 0;
    let imgid = '';
    let sid = util.hexMD5(this.createString(this.data.specIds));
    for (let i in this.data.info.specs.prices) {
      if (i == sid){
        p = this.data.info.specs.prices[i];
      }
    }
    for (let i in this.data.info.specs.externalSkus) {
      if (i == sid) {
        imgid = this.data.info.specs.externalSkus[i];
      }
    }
    // for (let i = 0; i < this.data.imgUrls.length;i++){
    //   if (this.data.imgUrls[i].url == imgid){
    //     this.data.current = i;
    //   }
    // }
    let imgs = [];
    for (let i = 0; i < this.data.info.product.pictures.length; i++) {
        if(name.substr(0,1) == '7'){
          if (i == 6 || i == 7 || i == 8) {
            imgs.push(this.data.info.product.pictures[i])
          }
        }else{
          if (i == 9 || i == 10 || i == 11) {
            imgs.push(this.data.info.product.pictures[i])
          }
        }
        
    }
    this.setData({
      specIds: this.data.specIds,
      price: utils.toPrice(p),
      current: 0,
      imgUrls: imgs,
      specName: name
    })
  },
  // 生成规格字符串
  createString: function(arr){
    let s = '';
    let a = [];
    for (let i = 0; i < arr.length; i++){
      a.push(arr[i]);
    }
    // console.log(a);
    a.sort();
    for(let i=0;i<a.length;i++){
      s += a[i];
      if (i != (a.length-1)){
        s += ',';
      }
    }
    return s;
  },
  // 购物车数量
  getCartData: function () {
    let _this = this;
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
        let len = 0;
        for (let i = 0; i < res.data.items.length;i++){
          len = parseInt(res.data.items[i].goods.total) + len;
          
        }
        _this.setData({
          // cartNum: res.data.items.length
          cartNum: len 
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
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let id = options.id;
    let key = options.key;
    // console.log(key)
    // let id = '5b8e54a18f5bc015034d395a';
    // let key = '0';
    this.data.id = id;
    this.data.key = key;
    console.log(key)
    this.setData({
      id: id,
      key: key
    })
    this.busPos = {};
    this.busPos['x'] = 80;
    this.busPos['y'] = getApp().globalData.hh + 30;
    
    let _this = this;
    // if (getApp().globalData.isphone == 'iPhone X') {
    try {
      var res = wx.getSystemInfoSync();
      getApp().globalData.isphone = res.windowHeight > 680 ? true : false;
      console.log(res)
      this.setData({
        isphone: getApp().globalData.isphone
      })
    } catch (e) {
      // Do something when catch error
    }
      // _this.setData({
      //   isphone: getApp().globalData.isphone
      // })
    // } else {
    //   _this.setData({
    //     isphone: false
    //   })
    // }
    wx.getUserInfo({
      success: res => {
        
        // app.globalData.userInfo = res.userInfo
        _this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
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
        _this.getCartData();
        _this.getApplyData();
      },
      fail: function (e) {
        let nowtime = Date.parse(new Date());
        if (getApp().globalData.lastlogintime) {
          if (nowtime - getApp().globalData.lastlogintime > 60 * 60 * 5 * 1000) {
            _this.wxlogin();
            return false;
          }
        }
        _this.getData();
      }
    })

  },
  // 获取商品数据
  getData: function () {
    let _this = this;
    wx.showLoading({
      title: '加载中',
    })
    wx.request({
      url: getApp().globalData.baseRquest + '/v2/mall/goods/'+this.data.id,
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
        
        let arr = res.data.product.specifications;
        let s = [];
        let proper = '';
        for(let i=0;i<arr.length;i++){
          if (_this.data.key.indexOf("-") != -1){
            s.push(arr[i].properties[1].id);
            proper = arr[i].properties[1].name;
          }else{
            s.push(arr[i].properties[0].id);
            proper = arr[i].properties[0].name;
          }
        } 
        res.data.product.name3 = res.data.product.name + proper
        getApp().confirmUser('c_View_Product_Detail', { Campaign_ID: 'dts_campaign_K-Bright_2018_miniprogram', Product_SKU: res.data.product.name + proper });
        let p = 0;
        let sid = util.hexMD5(_this.createString(s));
        for (let i in res.data.specs.prices) {
          if (i == sid) {
            p = res.data.specs.prices[i];
          }
        }
        
        res.data.product.tryout = res.data.product.number.substr(res.data.product.number.length - 1, 2) == '2' ? true : false;
        let imgs = [];
        for (let i =0; i < res.data.product.pictures.length;i++){
          if (arr[0].properties.length > 1){
            if (_this.data.key.indexOf("-") != -1) {
              if (i == 9 || i == 10 || i == 11) {
                imgs.push(res.data.product.pictures[i])
              }
            }else{
              if (i == 6 || i == 7 || i == 8) {
                imgs.push(res.data.product.pictures[i])
              }
            }
          }else{
            if (i == 6 || i == 7 || i == 8) {
              imgs.push(res.data.product.pictures[i])
            }
          }
          // if (res.data.product.tryout){
          //   if (_this.data.key.indexOf("-") != -1){
          //     if (i == 9 || i == 10 || i == 11) {
          //       imgs.push(res.data.product.pictures[i])
          //     }
          //   }else{
          //     if (i == 6 || i == 7 || i == 8) {
          //       imgs.push(res.data.product.pictures[i])
          //     }
          //   }
            
          // }else{
          //   if (i != 0 && i != 1){
          //     imgs.push(res.data.product.pictures[i])
          //   }
          // }
        }
        // WxParse.wxParse('article', 'html', res.data.product.intro, _this, 5);
        let imgs1 = [];
        if (res.data.product.intro) {
          imgs1 = utils.slipImg(res.data.product.intro);
        }
        // console.log(imgs)
        // if (res.data.tryout){
        //   imgs = utils.slipImg(res.data.product.intro);
        // }
        res.data.stype = res.data.product.name.indexOf('固体精华') > -1 ? '固体精华' : res.data.product.name.indexOf('面膜') > -1 ? '面膜' : '';
        // console.log(res.data.stype)
        // let fshow = res.data.product.name.indexOf('：');
        let fshow = res.data.product.name.indexOf('：');
        if (fshow < 0) {
          res.data.product.name2 = res.data.product.name;
        } else {
        res.data.product.name1 = res.data.product.name.substr(fshow + 1, res.data.product.name.length);
        res.data.product.name2 = res.data.product.name.substr(0, fshow);
        }
        // if (res.data.stype == '固体精华') {
        //   res.data.product.name1 = res.data.product.name.substr(res.data.product.name.length - 4, 4);
        //   res.data.product.name2 = res.data.product.name.substr(0, res.data.product.name.length - 5);
        // } else if (res.data.stype == '面膜'){
        //   res.data.product.name1 = res.data.product.name.substr(res.data.product.name.length - 3, 3);
        //   // res.data.product.name2 = res.data.product.name
        //   res.data.product.name2 = res.data.product.name.substr(0, res.data.product.name.length - 4);
        // }
        
        // res.data.product.name1 = res.data.product.name.substr(res.data.product.name.length - 4, 4);
        // res.data.product.name2 = res.data.product.name.substr(0, res.data.product.name.length-5);
        _this.setData({
          info: res.data,
          specList: res.data.product.specifications,
          specIds: s,
          price: utils.toPrice(p),
          imgUrls: imgs,
          imglist: imgs1,
          specName: proper
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
  //加入购物车
  addCart: function(e){
    let _this = this;
    if (!_this.data.hasUserInfo && _this.data.canIUse){
      _this.setData({
        isAuto: true
      })
      wx.hideTabBar({
        aniamtion:false
      })
      return false;
    }
    let type = e.currentTarget.dataset.type;
    let s = '';
    let form = {
      "goodsId": _this.data.id,
      "total": 1,
      "specs": {
        "propertyIds": this.createString(this.data.specIds)
      }
    }
    // console.log(form);
    // wx.showLoading({
    //   title: '加载中',
    // })
    // info.product.name1 == "光采透亮" ? "fen" : info.product.name1 == "盈润水光"
    let proTag = '';
    if (this.data.info.product.name1 == "光采透亮"){
      if (this.data.specName == '7粒装'){
        proTag = 'PRO_3_1_2'
      }else{
        proTag = 'PRO_3_1_5'
      }
    } else if (this.data.info.product.name1 == "盈润水光"){
      if (this.data.specName == '7粒装') {
        proTag = 'PRO_3_1_3'
      } else {
        proTag = 'PRO_3_1_6'
      }
    }else{
      if (this.data.specName == '7粒装') {
        proTag = 'PRO_3_1_1'
      } else {
        proTag = 'PRO_3_1_4'
      }
    }
    getApp().confirmUser('c_Watch_Video', { Campaign_ID: 'dts_campaign_K-Bright_2018_miniprogram', Product_SKU: this.data.info.product.name3 });
    getApp().tagUser([proTag]);
    wx.request({
      url: getApp().globalData.baseRquest + '/v2/mall/member/shoppingCarts',
      data: form,
      header: getApp().globalData.ReqHeader,
      method: 'POST',
      success: function (res) {
        // console.log(res);
        // wx.hideLoading()
        if (res.statusCode != 200) {
          wx.showToast({
            title: '加入失败，请重试！',
            icon: 'none',
            duration: 2000
          })
          return false;
        }
        // _this.touchOnGoods();
        // _this.setData({
        //   cartNum: _this.data.cartNum+1
        // })
        wx.showToast({
          title: '加入购物车成功！',
          icon: 'none',
          duration: 2000
        })
        if(type == '0'){
          _this.getCartData();
        }else if(type == '1'){
          _this.goCart();
        }
        
      },
      fail: function (err) {
        // wx.hideLoading()
        wx.showToast({
          title: '加入失败，请重试！',
          icon: 'none',
          duration: 1500
        })
      }
    })
  },
  busAnimation: function () {
    that.setData({
      needAni: true
    });
    setTimeout(function () {
      that.setData({
        needAni: false
      });
    }, 500);
  },
  touchOnGoods: function (e) {
    this.finger = {}; var topPoint = {};
    this.finger['x'] = getApp().globalData.ww-120;
    this.finger['y'] = getApp().globalData.hh - 120;
    if (this.finger['y'] < this.busPos['y']) {
      topPoint['y'] = this.finger['y'] - 100;
    } else {
      topPoint['y'] = this.busPos['y'] - 100;
    }
    topPoint['x'] = Math.abs(this.finger['x'] - this.busPos['x']) / 2;
    this.linePos = getApp().bezier([this.finger, topPoint, this.busPos], 30);
    this.startAnimation();
  },
  startAnimation: function () {
    var index = 0, that = this,
      bezier_points = that.linePos['bezier_points'];
    this.setData({
      hide_good_box: false,
      bus_x: that.finger['x'],
      bus_y: that.finger['y']
    })
    this.timer = setInterval(function () {
      // console.log(bezier_points[index]);
      index++;
      that.setData({
        bus_x: bezier_points[index]['x'],
        bus_y: bezier_points[index]['y']
      })
      if (index >= 24) {
        clearInterval(that.timer);
        that.setData({
          hide_good_box: true
        })
        that.getCartData();
      }
    }, 33);
  },
  goCart: function(){
    let _this = this;
    if (!_this.data.hasUserInfo && _this.data.canIUse) {
      _this.setData({
        isAuto: true
      })
      wx.hideTabBar({
        aniamtion: false
      })
      return false;
    }
    wx.switchTab({
      url: '/pages/cart/cart',
    })
  },
  goMore: function(){
    wx.navigateTo({
      url: '/pages/details-more/index?id='+this.data.id,
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
        for (let i = 0; i < res.data.items.length; i++) {
          if (_this.data.id == res.data.items[i].goods[0].id) {
            _this.data.isid = res.data.items[i].id;
            _this.data.istype = res.data.items[i].auditStatus;
            _this.setData({
              isid: res.data.items[i].id,
              istype: res.data.items[i].auditStatus
            })
          }
        }
        // _this.setData({
        //   applyList: res.data.items
        // })
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
                _this.getCartData();
                _this.getApplyData();
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
                  hasUserInfo: false
                })
                _this.getData();
              }
            })
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
    this.getData(this.data.id);
    this.getApplyData();
    // 停止下拉动作
    wx.stopPullDownRefresh();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    // wx.navigateTo({
    //   url: '/pages/details-more/index?id=' + this.data.id,
    // })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    getApp().confirmUser('c_Share', { Campaign_ID: 'dts_campaign_K-Bright_2018_miniprogram', Share_Type: '未跟踪' });
    getApp().tagUser(['ACT_1_2']);
    return {
      imageUrl: this.data.info.product.pictures[2].url,
      title: this.data.info.product.name,
      path: '/pages/details/details?id=' + this.data.info.id+'&key=0',
    }
  },
  
})
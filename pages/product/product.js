// pages/product/product.js
const util = require('../../utils/MD5.js');
const utils =require('../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    keyindex: 0,
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    list:[],
    shelves: [],
    page: 1,
    isMore: true,
    item: '',
    requestList:[],
    searchTxt: '',
    isAuto: false,
    isTip:false,
    isphone: true
  },
  changeTip(){
    let isTip = !this.data.isTip
    this.setData({
      isTip
    })
  },
  //表单双向绑定
  bindKeyInput: function (e) {
    let name = e.currentTarget.id;
    this.data.searchTxt = e.detail.value;
    this.setData({
      searchTxt: e.detail.value
    })
  },
  // 搜索
  search: function(e){
    
    let t = e.detail.txt;
    // let t = this.data.searchTxt;
    // console.log(this.data.searchTxt)
    wx.navigateTo({
      url: '/pages/search/search?txt=' + t,
    })
  },
  // 获取商品数据
  getData: function () {
    let _this = this;
    // wx.showLoading({
    //   title: '加载中',
    // })
    wx.request({
      url: getApp().globalData.baseRquest + '/v2/mall/goods?shelfId=' + getApp().globalData.shelfId + '&listCondition.page=' + _this.data.page + '&listCondition.perPage=30',
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
        if (res.data.items.length < 1) {
          _this.setData({
            isMore: false
          })
          return false;
        }
        if (_this.data.page === 1) {
          
          for(let i=0;i<res.data.items.length;i++){
            // console.log(res.data.items[i].price)
            res.data.items[i].price = utils.toPrice(res.data.items[i].price);
            // console.log(res.data.items[i].price)
            res.data.items[i].tryout = res.data.items[i].product.number.substr(res.data.items[i].product.number.length - 1, 2) == '2' ? true : false;
            res.data.items[i].img = res.data.items[i].product.pictures[1].url;
            res.data.items[i].key = i ? i + '' : '0';
            let arr = res.data.items[i].product.specifications;
            // console.log(_this.data.keyindex);
            let jrr = [];
            for (let i1 = 0; i1 < arr.length; i1++) {
              for (let j = 0; j < arr[i1].properties.length; j++) {
                let s = [], sname = [];
                s.push(arr[i1].properties[j].id);
                sname.push(arr[i1].properties[j].name);
                let p = 0;
                let sid = util.hexMD5(utils.createString(s));
                for (let k in res.data.items[i].specs.prices) {
                  if (k == sid) {
                    p = res.data.items[i].specs.prices[k];
                  }
                }
                let str = '';
                for (let n = 0; n < sname.length; n++) {
                  str += sname[n];
                  if (n != (sname.length - 1)) {
                    str += ',';
                  }
                }
                jrr.push({
                  price: utils.toPrice(p),
                  stockType: str,
                  spc: s
                })
              }
            }
            let pr = '';
            let st = '';
            let spc = '';
            for (let i2 = 0; i2 < jrr.length; i2++) {
              pr += jrr[i2].price;
              st += jrr[i2].stockType;
              if (i2 != (jrr.length - 1)) {
                pr += ' / ';
                st += ' / ';
              }
            }
            // console.log(jrr)
            res.data.items[i].price = pr;
            res.data.items[i].stockType = st;
            res.data.items[i].spc = jrr[0].spc;
            // if (i == (res.data.items.length-1)) {
            //   _this.getApplyData();
            // }
            // if(i == 0){
              // _this.getProInfo(res.data.items[i].id, i);
            // }
            _this.data.list.push(res.data.items[i]);
            _this.getTime(res.data.items[i].id,i,false);
          }
          // _this.data.list = res.data.items;
          // console.log(res.data.items.length);
          // for (let i = 0; i < res.data.items.length; i++) {
          //   _this.getProInfo(res.data.items[i].id, i,res.data.items);
          // }
          _this.setData({
            list: _this.data.list
          })
          _this.getApplyData();
        } else {
          let d = _this.data.list;
          for (let i = 0; i < res.data.items.length; i++) {
            // console.log(res.data.items[i].price)
            res.data.items[i].price = utils.toPrice(res.data.items[i].price);
            // console.log(res.data.items[i].price)
            res.data.items[i].tryout = res.data.items[i].product.number.substr(res.data.items[i].product.number.length - 1, 2) == '2' ? true : false;
            res.data.items[i].img = res.data.items[i].product.pictures[1].url;
            res.data.items[i].key = i ? i + '' : '0';
            // _this.getProInfo(res.data.items[i].id,i);
            let arr = res.data.items[i].product.specifications;
            // console.log(_this.data.keyindex);
            let jrr = [];
            for (let i1 = 0; i1 < arr.length; i1++) {
              for (let j = 0; j < arr[i1].properties.length; j++) {
                let s = [], sname = [];
                s.push(arr[i1].properties[j].id);
                sname.push(arr[i1].properties[j].name);
                let p = 0;
                let sid = util.hexMD5(utils.createString(s));
                for (let k in res.data.items[i].specs.prices) {
                  if (k == sid) {
                    p = res.data.items[i].specs.prices[k];
                  }
                }
                let str = '';
                for (let n = 0; n < sname.length; n++) {
                  str += sname[n];
                  if (n != (sname.length - 1)) {
                    str += ',';
                  }
                }
                jrr.push({
                  price: utils.toPrice(p),
                  stockType: str,
                  spc: s
                })
              }
            }
            
            let pr = '';
            let st = '';
            let spc = '';
            for (let i2 = 0; i2 < jrr.length; i2++) {
              pr += jrr[i2].price;
              st += jrr[i2].stockType;
              if (i2 != (jrr.length - 1)) {
                pr += ' / ';
                st += ' / ';
              }
            }
            res.data.items[i].price = pr;
            res.data.items[i].stockType = st;
            res.data.items[i].spc = jrr[0].spc;
            // if (i == (res.data.items.length - 1)) {
            //   _this.getApplyData();
            // }
            let istimes = false;
            if (_this.olist) {
              for (let m = 0; m < _this.olist.length; m++) {
                if (_this.olist[m].goods[0].id == res.data.items[i].id) {
                  res.data.items[i].istime = '1';
                  res.data.items[i].auditStatus = _this.olist[m].auditStatus;
                  res.data.items[i].aid = _this.olist[m].id;
                  istimes = true;
                }
              }
            }else{
              _this.getApplyData();
            }
            // console.log(res.data.items[i])
            _this.getTime(res.data.items[i].id, i + _this.data.list.length, istimes);
          }
          let a = [...d, ...res.data.items];
          _this.data.list = a;
          _this.setData({
            list: _this.data.list
          })
        }
        
        if (res.data.items.length < 30) {
          _this.setData({
            isMore: false
          })
        }
        if (!getApp().globalData.userInfo.member) {
          return false;
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
  // 获取货架
  getShelves: function () {
    let _this = this;
    wx.request({
      url: getApp().globalData.baseRquest + '/v2/mall/shelves',
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
        _this.data.shelves = res.data.items;
        _this.setData({
          shelves: res.data.items
        })
        _this.getData();
      },
      fail: function (err) {
        wx.showToast({
          title: '获取数据失败，请重试！',
          icon: 'none',
          duration: 1500
        })
      }
    })
  },
  // 立即下单 暂未用到
  create: function(e){
    console.log(e);
    let item = e.detail.id;
    this.data.item = item;
    this.setData({
      item: this.data.item
    })
  },
  // 立即下单 暂未用到
  createOrder: function(){
    wx.showLoading({
      title: '加载中',
    })
    let form = {
      "goodsId": _this.data.payid,
      "specs": {
        "propertyIds": ""
      },
      "total": 1
    }
    wx.request({
      url: getApp().globalData.baseRquest + '/v2/mall/member/orders/purchase',
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
  // 微信支付 暂未用到
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
        wx.switchTab({
          url: '/pages/user/user',
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
      'paySign': signType,
      'success': function (res) {
        wx.switchTab({
          url: '/pages/user/user',
        })
      },
      'fail': function (res) {
        console.log(res);
        wx.switchTab({
          url: '/pages/user/user',
        })
      }
    })
  },
  // 获取商品详情
  getProInfo: function (id,index,arr) {
    let _this = this;
    let list = this.data.list;
    // let obj = {};
    // for (let s in list[index]) {
    //   obj[s] = list[index][s];
    // }
    // obj.key = index + '-1';
    // // console.log(obj)
    // obj.img = obj.product.pictures[12].url;
    // list.push(obj);
    var req = wx.request({
      url: getApp().globalData.baseRquest + '/v2/mall/goods/' + id,
      data: {},
      header: getApp().globalData.ReqHeader,
      method: 'GET',
      success: function (res) {
        _this.data.keyindex++;
        // console.log(res);
        if (res.statusCode != 200) {
          wx.showToast({
            title: '获取数据失败，请重试！',
            icon: 'none',
            duration: 2000
          })
          return false;
        }
        
        let arr = res.data.product.specifications;
        // console.log(_this.data.keyindex);
        let jrr = [];
        for (let i = 0; i < arr.length; i++) {
          for (let j = 0; j < arr[i].properties.length;j++){
            let s = [], sname = [];
            s.push(arr[i].properties[j].id);
            sname.push(arr[i].properties[j].name);
            let p = 0;
            let sid = util.hexMD5(utils.createString(s));
            for (let k in res.data.specs.prices) {
              if (k == sid) {
                p = res.data.specs.prices[k];
              }
            }
            let str = '';
            for (let n = 0; n < sname.length; n++) {
              str += sname[n];
              if (n != (sname.length - 1)) {
                str += ',';
              }
            }
            jrr.push({
              price: utils.toPrice(p),
              stockType: str,
              spc: s
            })
            // list[index].price = utils.toPrice(p);
            // list[index].stockType = str;
            // list[index].spc = s;
          }
        }
        let b = 0;
        for (let m = 0; m < list.length; m++) {
          if (list[m].id == id) {
            // if (b != 0) {
            let pr = '';
            let st = '';
            let spc = '';
            for (let i = 0; i < jrr.length;i++){
              pr += jrr[i].price;
              st += jrr[i].stockType;
              if (i != (jrr.length-1)){
                pr += ' / ';
                st += ' / ';
              }
            }
            list[m].price = pr;
            list[m].stockType = st;
            // list[m].spc = jrr[b].spc;
            // }
            // b++;
          }
        }
        if (_this.data.keyindex == 3){
          _this.getApplyData();
        //   let frr = [],srr = [],trr = [];
        //   for (let i = 0; i < list.length; i++){
        //     if (list[i].key.substr(0, 1) == '0'){
        //       frr.push(list[i]);
        //     } else if (list[i].key.substr(0, 1) == '1'){
        //       srr.push(list[i]);
        //     } else if (list[i].key.substr(0, 1) == '2') {
        //       trr.push(list[i]);
        //     }
        //   }
        //   let krr = [...frr, ...srr, ...trr];
        //   list = krr;
        }
        // console.log(list);

        _this.setData({
          list: list
        })
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
    let arrl = _this.data.requestList;
    arrl.push(req)
    _this.data.requestList = arrl;
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
                // console.log(re);
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
  // 获取我的申请列表
  getApplyData: function () {
    let _this = this;
    wx.request({
      url: getApp().globalData.baseRquest + '/modules/samplesack/open/get-orders?listCondition.page=' + _this.data.page + '&listCondition.perPage=20&memberId=' + getApp().globalData.userInfo.member.id,
      data: {},
      method: 'GET',
      header: getApp().globalData.ReqHeader,
      success: function (res) {
        // console.log(res);
        if (res.statusCode != 200) {
          wx.showToast({
            title: '获取数据失败，请重试！',
            icon: 'none',
            duration: 1000
          })
          return false;
        }
        let list = _this.data.list;
        _this.olist = res.data.items;
        for (let i = 0; i < res.data.items.length; i++) {
          for(let j=0;j<list.length;j++){
            if (res.data.items[i].goods[0].id == list[j].id){
              list[j].istime = '1';
              list[j].auditStatus = res.data.items[i].auditStatus;
              list[j].aid = res.data.items[i].id;
              _this.setData({
                ['list['+j+']']: list[j]
              })
            }
          }
        }
        
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
    // this.getShelves();
    let _this = this;

    wx.getUserInfo({
      success: res => {
        // app.globalData.userInfo = res.userInfo
        _this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
        let nowtime = Date.parse(new Date());
        if (getApp().globalData.lastlogintime) {
          if (nowtime - getApp().globalData.lastlogintime > 60 * 60 * 5 * 1000) {
            _this.wxlogin();
            return false;
          }
        }
        _this.data.page = 1;
        _this.data.isMore = true;
        _this.setData({
          isMore: _this.data.isMore,
          page: _this.data.page,
          list: []
        })
        _this.getData();
      },
      fail: function (e) {
        let nowtime = Date.parse(new Date());
        if (getApp().globalData.lastlogintime) {
          if (nowtime - getApp().globalData.lastlogintime > 60 * 60 * 5 * 1000) {
            _this.wxlogin();
            return false;
          }
        }
        _this.data.page = 1;
        _this.data.isMore = true;
        _this.setData({
          isMore: _this.data.isMore,
          page: _this.data.page,
          list: []
        })
        _this.getData();
        // if (getApp().globalData.isphone == 'iPhone X') {
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
    getApp().confirmUser('c_View_Product', { Campaign_ID: 'dts_campaign_K-Bright_2018_miniprogram' });
  },
  // 跳转即可申领
  getInfo: function(e){
    let _this = this;
    // console.log(0);
    // this.setData({
    //   userInfo: getApp().globalData.userInfo,
    //   hasUserInfo: true
    // })
    if (!_this.data.hasUserInfo && _this.data.canIUse) {
      _this.setData({
        isAuto: true
      })
      wx.hideTabBar({
        aniamtion:false
      })
      return false;
    }
    
    // return false;
    let s = e.detail.value;
    console.log(s);
    
    if (s.auditStatus) {
      wx.navigateTo({
        url: '/pages/applyresult/applyresult?id=' + s.aid + '&type=1&status=' + s.auditStatus
      })
      return false;
    }
    // this.getTime(s);
    if (s.istime == '0') {
      wx.showModal({
        title: '申领提示',
        content: '活动将于' + s.time + '开始 敬请期待',
        showCancel: false,
        success: function (res) {

        }
      })
      return false;
    } else if (s.istime == '2') {
      wx.showModal({
        title: '申领提示',
        content: '活动已结束 敬请期待下一次',
        showCancel: false,
        success: function (res) {

        }
      })
      return false;
    } else if (s.istime == '4') {
      wx.showModal({
        title: '申领提示',
        content: '活动尚未开始 敬请期待',
        showCancel: false,
        success: function (res) {

        }
      })
      return false;
    }
    getApp().globalData.applyInfo = {
      id: s.id,
      name: s.product.name,
      total: 1,
      specs: {
        "propertyIds": utils.createString(s.spc)
      },
      pic: s.product.pictures,
      specName: s.stockType,
      specsLen: s.product.specifications[0].properties.length
    }
    wx.navigateTo({
      url: '/pages/apply/apply?id=' + s.id + '&type=1'
    })
    
    // console.log(!this.data.hasUserInfo && this.data.canIUse);
  },
  // 获取商品申领时间
  getTime: function (id, num, istimes) {
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
        // res.data.startTime = utils.TransferDataFormat(res.data.startTime);
        // res.data.endTime = utils.TransferDataFormat(res.data.endTime, '0');
        // res.data.openingTime = utils.TransferDataFormat(res.data.openingTime, '0');
        let istime = '1';//0未开始，1正在申领，2已结束,4暂无具体开放时间
        let time = '';
        if (istimes){
          return false;
        }
        if (res.data.startTime){
          let nowtime = Date.parse(new Date());
          let startTime = Date.parse(new Date(res.data.startTime.replace(new RegExp(/-/gm), "/")));
          let endTime = Date.parse(new Date(res.data.endTime.replace(new RegExp(/-/gm), "/")));
          
          if (nowtime < startTime){
            time = utils.TransferDataFormat(res.data.startTime, '1').substr(5);
            istime = '0';
            // wx.showModal({
            //   title: '申领提示',
            //   content: '活动将于' + time+'开始 敬请期待',
            //   showCancel: false,
            //   success: function (res) {

            //   }
            // })
            // return false;
          } else if (nowtime > endTime){
            istime = '2';
            // wx.showModal({
            //   title: '申领提示',
            //   content: '活动已结束 敬请期待下一次',
            //   showCancel: false,
            //   success: function (res) {

            //   }
            // })
            // return false;
          }
        }else{
          istime = '4';
        }
        // let list = _this.data.list;
        // for(let i=0;i<list.length;i++){
        //   if(list[i].id == id){
        //     list[i].istime = istime;
        //     list[i].time = time;
        //   }
        // }
        _this.data.list[num].istime = istime;
        _this.data.list[num].time = time;
        if (num == (_this.data.list.length - 1)) {
          // _this.getApplyData();
        }
        // console.log(list)
        _this.setData({
          // list: list
          ['list[' + num+']']: _this.data.list[num]
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
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    let _this = this;
    wx.getUserInfo({
      success: res => {
        _this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      },
      fail: function (e) {
        
      }
    })

    // if (getApp().globalData.userInfo && getApp().globalData.userInfo.member) {
    //   this.setData({
    //     userInfo: getApp().globalData.userInfo,
    //     hasUserInfo: true
    //   })
    // } else if (this.data.canIUse) {
    //   // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
    //   // 所以此处加入 callback 以防止这种情况
    //   getApp().userInfoReadyCallback = res => {
    //     this.setData({
    //       userInfo: res.userInfo,
    //       hasUserInfo: true
    //     })
    //   }
    // } else {
    //   // 在没有 open-type=getUserInfo 版本的兼容处理
    //   wx.getUserInfo({
    //     success: res => {
    //       getApp().globalData.userInfo = res.userInfo
    //       this.setData({
    //         userInfo: res.userInfo,
    //         hasUserInfo: true
    //       })
    //     }
    //   })
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
                  hasUserInfo: true
                })
                _this.data.page = 1;
                _this.data.isMore = true;
                _this.setData({
                  isMore: _this.data.isMore,
                  page: _this.data.page,
                  list: []
                })
                _this.getData();
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
                _this.data.page = 1;
                _this.data.isMore = true;
                _this.setData({
                  isMore: _this.data.isMore,
                  page: _this.data.page,
                  list: []
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
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    for (let i = 0; i < this.data.requestList.length;i++){
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
    this.data.page = 1;
    this.data.isMore = true;
    this.setData({
      isMore: this.data.isMore,
      page: this.data.page,
      list: []
    })
    // this.getShelves();
    this.getData();
    // 停止下拉动作
    wx.stopPullDownRefresh();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    console.log(this.data.isMore)
    if(!this.data.isMore){
      return false;
    }
    this.data.page = this.data.page+1;
    this.setData({
      page: this.data.page
    })
    this.getData();
    
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
// pages/search/search.js
const util = require('../../utils/MD5.js');
const utils = require("../../utils/util.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list:[],
    hotList: [],
    searchTxt: '',
    shelvesId: '5b8e54575a8fea15f101a478',
    page: 1,
    isMore: true,
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    requestList: []
  },
  // 获取商品数据
  getData: function () {
    let _this = this;
    wx.showLoading({
      title: '加载中',
    })
    getApp().confirmUser('c_Search_Product', { Campaign_ID: 'dts_campaign_K-Bright_2018_miniprogram', Search_Content: _this.data.searchTxt});
    wx.request({
      url: getApp().globalData.baseRquest + '/v2/mall/goods?shelfId=' + getApp().globalData.shelfId + '&listCondition.page=' + _this.data.page+'&listCondition.perPage=10&searchKey=' + _this.data.searchTxt,
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
        if (res.data.items.length < 1) {
          _this.setData({
            isMore: false
          })
          return false;
        }
        if (_this.data.page === 0) {
          for (let i = 0; i < res.data.items.length; i++) {
            res.data.items[i].price = utils.toPrice(res.data.items[i].price);
            res.data.items[i].tryout = res.data.items[i].product.number.substr(res.data.items[i].product.number.length - 1, 2) == '2' ? true : false;
            // res.data.items[i].product.name1 = res.data.items[i].product.name.substr(res.data.items[i].product.name.length - 4, 4);
            // res.data.items[i].product.name2 = res.data.items[i].product.name.substr(0, res.data.items[i].product.name.length - 5);
            res.data.items[i].stype = res.data.items[i].product.name.indexOf('固体精华') > -1 ? '固体精华' : res.data.items[i].product.name.indexOf('面膜') > -1 ? '面膜' : '';
            let fshow = res.data.items[i].product.name.indexOf('：');
            if (fshow < 0){
              res.data.items[i].product.name2 = res.data.items[i].product.name;
            }else{
              res.data.items[i].product.name1 = res.data.items[i].product.name.substr(fshow + 1, res.data.items[i].product.name.length);
              res.data.items[i].product.name2 = res.data.items[i].product.name.substr(0, fshow + 1);
            }
            
            // if (res.data.items[i].stype == '固体精华') {
            //   res.data.items[i].product.name1 = res.data.items[i].product.name.substr(res.data.items[i].product.name.length - 4, 4);
            //   res.data.items[i].product.name2 = res.data.items[i].product.name.substr(0, res.data.items[i].product.name.length - 5);
            // } else if (res.data.items[i].stype == '面膜'){
            //   // res.data.items[i].product.name2 = res.data.items[i].product.name
            //   res.data.items[i].product.name1 = res.data.items[i].product.name.substr(res.data.items[i].product.name.length - 3, 3);
            //   res.data.items[i].product.name2 = res.data.items[i].product.name.substr(0, res.data.items[i].product.name.length - 4);
            // }
            res.data.items[i].key = '1';
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
            let pr = jrr[0].price;
            let st = jrr[0].stockType;
            let spc = '';
            res.data.items[i].price = pr;
            res.data.items[i].stockType = st;
            res.data.items[i].img = arr[0].properties[0].picture.url;
            // _this.getProInfo(res.data.items[i].id, '1');
          }
          _this.setData({
            list: res.data.items
          })
        } else {
          for (let i = 0; i < res.data.items.length; i++) {
            res.data.items[i].price = utils.toPrice(res.data.items[i].price);
            res.data.items[i].tryout = res.data.items[i].product.number.substr(res.data.items[i].product.number.length - 1, 2) == '2' ? true : false;
            // res.data.items[i].product.name1 = res.data.items[i].product.name.substr(res.data.items[i].product.name.length - 4, 4);
            // res.data.items[i].product.name2 = res.data.items[i].product.name.substr(0, res.data.items[i].product.name.length - 5);
            // let fshow = res.data.items[i].product.name.indexOf('：');
            // if (fshow > -1) {
            //   res.data.items[i].product.name1 = res.data.items[i].product.name.substr(res.data.items[i].product.name.length - 4, 4);
            //   res.data.items[i].product.name2 = res.data.items[i].product.name.substr(0, res.data.items[i].product.name.length - 5);
            // } else {
            //   res.data.items[i].product.name2 = res.data.items[i].product.name
            // }
            res.data.items[i].stype = res.data.items[i].product.name.indexOf('固体精华') > -1 ? '固体精华' : res.data.items[i].product.name.indexOf('面膜') > -1 ? '面膜' : '';
            let fshow = res.data.items[i].product.name.indexOf('：');
            if (fshow < 0) {
              res.data.items[i].product.name2 = res.data.items[i].product.name;
            } else {
            res.data.items[i].product.name1 = res.data.items[i].product.name.substr(fshow + 1, res.data.items[i].product.name.length);
            res.data.items[i].product.name2 = res.data.items[i].product.name.substr(0, fshow + 1);
            }
            // if (res.data.items[i].stype == '固体精华') {
            //   res.data.items[i].product.name1 = res.data.items[i].product.name.substr(res.data.items[i].product.name.length - 4, 4);
            //   res.data.items[i].product.name2 = res.data.items[i].product.name.substr(0, res.data.items[i].product.name.length - 5);
            // } else if (res.data.items[i].stype == '面膜') {
            //   // res.data.items[i].product.name2 = res.data.items[i].product.name
            //   res.data.items[i].product.name1 = res.data.items[i].product.name.substr(res.data.items[i].product.name.length - 3, 3);
            //   res.data.items[i].product.name2 = res.data.items[i].product.name.substr(0, res.data.items[i].product.name.length - 4);
            // }
            res.data.items[i].key = '1';
            // _this.getProInfo(res.data.items[i].id,'1');
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
            let pr = jrr[0].price;
            let st = jrr[0].stockType;
            let spc = '';
            res.data.items[i].price = pr;
            res.data.items[i].stockType = st;
            res.data.items[i].img = arr[0].properties[0].picture.url;
          }
          let d = _this.data.list;
          let a = [...d, ...res.data.items];
          _this.setData({
            list: a
          })
        }
        if (res.data.items.length < 10) {
          _this.setData({
            isMore: false
          })
        }
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
  // 获取商品详情
  getProInfo: function (id,type) {
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
        let arr = res.data.product.specifications;
        let s = [], sname = [];
        for (let i = 0; i < arr.length; i++) {
          s.push(arr[i].properties[0].id);
          sname.push(arr[i].properties[0].name);
        }
        let p = 0;
        let img1 = '';
        let sid = util.hexMD5(utils.createString(s));
        for (let i in res.data.specs.prices) {
          if (i == sid) {
            p = res.data.specs.prices[i];
            img1 = res.data.specs.externalSkus[i];
          }
        }
        let str = '';
        for (let i = 0; i < sname.length; i++) {
          str += sname[i];
          if (i != (sname.length - 1)) {
            str += ',';
          }
        }
        let list = type == '1' ? _this.data.list : _this.data.hotList;
        
        for (let i = 0; i < list.length; i++) {
          if (list[i].id == id) {
            list[i].price = utils.toPrice(p);
            list[i].stockType = str;
            list[i].specIds = s;
            list[i].img = img1;
            // if (str.substr(0, 1) == '7') {
            //   list[i].img = res.data.product.pictures[2].url;
            // } else {
            //   list[i].img = res.data.product.pictures[3].url;
            // }
          }
        }
        if(type == '1'){
          _this.setData({
            list: list
          })
        }else{
          _this.setData({
            hotList: list
          })
        }

      },
      fail: function (err) {
        // console.log(err);
        // wx.hideLoading()
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
        // _this.data.shelvesId = res.data.items[1].id
        _this.getData();
        _this.getHot();
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
  //获取热门商品
  getHot: function () {
    let _this = this;
    wx.request({
      url: getApp().globalData.baseRquest + '/v2/mall/goods?shelfId=' + getApp().globalData.shelfId + '&listCondition.page=0&listCondition.perPage=2&listCondition.orderBy=-soldCount',
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
        for (let i = 0; i < res.data.items.length; i++) {
          res.data.items[i].price = utils.toPrice(res.data.items[i].price);
          res.data.items[i].tryout = res.data.items[i].product.number.substr(res.data.items[i].product.number.length - 1, 2) == '2' ? true : false;
          let fshow = res.data.items[i].product.name.indexOf('：');
          if (fshow < 0) {
            res.data.items[i].product.name2 = res.data.items[i].product.name;
          } else {
          res.data.items[i].product.name1 = res.data.items[i].product.name.substr(fshow+1, res.data.items[i].product.name.length);
          res.data.items[i].product.name2 = res.data.items[i].product.name.substr(0, fshow+1);
          }
          // if (fshow > -1){
          //   res.data.items[i].product.name1 = res.data.items[i].product.name.substr(res.data.items[i].product.name.length - 4, 4);
          //   res.data.items[i].product.name2 = res.data.items[i].product.name.substr(0, res.data.items[i].product.name.length - 4);
          // }else{
          //   res.data.items[i].product.name2 = res.data.items[i].product.name
          // }
          res.data.items[i].key = '1';
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
          let pr = jrr[0].price;
          let st = jrr[0].stockType;
          let spc = '';
          res.data.items[i].price = pr;
          res.data.items[i].stockType = st;
          res.data.items[i].img = arr[0].properties[0].picture.url;
          // _this.getProInfo(res.data.items[i].id, '0');
        }
        _this.setData({
          hotList: res.data.items
        })
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
  // 搜索
  search: function(event){
    console.log(event);
    this.data.searchTxt = event.detail.txt;
    this.data.page = 1;
    this.data.isMore = false;
    this.setData({
      searchTxt: this.data.searchTxt,
      page: this.data.page,
      isMore: this.data.isMore,
      list: []
    })
    this.getData();
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let t = options.txt;
    console.log(t);
    this.data.searchTxt = t;
    this.setData({
      searchTxt: this.data.searchTxt
    })
    // this.getShelves();
    this.getData();
    this.getHot();
    
  },
  getInfo: function () {
    this.setData({
      userInfo: getApp().globalData.userInfo,
      hasUserInfo: true
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
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    if (!this.data.isMore) {
      return false;
    }
    this.data.page = this.data.page + 1;
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
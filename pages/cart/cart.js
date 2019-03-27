// pages/cart/cart.js
const utils = require('../../utils/util.js');
let animation;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    totalPrice: 0,
    isAll: true,
    sid: '',
    list:[],
    animationAddressMenu: {},
    addressMenuIsShow: false,
    value: [],
    specList: []
  },
  selectDistrict: function (e) {
    var that = this
    // 如果已经显示，不在执行显示动画
    if (that.data.addressMenuIsShow) {
      return
    }
    // 执行显示动画
    that.startAddressAnimation(true)
  },
  // 执行动画
  startAddressAnimation: function (isShow) {
    console.log(isShow)
    var that = this
    if (isShow) {
      // vh是用来表示尺寸的单位，高度全屏是100vh
      that.animation.translateY(0 + 'vh').step()
    } else {
      that.animation.translateY(40 + 'vh').step()
    }
    that.setData({
      animationAddressMenu: that.animation.export(),
      addressMenuIsShow: isShow,
    })
  },
  // 点击地区选择取消按钮
  cityCancel: function (e) {
    this.startAddressAnimation(false)
  },
  // 点击地区选择确定按钮
  citySure: function (e) {
    let item = '';
    let arr = this.data.list;
    let list = this.data.specList;
    for (let i = 0; i < arr.length;i++){
      if(arr[i].id == this.data.sid){
        item = arr[i];
      }
    }
    let s = '';
    for (let i = 0; i < list.length;i++){
      s += list[i][this.data.value[i]].id;
      if (i != (list.length-1)){
        s += ',';
      }
    }
    console.log(s);
    this.editCarts(this.data.sid, s, item.goods.total, item.isChecked,'0');
  },
  // 点击蒙版时取消组件的显示
  hideCitySelected: function (e) {
    console.log(e)
    this.startAddressAnimation(false)
  },
  // 处理省市县联动逻辑
  cityChange: function (e) {
    console.log(e)
    var value = e.detail.value
    this.data.value = value;
    this.setData({
      value: value
    })
  },
  bindPickerChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      index: e.detail.value
    })
  },
  
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
    var animation = wx.createAnimation({
      duration: 500,
      transformOrigin: "50% 50%",
      timingFunction: 'ease',
    })
    this.animation = animation;
    getApp().confirmUser('c_View_Shopping_Cart', { Campaign_ID: 'dts_campaign_K-Bright_2018_miniprogram'});
  },
  chageStep: function(event){
    // 1, 删除, 2, 选择, 3, 改变数量, 4, 设置规格
    // console.log(event);
    let id = event.detail.id;
    let type = event.detail.type;
    let gid = event.detail.gid;
    let txt = event.detail.txt;
    this.data.sid = id;
    if (type == '4'){
      this.getDetails(gid,'1',id);
    } else if (type == '2') {
      this.setSelect(id);
    } else if (type == '3' || type == '5') {
      this.changeNum(id,type);
    } else if (type == '1') {
      this.deleteItem(id, txt);
    }
  },
  // 删除购物车产品
  deleteItem: function(id,txt){
    let _this = this;
    wx.showModal({
      title: '删除提示',
      content: txt,
      success: function (res) {
        if (res.confirm) {
          _this.delete(id);
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
    
  },
  // 删除请求
  delete: function(id){
    let _this = this;
    wx.showLoading({
      title: '删除中...',
    })
    wx.request({
      url: getApp().globalData.baseRquest + '/v2/mall/member/shoppingCarts',
      data: {
        ids: [id]
      },
      header: getApp().globalData.ReqHeader,
      method: 'DELETE',
      success: function (res) {
        console.log(res);
        wx.hideLoading()
        if (res.statusCode != 200) {
          wx.showToast({
            title: '删除失败，请重试！',
            icon: 'none',
            duration: 2000
          })
          return false;
        }
        wx.showToast({
          title: '删除成功！',
          icon: 'none',
          duration: 2000
        })
        _this.getData();
      },
      fail: function (err) {
        // console.log(err);
        wx.hideLoading()
        wx.showToast({
          title: '删除失败，请重试！',
          icon: 'none',
          duration: 2000
        })
      }
    })
  },
  // 设置选择
  setSelect: function (id) {
    let list = this.data.list;
    for(let i=0;i<list.length;i++){
      if (list[i].id == id){
        list[i].isChecked = !list[i].isChecked;
        this.editCarts(id, list[i].goods.specs.propertyIds, list[i].goods.total, list[i].isChecked);
      }
    }
    // this.setData({
    //   list: list
    // })
    // this.total(list);
  },
  // 改变数量
  changeNum: function(id,type){
    let _this = this;
    let list = _this.data.list;
    let item = '';
    for (let i = 0; i < list.length;i++){
      if(list[i].id == id){
        item = list[i];
      }
    }
    if(type == '5'){//加
      item.goods.total = item.goods.total + 1;
      this.editCarts(id, item.goods.specs.propertyIds, item.goods.total, item.isChecked);
    }else{//减
      if (item.goods.total <= 1){return false}
      item.goods.total = item.goods.total - 1;
      this.editCarts(id, item.goods.specs.propertyIds, item.goods.total, item.isChecked);
    }
  },
  // 设置规格
  changeSpc: function (event) {
    console.log(event);
  },
  //编辑购物车
  editCarts: function(id,ids,num,status,type){
    let _this = this;
    // wx.showLoading({
    //   title: '编辑中...',
    // })
    let form = {
      "total": num,
      "isChecked": status,
      "specs": {
        "propertyIds": ids
      }
    }
    console.log(form);
    wx.request({
      url: getApp().globalData.baseRquest + '/v2/mall/member/shoppingCarts/'+id,
      data: form,
      header: getApp().globalData.ReqHeader,
      method: 'PUT',
      success: function (res) {
        console.log(res);
        // wx.hideLoading()
        if (res.statusCode != 200) {
          wx.showToast({
            title: '编辑失败，请重试！',
            icon: 'none',
            duration: 2000
          })
          return false;
        }
        _this.getData();
        if (type){
          _this.startAddressAnimation(false)
        }
      },
      fail: function (err) {
        // console.log(err);
        // wx.hideLoading()
        wx.showToast({
          title: '编辑失败，请重试！',
          icon: 'none',
          duration: 2000
        })
      }
    })
  },
  //计算价格 和是否全选
  total: function(list){
    let all = 0;
    let s = true;
    for(let i=0;i<list.length;i++){
      if (!list[i].isChecked){
        s = false;
      }else{
        all = all + parseFloat(list[i].goods.price) * list[i].goods.total;
      }
    }
    this.setData({
      isAll: s,
      totalPrice: all
    })
  },
  // 全选
  selectAll: function(){
    let list = this.data.list;
    this.data.isAll = !this.data.isAll;
    let all =0;
    if(this.data.isAll){
      for(let i=0;i<list.length;i++){
        if (!list[i].isChecked){
          this.editCarts(list[i].id, list[i].goods.specs.propertyIds, list[i].goods.total, true);
        }
        //list[i].isChecked = true;
        // all = all + parseFloat(list[i].goods.price);
      }
    }else{
      for (let i = 0; i < list.length; i++) {
        if (list[i].isChecked) {
          this.editCarts(list[i].id, list[i].goods.specs.propertyIds, list[i].goods.total, false);
        }
        // list[i].isChecked = false;
      }
    }
    this.setData({
      isAll: this.data.isAll,
    })
  },
  // 获取购物车数据
  getData: function () {
    let _this = this;
    // wx.showLoading({
    //   title: '加载中',
    // })
    wx.request({
      url: getApp().globalData.baseRquest + '/v2/mall/member/shoppingCarts',
      data: {},
      header: getApp().globalData.ReqHeader,
      method: 'GET',
      success: function (res) {
        // console.log(res);
        // wx.hideLoading()
        if (res.statusCode != 200) {
          // wx.showToast({
          //   title: '获取数据失败，请重试！',
          //   icon: 'none',
          //   duration: 2000
          // })
          return false;
        }
        let all = 0;
        _this.data.isAll = true;
        for (let i = 0; i < res.data.items.length;i++){
          if (!res.data.items[i].isChecked){
            _this.data.isAll = false;
          }
          res.data.items[i].goods.totalprice = parseFloat(res.data.items[i].goods.price) * res.data.items[i].goods.total
          if (res.data.items[i].isChecked){
          all = all + res.data.items[i].goods.totalprice;
          }
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
          }else{
          res.data.items[i].goods.name1 = res.data.items[i].goods.name.substr(fshow + 1, res.data.items[i].goods.name.length);
          res.data.items[i].goods.name2 = res.data.items[i].goods.name.substr(0, fshow + 1);
          }
          res.data.items[i].goods.img = res.data.items[i].goods.specs.picture ? res.data.items[i].goods.specs.picture.url : res.data.items[i].goods.image;
          // _this.getDetails(res.data.items[i].goods.id, '0', res.data.items[i].id, res.data.items[i].goods.specs.description);
        }
        _this.setData({
          list: res.data.items,
          isAll: _this.data.isAll,
          totalPrice: utils.toPrice(all)
        })
      },
      fail: function (err) {
        // console.log(err);
        // wx.hideLoading()
        // wx.showToast({
        //   title: '获取数据失败，请重试！',
        //   icon: 'none',
        //   duration: 2000
        // })
      }
    })
  },
  // 获取产品详情
  getDetails: function(id,type,oid,spec){
    let _this = this;
    // wx.showLoading({
    //   title: '加载中',
    // })
    wx.request({
      url: getApp().globalData.baseRquest + '/v2/mall/goods/' + id,
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
        if(type == '1'){
          let arr = res.data.product.specifications;
          let s = [];
          let v = [];
          for (let i = 0; i < arr.length; i++) {
            s.push(arr[i].properties);
            v.push(0);
          }
          _this.data.value = v;
          _this.setData({
            specList: s,
            value: v
          })
          _this.selectDistrict();
        }else{
          let list = _this.data.list;
          let tryout = res.data.product.number.substr(res.data.product.number.length - 1, 2) == '2' ? true : false;
          for(let i=0;i<list.length;i++){
            if(list[i].id == oid){
              if (tryout){
                // console.log(spec)
                // console.log(spec.substr(4, 1));
                if (spec.substr(4,1) == '7'){
                  list[i].goods.img = res.data.product.pictures[2].url;
                }else{
                  list[i].goods.img = res.data.product.pictures[3].url;
                }
              }else{
                list[i].goods.img = res.data.product.pictures[0].url;
              }
            }
          }
          _this.setData({
            list: list
          })
          // console.log(list);
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
  // 跳转结算页
  goBalance: function(){
    let _this = this;
    let list = _this.data.list;
    let l = 0;
    for(let i=0;i<list.length;i++){
      if (list[i].isChecked){
        l++
      }
    }
    if(l < 1){
      wx.showToast({
        title: '请先选择要购买的产品！',
        icon: 'none',
        duration: 1500
      })
      return false;
    }
    wx.navigateTo({
      url: '/pages/balance/balance',
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
        // app.globalData.userInfo = res.userInfo
        _this.setData({
          userInfo: getApp().globalData.userInfo,
          hasUserInfo: true
        })
        if (!getApp().globalData.userInfo) {
          _this.wxlogin();
          return false;
        }
        _this.getData();
      },
      fail: function (e) {
        
      }
    })
    
    
  },
  // 登录
  wxlogin: function () {
    let _this = this;
    wx.getUserInfo({
      success: res => {
        console.log(res);
        wx.login({
          success: r => {
            console.log(r);
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
                getApp().globalData.userInfo = re.data;
                getApp().globalData.ReqHeader['x-access-token'] = re.data.accessToken;
                _this.setData({
                  userInfo: re.data,
                  hasUserInfo: true
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
            console.log(e);
          }
        })
      },
      fail: function (e) {
        console.log(e);
        wx.login({
          success: r => {
            console.log(r);
            // _this.globalData.userInfo = res.userInfo
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
                getApp().globalData.userInfo = re.data;
                getApp().globalData.ReqHeader['x-access-token'] = re.data.accessToken;
                _this.setData({
                  userInfo: re.data,
                  hasUserInfo: false
                })
              }
            })
          },
          fail: e => {
            console.log(e);
          }
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
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    this.getData();
    // 停止下拉动作
    wx.stopPullDownRefresh();
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
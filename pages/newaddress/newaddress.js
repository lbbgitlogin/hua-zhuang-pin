// pages/newaddress/newaddress.js
let address = require('../../utils/city.js');
const { phoneVaild } = require('../../utils/util.js');
let animation;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    form: {
      memberId: '',
      name:'',
      phone:'',
      province:'',
      city:'',
      district:'',
      detail:'',
      zipCode:'',
      isDefault: true,
    },
    id:'',
    type: '0',
    animationAddressMenu: {},
    addressMenuIsShow: false,
    value: [0, 0, 0],
    provinces: [],
    citys: [],
    areas: [],
    areaInfo: ''
  },
  //表单双向绑定
  bindKeyInput: function (e) {
    let name = e.currentTarget.id;
    this.data.form[name] = e.detail.value;
    this.setData({
      form: this.data.form
    })
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
    var that = this
    var city = that.data.city
    var value = that.data.value
    that.startAddressAnimation(false)
    // 将选择的城市信息显示到输入框
    var areaInfo = '';
    // if (that.data.citys[value[1]].name == '市辖区'){
    //   areaInfo = that.data.provinces[value[0]].name + ',' + that.data.areas[value[2]].name;
    // }else{
      areaInfo = that.data.provinces[value[0]].name + ',' + that.data.citys[value[1]].name + ',' + that.data.areas[value[2]].name;
    // }
    that.data.form.province = that.data.provinces[value[0]].name;
    that.data.form.city = that.data.citys[value[1]].name;
    that.data.form.district = that.data.areas[value[2]].name ;
    that.setData({
      areaInfo: areaInfo,
      form: that.data.form
    })
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
    var provinces = this.data.provinces
    var citys = this.data.citys
    var areas = this.data.areas
    var provinceNum = value[0]
    var cityNum = value[1]
    var countyNum = value[2]
    // 如果省份选择项和之前不一样，表示滑动了省份，此时市默认是省的第一组数据，
    if (this.data.value[0] != provinceNum) {
      var id = provinces[provinceNum].id
      this.setData({
        value: [provinceNum, 0, 0],
        citys: address.citys[id],
        areas: address.areas[address.citys[id][0].id],
      })
    } else if (this.data.value[1] != cityNum) {
      // 滑动选择了第二项数据，即市，此时区显示省市对应的第一组数据
      var id = citys[cityNum].id
      this.setData({
        value: [provinceNum, cityNum, 0],
        areas: address.areas[citys[cityNum].id],
      })
    } else {
      // 滑动选择了区
      this.setData({
        value: [provinceNum, cityNum, countyNum]
      })
    }
    console.log(this.data)
  },
  // 提交表单
  onSubmit: function(){
    if (this.data.form.name == ''){
      wx.showToast({
        title: '收件人不能为空！',
        icon: 'none',
        duration: 1000
      })
      return false;
    }
    let r = phoneVaild(this.data.form.phone);
    if (!r.status) {
      wx.showToast({
        title: r.tip,
        icon: 'none',
        duration: 1000
      })
      return false;
    }
    if (this.data.form.province == '' || this.data.form.city == '' || this.data.form.district == '') {
      wx.showToast({
        title: '所在地区不能为空！',
        icon: 'none',
        duration: 1000
      })
      return false;
    }
    if (this.data.form.detail == '') {
      wx.showToast({
        title: '详细地址不能为空！',
        icon: 'none',
        duration: 1000
      })
      return false;
    }
    console.log(this.data.form);
    if(this.data.id == '0'){
      getApp().confirmUser('c_Add_Shipping_Address', { Campaign_ID: 'dts_campaign_K-Bright_2018_miniprogram', Receiver_Name: this.data.form.name, Contact_Number: this.data.form.phone, Shipping_Address: this.data.form.province + this.data.form.city + this.data.form.district + this.data.form.detail });
      this.add();
      return false;
    }else{
      this.update();
    }
  },  
  // 切换是否默认
  chageDefault: function (event) {
    this.data.form.isDefault = event.currentTarget.dataset.status;
    this.setData({
      form: this.data.form
    })
  },
  // 添加网络请求
  add: function(){
    let _this = this;
    
    wx.request({
      url: getApp().globalData.baseRquest + '/v2/member/addresses',
      data: _this.data.form,
      method: 'POST',
      header: getApp().globalData.ReqHeader,
      success: function (res) {
        // console.log(re);
        if (res.statusCode != 200) {
          wx.showToast({
            title: '添加失败，请重试！',
            icon: 'none',
            duration: 2000
          })
          return false;
        }
        // wx.showToast({
        //   title: '添加地址成功！',
        //   icon: 'none',
        //   duration: 2000
        // })
        wx.navigateBack();
      },
      fail: function(e){
        wx.showToast({
          title: '添加失败，请重试！',
          icon: 'none',
          duration: 2000
        })
      }
    })
  },
  // 更新地址网络请求
  update: function () {
    let _this = this;
    wx.request({
      url: getApp().globalData.baseRquest + '/v2/member/addresses/'+this.data.id,
      data: _this.data.form,
      method: 'PUT',
      header: getApp().globalData.ReqHeader,
      success: function (res) {
        // console.log(re);
        if (res.statusCode != 200) {
          wx.showToast({
            title: '更新失败，请重试！',
            icon: 'none',
            duration: 2000
          })
          return false;
        }
        // wx.showToast({
        //   title: '添加地址成功！',
        //   icon: 'none',
        //   duration: 2000
        // })
        wx.navigateBack();
      },
      fail: function (e) {
        wx.showToast({
          title: '更新失败，请重试！',
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
    // 初始化动画变量
    var animation = wx.createAnimation({
      duration: 500,
      transformOrigin: "50% 50%",
      timingFunction: 'ease',
    })
    this.animation = animation;
    // if (!options) { return false }
    console.log(options);
    // console.log(JSON.parse(options.info))
    this.data.form.memberId = getApp().globalData.userInfo.member.id;
    // this.data.form.memberId = '5b714217cfb4091269c96d26';
    // this.data.id = '5b7f9f7f2bdbbc0081e41e01'
    this.data.id = options.id;
    this.setData({
      // id: options.id,
      id: this.data.id,
      form: this.data.form,
      // type: options.type
    })
    var id = address.provinces[0].id
    this.setData({
      provinces: address.provinces,
      citys: address.citys[id],
      areas: address.areas[address.citys[id][0].id],
    })
    if (options.id == '0'){
      // 默认联动显示北京
      // var id = address.provinces[0].id
      // this.setData({
      //   provinces: address.provinces,
      //   citys: address.citys[id],
      //   areas: address.areas[address.citys[id][0].id],
      // })
    }else{
      this.getInfo(this.data.id);
    }
  },
  // 根据ID获取地址信息
  getInfo: function(id){
    let _this = this;
    wx.request({
      url: getApp().globalData.baseRquest + '/v2/member/addresses/'+id,
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
        // _this.setData({
        //   list: res.data.items
        // })
        _this.data.form.name = res.data.name;
        _this.data.form.phone = res.data.phone;
        _this.data.form.city = res.data.city;
        _this.data.form.detail = res.data.detail;
        _this.data.form.district = res.data.district;
        _this.data.form.isDefault = res.data.isDefault;
        _this.data.form.province = res.data.province;
        _this.data.form.zipCode = res.data.zipCode;
        _this.setData({
          form: _this.data.form,
          areaInfo: res.data.province + ',' + res.data.city + ',' + res.data.district
        })
        var id = '',cid='',aid='';
        let value = [];
        for (let i = 0; i < address.provinces.length;i++){
          if (address.provinces[i].name == res.data.province){
            id = address.provinces[i].id;
            value[0] = i;
          }
        }
        for (let i = 0; i < address.citys[id].length;i++){
          if (address.citys[id][i].name == res.data.city) {
            cid = address.citys[id][i].id;
            value[1] = i;
          }
        }
        for (let i = 0; i < address.areas[address.citys[id][value[1]].id].length; i++) {
          if (address.areas[address.citys[id][value[1]].id][i].name == res.data.district) {
            aid = address.areas[address.citys[id][value[1]].id][i].id;
            value[2] = i;
          }
        }
        _this.setData({
          provinces: address.provinces,
          citys: address.citys[id],
          areas: address.areas[address.citys[id][0].id],
          value: value
        })
      },
      fail: function (err) {
        console.log(err);
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
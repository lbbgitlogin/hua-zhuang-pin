// pages/question/question.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: '',
    info: '',
    form:{
      nickname:'',
      phone:'',
      sex:'',
      age:'',
      skinType:'',
      purchaseFactors:'',
      demand:'',
      commonBrands: '',
      sourceFrom: ''
    },
    modalshow: false,
    step:1,
    stepTxt:'下一步',
    step4list:[
      {
        name: '油性',
        tag: 'FLV_2_1_1'
      },
      {
        name: '干性',
        tag: 'FLV_2_1_2'
      },
      {
        name: '混油',
        tag: 'FLV_2_1_3'
      },
      {
        name: '混干',
        tag: 'FLV_2_1_4'
      },
      {
        name: '敏感肌',
        tag: 'FLV_2_1_5'
      },
    ],
    sexList:[
      {
        name: '男'
      },
      {
        name: '女'
      }, {
        name: '其他'
      }
    ],
    sourceList:[
      {
        name:'公众号推文',
        istrue:false,
        tag: 'FLV_3_1'
      },
      {
        name: '小红书种草',
        istrue: false,
        tag: 'FLV_3_2'
      },
      {
        name: '微博种草',
        istrue: false,
        tag: 'FLV_3_3'
      },
      {
        name: '朋友推荐',
        istrue: false,
        tag: 'FLV_3_4'
      },
      {
        name: '品牌官网',
        istrue: false,
        tag: 'FLV_3_5'
      }
    ],
    factors:[
      {
        name:'实际效果',
        istrue:false,
        tag: 'FLV_2_2_1'
      },
      {
        name: '价格',
        istrue: false,
        tag: 'FLV_2_2_2'
      },
      {
        name: '包装',
        istrue: false,
        tag: 'FLV_2_2_3'
      },
      {
        name: '品牌知名度',
        istrue: false,
        tag: 'FLV_2_2_4'
      },
      {
        name: '原产国',
        istrue: false,
        tag: 'FLV_2_2_5'
      }
    ],
    demands: [
      {
        name: '补水保湿',
        istrue: false,
        tag: 'FLV_2_3_1'
      },
      {
        name: '美白',
        istrue: false,
        tag: 'FLV_2_3_2'
      },
      {
        name: '祛痘',
        istrue: false,
        tag: 'FLV_2_3_3'
      },
      {
        name: '抗衰老',
        istrue: false,
        tag: 'FLV_2_3_4'
      },
      {
        name: '敏感肌',
        istrue: false,
        tag: 'FLV_2_3_5'
      }
    ],
    vheight: 0,
    tags:[]
  },
  // 获取商品数据
  getData: function () {
    let _this = this;
    // wx.showLoading({
    //   title: '加载中',
    // })
    wx.request({
      url: getApp().globalData.baseRquest + '/v2/mall/goods/' + this.data.id,
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
          info: res.data
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
  },
  //表单双向绑定
  bindKeyInput: function (e) {
    let name = e.currentTarget.id;
    this.data.form[name] = e.detail.value;
    this.setData({
      form: this.data.form
    })
  },
  // 改变模态框显示隐藏
  changenStatus: function (event) {
    console.log(event);
    this.setData({
      modalshow: event.currentTarget.dataset.status
    })
  },
  // 改变第四步选择
  selectStep4: function (event) {
    let n = event.currentTarget.dataset.itemid;
    let tag = event.currentTarget.dataset.itemtag;
    if(this.data.step == '1'){
      this.data.form.sex = n;
      this.setData({
        form: this.data.form
      })
    } else if (this.data.step == '3') {
      this.data.form.skinType = n;
      this.data.skinTag = tag;
      this.setData({
        form: this.data.form
      })
    }else if (this.data.step == '6') {
      // this.data.form.sourceFrom = n;
      // this.setData({
      //   form: this.data.form
      // })
      for (let i = 0; i < this.data.sourceList.length; i++) {
        if (this.data.sourceList[i].name == n) {
          this.data.sourceList[i].istrue = !this.data.sourceList[i].istrue;
        }
      }
      this.setData({
        sourceList: this.data.sourceList
      })
    } else if (this.data.step == '4') {
      for (let i = 0; i < this.data.factors.length;i++){
        if (this.data.factors[i].name == n){
          this.data.factors[i].istrue = !this.data.factors[i].istrue;
        }
      }
      this.setData({
        factors: this.data.factors
      })
      
    } else if (this.data.step == '5') {
      for (let i = 0; i < this.data.demands.length; i++) {
        if (this.data.demands[i].name == n) {
          this.data.demands[i].istrue = !this.data.demands[i].istrue;
        }
      }
      this.setData({
        demands: this.data.demands
      })
    }
    
  },
  //改变步骤
  changeStep: function(e){
    let type = e.currentTarget.dataset.type;
    if(type == '0'){//上一步
      this.setData({
        step: this.data.step - 1
      })
    }else{//下一步
      if(this.data.step == '1'){
        if(this.data.form.sex == ''){
          wx.showToast({
            title: '请先选择性别！',
            icon: 'none',
            duration: 2000
          })
          return false;
        }
      }else if (this.data.step == '2') {
        if (this.data.form.age == '' || this.data.form.commonBrands == '') {
          wx.showToast({
            title: '请先填写年龄与常用品牌！',
            icon: 'none',
            duration: 2000
          })
          return false;
        }
        getApp().confirmUser('c_Brand_Preference', { Campaign_ID: 'dts_campaign_K-Bright_2018_miniprogram', Brand_Type: 'skin care', Brand_Name: this.data.form.commonBrands});
      } else if (this.data.step == '3') {
        if (this.data.form.skinType == '') {
          wx.showToast({
            title: '请先选择肤质！',
            icon: 'none',
            duration: 2000
          })
          return false;
        }
        this.data.tags[0] = [this.data.skinTag];
      } else if (this.data.step == '4') {
        let n = 0;
        let s = [];
        let p = [];
        for(let i=0;i<this.data.factors.length;i++){
          if (this.data.factors[i].istrue){
            n = n+1;
            s.push(this.data.factors[i].name);
            p.push(this.data.factors[i].tag)
          }
        }
        if (n < 2) {
          wx.showToast({
            title: '请至少选择2项因素！',
            icon: 'none',
            duration: 2000
          })
          return false;
        }
        this.data.form.purchaseFactors = s;
        this.data.tags[1] = p;
      } else if (this.data.step == '5') {
        let n = 0;
        let s = [];
        let p = [];
        for (let i = 0; i < this.data.demands.length; i++) {
          if (this.data.demands[i].istrue) {
            n = n + 1;
            s.push(this.data.demands[i].name);
            p.push(this.data.demands[i].tag)
          }
        }
        if (n < 2) {
          wx.showToast({
            title: '请至少选择2项因素！',
            icon: 'none',
            duration: 2000
          })
          return false;
        }
        this.data.tags[2] = p;
        this.data.form.demand = s;
      } else if (this.data.step == '6') {
        let n = 0;
        let s = [];
        let p = [];
        for (let i = 0; i < this.data.sourceList.length; i++) {
          if (this.data.sourceList[i].istrue) {
            n = n + 1;
            s.push(this.data.sourceList[i].name);
            p.push(this.data.sourceList[i].tag);
          }
        }
        if (n < 2) {
          wx.showToast({
            title: '请至少选择2项渠道！',
            icon: 'none',
            duration: 2000
          })
          return false;
        }
        // this.data.form.purchaseFactors = s;
        // if (this.data.form.sourceFrom == '') {
        //   wx.showToast({
        //     title: '请先选择渠道！',
        //     icon: 'none',
        //     duration: 2000
        //   })
        //   return false;
        // }
        this.data.tags[3] = p;
        this.data.form.sourceFrom = s;
        this.apply();
        return false;
      }
      this.setData({
        step: this.data.step + 1
      })
    }
  },
  // 申领请求
  apply: function(){
    let _this = this;
    wx.showLoading({
      title: '加载中',
    })
    let form = {
      // "memberId": getApp().globalData.userInfo.member.id,
      "memberId":'5b714217419a29a6d2aa77e9',
      "content": {
        "gender": this.data.form.sex,
        "age": this.data.form.age,
        "skinType": [this.data.form.skinType],
        "purchaseFactors": this.data.form.purchaseFactors,
        "demand": this.data.form.demand,
        "commonBrands": this.data.form.commonBrands,
        "sourceFrom": this.data.form.sourceFrom
      },
      "goods": [{
        "id": this.data.id,
        "name": _this.data.info.name,
        "total": _this.data.info.total,
        "specs": _this.data.info.specs
      }]
    }
    console.log(form);
    let qp = [];
    let s = _this.data.info.name + _this.data.info.specName;
    let sp = [];
    if (s == '凝锁焕颜凝珠固体精华：赋颜菁粹7粒装'){
      sp = ['PRO_3_1_1', 'ACT_3_14'];
    } else if (s == '凝锁焕颜凝珠固体精华：光采透亮7粒装') {
      sp = ['PRO_3_1_2', 'ACT_3_14'];
    } else if (s == '凝锁焕颜凝珠固体精华：盈润水光7粒装') {
      sp = ['PRO_3_1_3', 'ACT_3_14'];
    } else if (s == '凝锁焕颜凝珠固体精华：赋颜菁粹16粒装') {
      sp = ['PRO_3_1_4', 'ACT_3_14'];
    } else if (s == '凝锁焕颜凝珠固体精华：光采透亮16粒装') {
      sp = ['PRO_3_1_5', 'ACT_3_14'];
    } else if (s == '凝锁焕颜凝珠固体精华：盈润水光16粒装') {
      sp = ['PRO_3_1_6', 'ACT_3_14'];
    }
    let tarr = [];
    for(let i=0;i<this.data.tags.length;i++){
      // tarr.push
      tarr = [...tarr, ...this.data.tags[i]];
    }
    getApp().tagUser(tarr);
    getApp().updateUser(_this.data.form.sex, _this.data.form.age);
    // console.log(this.data.tags);
    // console.log(tarr);
    // return false;
    wx.request({
      url: getApp().globalData.baseRquest + '/modules/samplesack/open/orders',
      data: form,
      header: getApp().globalData.ReqHeader,
      method: 'POST',
      success: function (res) {
        // console.log(res);
        // wx.hideLoading()
        if (res.statusCode != 200) {
          wx.showToast({
            title: '申请失败，请重试！',
            icon: 'none',
            duration: 2000
          })
          return false;
        }
        getApp().confirmUser('c_Start_Questionnaire', { Campaign_ID: 'dts_campaign_K-Bright_2018_miniprogram', Product_SKU: s });
        getApp().tagUser(sp);
        
        wx.reLaunch({
          url: '/pages/applyresult/applyresult?id=' + res.data.id + '&status=' + res.data.auditStatus + '&type=0',
        })
        
        // wx.redirectTo({
        //   url: '/pages/apply/apply'
        // })
        return false;
      },
      fail: function (err) {
        // console.log(err);
        wx.hideLoading()
        wx.showToast({
          title: '申请失败，请重试！',
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
    // let id = "5b7bc7c3d4abdd005645bad5";
    this.data.id = id;
    this.setData({
      id: id
    })
    this.data.info = getApp().globalData.applyInfo;
    console.log(this.data.info)
    this.setData({
      info: this.data.info,
      vheight: getApp().globalData.shh - getApp().globalData.ww - getApp().globalData.ssh
    })
    getApp().confirmUser('c_Start_Questionnaire', { Campaign_ID: 'dts_campaign_K-Bright_2018_miniprogram', Product_SKU: this.data.info.name + this.data.info.specName });
    // this.getData();
    
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
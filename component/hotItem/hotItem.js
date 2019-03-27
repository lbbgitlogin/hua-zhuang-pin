// component/hotItem/hotItem.js
const utils = require("../../utils/util.js");
Component({
  /**
   * 组件的属性列表
   * hotList：组件的信息
   * hotIndex： 组件的下标，0开始
   * isLogin：是否登录
   */
  properties: {
    hotList: Object,
    hotIndex: {
      type: Number,
      value: 0
    },
    isLogin: {
      type: Boolean,
      value: false
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    images: {}
  },

  /**
   * 组件的方法列表
   */
  methods: {
    imageLoad: function (e) {
      var $width = e.detail.width,    //获取图片真实宽度
        $height = e.detail.height,
        ratio = $width / $height;    //图片的真实宽高比例
      var viewWidth = 718,           //设置图片显示宽度，左右留有16rpx边距
        viewHeight = 718 / ratio;    //计算的高度值
      var image = this.data.images;
      //将图片的datadata-index作为image对象的key,然后存储图片的宽高值
      image[e.target.dataset.index] = {
        width: viewWidth,
        height: viewHeight
      }
      this.setData({
        images: image
      })
    },
    getUserInfo: function (e) {
      let _this = this;
      if (e.detail.userInfo) {//授权确定
        wx.login({
          success: r => {
            console.log(r);
            // 发送 res.code 到后台换取 openId, sessionKey, unionId
            wx.request({
              url: getApp().globalData.baseUrl + '/v2/weapp/oauth',
              data: {
                code: r.code,
                scope: 'userinfo',
                watermark: { "appid": getApp().globalData.appid },
                encrypted_data: e.detail.encryptedData,
                iv: e.detail.iv
              },
              method: 'POST',
              header: getApp().globalData.ReqHeader,
              success: function (re) {
                console.log(re);
                if (re.statusCode != 200) {
                  return false;
                }
                wx.setStorageSync('openId', re.openId);
                wx.setStorageSync('isAuthorize', '1');  
                getApp().globalData.userInfo = re.data;
                getApp().globalData.ReqHeader['x-access-token'] = re.data.accessToken;
                _this.triggerEvent('getinfo', {}, {});
                // _this.setData({
                //   isLogin: false
                // })
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
    addCart: function(){
      let _this = this;
      console.log(_this.data.hotList);
      if (_this.data.hotList.specIds.length < 1){
        wx.showToast({
          title: '加入失败，请重试！',
          icon: 'none',
          duration: 2000
        })
        return false;
      }
      let s = '';
      let form = {
        "goodsId": _this.data.hotList.id,
        "total": 1,
        "specs": {
          "propertyIds": utils.createString(_this.data.hotList.specIds)
        }
      }
      wx.showLoading({
        title: '加载中',
      })
      wx.request({
        url: getApp().globalData.baseRquest + '/v2/mall/member/shoppingCarts',
        data: form,
        header: getApp().globalData.ReqHeader,
        method: 'POST',
        success: function (res) {
          // console.log(res);
          wx.hideLoading()
          if (res.statusCode != 200) {
            wx.showToast({
              title: '加入失败，请重试！',
              icon: 'none',
              duration: 2000
            })
            return false;
          }
          wx.showToast({
            title: '加入成功！',
            icon: 'none',
            duration: 2000,
          })
        },
        fail: function (err) {
          // console.log(err);
          wx.hideLoading()
          wx.showToast({
            title: '加入失败，请重试！',
            icon: 'none',
            duration: 1500
          })
        }
      })
    }
  }
})

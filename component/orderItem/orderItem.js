// component/orderItem/orderItem.js
Component({
  /**
   * 组件的属性列表
   * itemObj：组件信息
   * mypay： 立即支付按钮触发方法
   * refresh：刷新父组件方法
   */
  properties: {
    itemObj: Object
  },

  /**
   * 组件的初始数据
   */
  data: {
    imgUrls: [],
    indicatorDots: true,
    autoplay: true,
    interval: 5000,
    duration: 1000,
    //所有图片的高度  
    imgheights: [],
    //图片宽度 
    imgwidth: 750,
    //默认  
    current: 0,
    subCurrent: 0
  },
  ready: function () { 
    // console.log(this.data.itemObj);
    // let arr = [];
    // for (let i = 0; i < this.data.itemObj.goods.length;i++){
    //   arr.push(this.data.itemObj.goods[i].img);
    // }
    // console.log(arr);
    // this.setData({
    //   imgUrls: arr
    // })
  },
  /**
   * 组件的方法列表
   */
  methods: {
    imageLoad: function (e) {//获取图片真实宽度  
      var imgwidth = e.detail.width,
        imgheight = e.detail.height,
        //宽高比  
        ratio = imgwidth / imgheight;
      // console.log(imgwidth, imgheight)
      //计算的高度值
      var viewHeight = 650 / ratio;
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
      // console.log(e.detail.current)
      this.setData({ current: e.detail.current })
    },
    payNow: function (event) {
      let id = event.currentTarget.dataset.id;
      var myEventDetail = { id: id} // detail对象，提供给事件监听函数
      var myEventOption = {} // 触发事件的选项
      this.triggerEvent('mypay', myEventDetail, myEventOption)
    },
    goLogis: function (event){
      let id = event.currentTarget.dataset.id;
      // 获取商品数据
      let _this = this;
      wx.showLoading({
        title: '加载中',
      })
      wx.request({
        url: getApp().globalData.baseRquest + '/v2/mall/member/orders/' + id,
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
          if (res.data.shipment){
            wx.navigateTo({
              url: '/pages/logistics/logistics?number=' + res.data.shipment.number + '&con=' + res.data.shipment.expCom + '&name=' + res.data.shipment.expName + '&orderNumber=' + res.data.number+'',
            })
          }else{
            wx.navigateTo({
              url: '/pages/logistics/logistics?number=&con=&name=&orderNumber=' + res.data.number +'',
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
    //确认收货
    confirmOrder: function (event) {
      let _this = this;
      let id = event.currentTarget.dataset.id;
      wx.showModal({
        title: '收货提示',
        content: '确定已经收到产品？',
        success: function (res) {
          if (res.confirm) {
            // console.log('用户点击确定');
            wx.showLoading({
              title: '加载中',
            })
            wx.request({
              url: getApp().globalData.baseRquest + '/v2/mall/member/orders/' + id + '/confirmReceived',
              data: {},
              method: 'PUT',
              header: getApp().globalData.ReqHeader,
              success: function (res) {
                console.log(res);
                wx.hideLoading();
                if (res.statusCode != 200) {
                  wx.showToast({
                    title: '确认收货失败，请重试！',
                    icon: 'none',
                    duration: 1000
                  })
                  return false;
                }
                // _this.getOrderData();
                var myEventDetail = {} // detail对象，提供给事件监听函数
                var myEventOption = {} // 触发事件的选项
                _this.triggerEvent('refresh', myEventDetail, myEventOption)
              },
              fail: function (err) {
                wx.hideLoading()
                wx.showToast({
                  title: '确认收货失败，请重试！',
                  icon: 'none',
                  duration: 1000
                })
              }
            });
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
    },
  }
})

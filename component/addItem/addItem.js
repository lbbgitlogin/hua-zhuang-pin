// component/addItem/addItem.js
Component({
  /**
   * 组件的属性列表
   * addIndex：组件调用下标，0开始
   * addList：组件需要的数据
   * addType：类型，0，结算页跳转，1，申领结果跳转
   * addId：id，申领结果页跳转需申领ID
   * refreshData：刷新父组件方法
   */
  properties: {
    addList: Object,
    addIndex: {
      type: Number,
      value: 0
    },
    addType: {
      type: String,
      value: '0'
    },
    addId: {
      type: String,
      value: '0'
    }
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    //刷新父组件
    refreshData: function () {
      var myEventDetail = {} // detail对象，提供给事件监听函数
      var myEventOption = {} // 触发事件的选项
      this.triggerEvent('refreshData', myEventDetail, myEventOption)
    },
    setDefault: function(event){
      let _this = this;
      let id = event.currentTarget.dataset.id;
      let type = event.currentTarget.dataset.type;
      wx.showModal({
        title: type == '0' ? '地址设置提示' : '地址删除提示',
        content: type == '0' ? '确定要将该地址设为默认？' : '确定要将该地址删除？',
        success: function (res) {
          if (res.confirm) {
            console.log('用户点击确定');
            if(type == '0'){//设为默认
              _this.defaultReq(id);
            }else if(type == '1'){
              _this.delReq(id);
            }
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
    },
    defaultReq: function(id){
      let _this = this;
      wx.request({
        url: getApp().globalData.baseRquest + '/v2/member/addresses/'+id+'/default',
        data: {},
        header: getApp().globalData.ReqHeader,
        method: 'PUT',
        success: function (res) {
          // console.log(res);
          if (res.statusCode != 200) {
            wx.showToast({
              title: '地址设置失败，请重试！',
              icon: 'none',
              duration: 2000
            })
            return false;
          }
          wx.showToast({
            title: '地址设置成功！',
            icon: 'none',
            duration: 2000
          })
          _this.refreshData();
        },
        fail: function (err) {
          console.log(err);
          wx.showToast({
            title: '地址设置失败，请重试！',
            icon: 'none',
            duration: 2000
          })
        }
      }); 
    },
    delReq: function (id) {
      let _this = this;
      wx.request({
        url: getApp().globalData.baseRquest + '/v2/member/addresses/' + id,
        data: {},
        header: getApp().globalData.ReqHeader,
        method: 'DELETE',
        success: function (res) {
          // console.log(res);
          if (res.statusCode != 200) {
            wx.showToast({
              title: '地址删除失败，请重试！',
              icon: 'none',
              duration: 2000
            })
            return false;
          }
          wx.showToast({
            title: '地址删除成功！',
            icon: 'none',
            duration: 2000
          })
          _this.refreshData();
        },
        fail: function (err) {
          console.log(err);
          wx.showToast({
            title: '地址删除失败，请重试！',
            icon: 'none',
            duration: 2000
          })
        }
      });
    },
    addSub: function(event){
      let id = event.currentTarget.dataset.id;
      let _this = this;
      console.log(this.data.addType + ',' + this.data.addId+','+id);
      wx.showModal({
        title: '地址设置提示',
        content: '确定要将该地址设为收货地址？',
        success: function (res) {
          if (res.confirm) {
            console.log('用户点击确定');
            if (_this.data.addType == '1'){
              _this.changeAdd(id);
            }else{
              getApp().globalData.addInfo = _this.data.addList;
              wx.navigateBack()
            }
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
    },
    changeAdd: function (id) {
      let _this = this;
      wx.showLoading({
        title: '加载中',
      })
      wx.request({
        url: getApp().globalData.baseRquest + '/modules/samplesack/open/update-address/' + this.data.addId,
        data: {
          memberAddressId: id
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
          var pages = getCurrentPages();
          if (pages.length > 1) {
            //上一个页面实例对象
            var prePage = pages[pages.length - 2];
            //关键在这里
            prePage.getData()
          }
          wx.navigateBack();
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
  }
})

// component/backItem/backItem.js
Component({
  /**
   * 组件的属性列表
   * itemTxt：左侧文字
   */
  properties: {
    itemTxt: {
      type: String,
      value: ''
    },
    itemNum: {
      type: String,
      value: ''
    },
    itemName: {
      type: String,
      value: ''
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
    copy(e) {
      let data = e.currentTarget.dataset.num
      if (data) {
        wx.setClipboardData({
          data
        })
      }
    },
    goback: function() {
      wx.navigateBack();
    }
  }
})
// component/selectAdd/selectAdd.js
Component({
  /**
   * 组件的属性列表
   * selectObj：组件涉及信息
   * selectType：是否需要右侧箭头，0，有，1，无
   * selectShadow：是否需要阴影
   * isBottom：是否需要底部margin
   */
  properties: {
    selectObj: Object,
    selectType:{
      type: String,
      value: '1'
    },
    selectShadow: {
      type: Boolean,
      value: true
    },
    isBottom: {
      type: Boolean,
      value: true
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
    changeAdd: function(event){
      if (this.data.selectType == '1'){
        wx.navigateTo({
          url: '/pages/address/address?type=0&id=0'
        })
      }
    }
  }
})

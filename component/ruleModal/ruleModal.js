// component/ruleModal/ruleModal.js
Component({
  /**
   * 组件的属性列表
   * modalStatus：显示，隐藏，
   * modalTap：调用方法
   */
  properties: {
    modalStatus:{
      type: Boolean,
      value: false
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
    changeStatus: function () {
      var myEventDetail = {} // detail对象，提供给事件监听函数
      var myEventOption = {} // 触发事件的选项
      this.triggerEvent('modalTap', myEventDetail, myEventOption)
    },
  }
})

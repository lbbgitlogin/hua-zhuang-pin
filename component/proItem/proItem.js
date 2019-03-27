// component/proItem/proItem.js
const utils = require('../../utils/util.js');
Component({
  /**
   * 组件的属性列表
   * itemObj：组件信息
   * isLogin：是否登录
   * myorder：生成订单方法
   * getinfo：跳转即可申领方法
   */
  properties: {
    itemObj: Object,
    isLogin: {
      type: Boolean,
      vaule: false
    }
  },

  /**
   * 组件的初始数据
   */
  data: {

  },
  ready: function(){
    
  },
  /**
   * 组件的方法列表
   */
  methods: {
    // 生成订单
    createOrder: function(event){
      console.log(event);
      let id = event.currentTarget.dataset.id;
      var myEventDetail = { id: id } // detail对象，提供给事件监听函数
      var myEventOption = {} // 触发事件的选项
      this.triggerEvent('myorder', myEventDetail, myEventOption)
    },
    toApply: function(){
      var myEventDetail = { value: this.data.itemObj } // detail对象，提供给事件监听函数
      var myEventOption = {} // 触发事件的选项
      this.triggerEvent('getinfo', myEventDetail, myEventOption)
    }
  }
})

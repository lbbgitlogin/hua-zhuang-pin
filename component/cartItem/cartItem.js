// component/cartItem/cartItem.js
Component({
  /**
   * 组件的属性列表
   * cartList：组件信息
   * cartLen：调用组件的列表长度
   * cartIndex：组件调用的下标，0开始
   * chageStep：调用的方法，不同按钮触发
   */
  properties: {
    cartList: Object,
    cartLen: {
      type: Number,
      value: 0,
    },
    cartIndex: {
      type: Number,
      value: 0,
    },
  },
  /**
   * 组件的初始数据
   */
  data: {
    array: ['美国', '中国', '巴西', '日本'],
    index: 0,
  },

  /**
   * 组件的方法列表
   */
  methods: {
    // 1, 删除, 2, 选择, 3, 改变数量减, 4, 设置规格，5, 改变数量加
    chageStep: function (event) {
      let id = event.currentTarget.dataset.id;
      let gid = event.currentTarget.dataset.gid;
      let type = event.currentTarget.dataset.type;
      let txt = event.currentTarget.dataset.txt;
      // console.log("id:" + id + ',' + "type:" + type);
      var myEventDetail = { id: id, type: type, gid: gid, txt: txt } // detail对象，提供给事件监听函数
      var myEventOption = {} // 触发事件的选项
      this.triggerEvent('chageStep', myEventDetail, myEventOption)
    },
  }
})

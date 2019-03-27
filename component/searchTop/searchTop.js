// component/searchTop/searchTop.js
Component({
  /**
   * 组件的属性列表
   * searchTxt：搜索文字
   * isBottom：icon的样式
   * searchType：0，搜索icon在右边，1，搜索icon在左边
   * search：搜索方法
   */
  properties: {
    searchTxt: {
      type: String,
      value: ''
    },
    isBottom: {
      type: Boolean,
      value: true
    },
    searchType:{
      type: String,
      value: '0'
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    search:''
  },

  /**
   * 组件的方法列表
   */
  methods: {
    //表单双向绑定
    bindKeyInput: function (e) {
      let name = e.currentTarget.id;
      this.data.searchTxt = e.detail.value;
      this.setData({
        searchTxt: e.detail.value
      })
    },
    search: function (event) {
      // console.log(this.data.searchTxt)
      // let id = event.currentTarget.dataset.id;
      var myEventDetail = { txt: this.data.searchTxt } // detail对象，提供给事件监听函数
      var myEventOption = {} // 触发事件的选项
      this.triggerEvent('search', myEventDetail, myEventOption)
    },
  }
})

// component/balanceItem/balanceItem.js
const utils = require('../../utils/util.js');
Component({
  /**
   * 组件的属性列表
   * balanceList：组件信息
   * balanceType：类型 0，搜索页调用，1，结算页调用，2，订单详情调用
   * balanceLast：是否最后一个调用
   * balanceStatus：
   */
  properties: {
    balanceList:Object,
    balanceType:{
      type: String,
      value: '1',
    },
    balanceLast: {
      type: Boolean,
      value: false,
    },
    balanceStatus: {
      type: Boolean,
      value: true,
    },
  },

  /**
   * 组件的初始数据
   */
  data: {

  },
  ready: function(){
    if(this.data.balanceType == '1'){
      // this.data.balanceList.totalprice = utils.toPrice(this.data.balanceList.totalprice);
    }else{
      // this.data.balanceList.price = utils.toPrice(this.data.balanceList.price);
    }
    
    this.setData({
      balanceList: this.data.balanceList
    })
  },
  /**
   * 组件的方法列表
   */
  methods: {
    goDetails: function(e){
      let id = e.currentTarget.dataset.id;
      let key = e.currentTarget.dataset.key;
      if (this.data.balanceType == '0'){
        wx.navigateTo({
          url: '/pages/details/details?id=' + id +'&key='+key,
        })
      }
    }
  }
})

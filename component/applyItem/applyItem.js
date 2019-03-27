// component/applyItem/applyItem.js
Component({
  /**
   * 组件的属性列表
   * applyItem：组件信息
   * applyIndex：调用组件的下标 0开始
   */
  properties: {
    applyItem: Object,
    applyIndex: {
      type: Number,
      value: 0,
    },
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
    }
  }
})

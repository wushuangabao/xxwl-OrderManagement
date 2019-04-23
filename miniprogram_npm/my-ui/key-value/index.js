Component({
  /**
   * 组件的属性列表
   */
  properties: {
    // 显示/隐藏 下划线
    showRow: {
      type: Boolean,
      value: false
    },
    // 标题的文本
    key: {
      type: String,
      value: ''
    },
    // 内容的文本
    value: {
      type: String,
      value: ''
    },
    // 是否需要冒号
    colon: {
      type: Boolean,
      value: true
    },
    // 整体的宽度，单位rpx
    width: {
      type: Number,
      value: 750
    },
    // 标题部分的宽度，单位rpx
    labelWidth: {
      type: Number,
      value: 280
    },
    // 标题的显示位置 left top right
    labelLayout: {
      type: String,
      value: 'right'
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
  },

  /**
   * 组件的方法列表
   */
  methods: {}
})
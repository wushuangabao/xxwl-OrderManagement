// pages/input/input.js

const data = require('../../utils/data.js')

Page({

  data: {
    receipt_type: data.receipt_type, //订单类型
    index: 0,
    cif_id: ['', 'xiangpayangle666', 'xiangpayangle667', 'xiangpayangle668'],
    cif_name: ['', '小叮当1', '小叮当2', '小叮当3'],
    cif_id_name: ['请选择客户名称', 'xiangpayangle666 小叮当1', 'xiangpayangle667 小叮当2', 'xiangpayangle668 小叮当3'],
    index_cif: 0,
    //customItem: '全部',
    textAreaValue1: '', //备注
    img_path: ["/imgs/add.png", "/imgs/add.png", "/imgs/add.png", "/imgs/add.png"],
    isAdmin: false,
  },

  //* 点击图片
  onImage: function(event) {
    var that = this,
      index = event.currentTarget.dataset.index
    wx.chooseImage({
      count: 1,
      success: function(res) {
        var tempFilePath = res.tempFilePaths[0],
          str = "img_path[" + index + "]"
        that.setData({
          [str]: tempFilePath
        })
      }
    })
  },

  //* 点击“提交”按钮
  onConfirm: function() {
    var that = this
    if (this.checkValue()) {
      wx.showModal({
        title: '提示',
        content: '是否确认您的填写无误并立刻提交？',
        success: function(res) {
          //用户点击确定
          if (res.confirm) {
            var index = that.data.index,
              index_cif = that.data.index_cif;
            //提交订单(参数：订单类型编号，订单类型名称，备注，客户id，客户昵称)
            data.upLoadRecpt((300 + parseInt(index)).toString(), that.data.receipt_type[index], that.data.textAreaValue1, that.data.cif_id[index_cif], that.data.cif_name[index_cif])
            //上传图片
            var receipt_number
            wx.uploadFile({
              url: 'http://140.143.154.96/root/'+receipt_number, //仅为示例，非真实的接口地址
              filePath: this.img_path[0],
              name: 'file',
              formData: {
                'index': '0'
              },
              success: function (res) {
                var data = res.data
                //do something
              }
            })
          }
        }
      })
    }
  },

  //检查提交的数据是否符合格式(todo)
  checkValue: function() {
    if (this.data.index != 0 && this.data.index_cif != 0)
      return true
    else
      wx.showModal({
        title: '提示',
        content: '请选择订单类型和客户名称！',
        showCancel: false
      })
  },

  //* 输入订单名称
  bindKeyInput1: function(e) {
    this.setData({
      inputValue1: e.detail.value
    })
  },

  //* 输入客户名称
  bindKeyInput2: function(e) {
    this.setData({
      inputValue2: e.detail.value
    })
  },

  //* 输入客户电话
  bindKeyInput2: function(e) {
    this.setData({
      inputValue2: e.detail.value
    })
  },

  //* TextArea失去焦点
  bindTextAreaBlur1: function(e) {
    this.setData({
      textAreaValue1: e.detail.value
    })
  },
  bindTextAreaBlur2: function(e) {
    this.setData({
      textAreaValue2: e.detail.value
    })
  },

  //* 订单类型Picker
  bindPickerChange: function(e) {
    this.setData({
      index: e.detail.value
    })
  },

  //* 客户名称Picker
  bindPickerChange2: function(e) {
    this.setData({
      index_cif: e.detail.value
    })
  },

  //* 客户地址Picker
  bindRegionChange: function(e) {
    this.setData({
      region: e.detail.value
    })
  },

  //* 生命周期函数--监听页面显示
  onShow: function() {
    //判断用户身份是否为管理员
    try {
      var value = wx.getStorageSync('role_type')
      if (value == "01") { //是管理员
        //设置tabBar
        var myTabBar = getApp().globalData.tabBar
        myTabBar.list[0].active = false
        myTabBar.list[1].active = true
        myTabBar.list[2].active = false
        myTabBar.list[3].active = false
        this.setData({
          tabBar: myTabBar,
          isAdmin: true
        })
      }
    } catch (e) {
      // Do something when catch error
    }
  },

  //转发
  onShareAppMessage: function(res) {

  }

})
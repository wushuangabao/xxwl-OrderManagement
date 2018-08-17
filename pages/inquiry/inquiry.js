// pages/inquiry/inquiry.js

var data = require('../../utils/data.js')

Page({

  data: {
    titles: [{
        name: '已完成',
        color_b: '#F8F8F8',
        color_f: '#9E9E9E'
      },
      {
        name: '未完成',
        color_b: '#F8F8F8',
        color_f: '#9E9E9E'
      }
    ],
    index: 0,
    receipt: [],
    isAdmin: false,
    status: "0", //0表示未完成，1表示已完成
  },

  //* 点击“已完成”或“未完成”
  changeTit: function(event) {
    var name = event.currentTarget.dataset.name
    if (name == "未完成") {
      this.changeTitWXSS(1)
      data.getRecptData("0", this.setRecptData)
    } else if (name == "已完成") {
      this.changeTitWXSS(0)
      data.getRecptData("1", this.setRecptData)
    }
  },

  //改变titles数据的WXML标签样式，以及data.status
  changeTitWXSS: function(i) {
    var str1 = 'titles[' + i + '].color_b'
    var str2 = 'titles[' + i + '].color_f'
    var that = this
    that.setData({
      [str1]: '#FFF',
      [str2]: '#000',
    })
    var old_i = that.data.index
    if (i != old_i) {
      str1 = 'titles[' + old_i + '].color_b'
      str2 = 'titles[' + old_i + '].color_f'
      var s
      if (i == 0)
        s = "1"
      else
        s = "0"
      that.setData({
        [str1]: '#F8F8F8',
        [str2]: '#9E9E9E',
        index: i,
        status: s,
      })
    }
  },

  // 设置this.data中的receipt数组
  setRecptData: function(recpt_data) {
    var data_ = recpt_data.data
    console.log("setRecptData")
    console.log(data_)
    var len = data_.length
    for (var i = 0; i < len; i++) {
      data_[i].r_number = data.convertRecptNum(data_[i].receipt_number)
      // remark长度控制
      var note = data.simplfStr(data_[i].remark, 28)
      // receipt_type对应转换
      var r_type = data.convertType(data_[i].receipt_type)
      // 状态对应转换
      var state
      if (data_[i].work_status == "0")
        state = "未完成"
      else
        state = "已完成"
      data_[i].note = note
      data_[i].state = state
      data_[i].type = r_type
      data_[i].r_img = "/imgs/image.png"
    }
    this.setData({
      receipt: data_
    })
  },

  //* 点击“查看进度”
  inquiry: function(event) {
    var r_number = event.currentTarget.dataset.num
    var r_type = event.currentTarget.dataset.type
    //将查询的r_number、r_type写入缓存
    wx.setStorageSync('r_number', r_number)
    wx.setStorageSync('r_type', r_type)
    //根据r_number检索数据在receipt数组中的位置，播放动画
    // var recpts = this.data.receipt,len = recpts.length
    // for (var i = 0; i < len; i++) {
    //   var recpt = recpts[i]
    //   if (recpt.receipt_number == r_number) {
    //     this.playAnima(i)
    //   }
    // }
    //延迟300ms后跳页面
    //setTimeout(function() {
      wx.navigateTo({
        url: '../progress/progress'
      })
    //}.bind(this), 300)
  },

  //播放动画
  playAnima: function(i) {
    var str = 'receipt[' + i + '].animaData'
    var animation = wx.createAnimation({
      duration: 200,
    })
    this.animation = animation
    //缩小
    animation.scale(0.7, 0.7).step()
    this.setData({
      [str]: animation.export()
    })
    //放大
    setTimeout(function() {
      animation.scale(1, 1).step({
        duration: 100
      })
      this.setData({
        [str]: animation.export()
      })
    }.bind(this), 200)
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
        myTabBar.list[1].active = false
        myTabBar.list[2].active = true
        myTabBar.list[3].active = false
        this.setData({
          tabBar: myTabBar,
          isAdmin: true
        })
      }
    } catch (e) {
      // Do something when catch error
    }
    //数据库操作：查询用户所关心的订单列表
    data.getRecptData(this.data.status, this.setRecptData)
  },

  //* 生命周期函数--监听页面加载
  onLoad: function(options) {
    //切换到"未完成"页
    this.changeTitWXSS(1)
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})
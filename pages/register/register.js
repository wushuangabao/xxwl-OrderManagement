// pages/register/register.js

var data = require('../../utils/data.js')

Page({

  data: {
    label0: '用户类型',
    label1: '用户账号',
    label2: '用户密码',
    label3: '密码确认',
    label4: '手机号码',
    index: 2,
    role_type: ['用户', '管理者', '员工'],
    inputValue1: '',
    inputValue2: '',
    inputValue3: '',
  },

  bindPickerChange: function (e) {
    this.setData({
      index: e.detail.value
    })
  },

  bindKeyInput1: function (e) {
    this.setData({
      inputValue1: e.detail.value
    })
  },

  bindKeyInput2: function (e) {
    this.setData({
      inputValue2: e.detail.value
    })
  },

  bindKeyInput3: function (e) {
    this.setData({
      inputValue3: e.detail.value
    })
  },

  //点击确认按钮
  onConfirm: function () {
    var that = this
    var prompt
    var name = this.data.inputValue1
    var passwd1 = this.data.inputValue2
    var passwd2 = this.data.inputValue3
    if (name == '') {
      prompt = '用户名称不能为空！'
    }
    if (passwd1.length < 6) {
      prompt = prompt + '密码不能小于6位！'
    }
    if (passwd1 != passwd2) {
      prompt = prompt + '两次输入的密码不一致！'
    }
    //如果prompt非空，说明输入有误
    if (prompt) {
      wx.showModal({
        title: '提示',
        content: prompt,
        showCancel: false
      })
    }
    //输入符合要求，再次提示是否确认
    else {
      wx.showModal({
        title: '提示',
        content: '是否确认您的填写无误并立刻登录？',
        success: function (res) {
          //用户点击确定，页面跳转
          if (res.confirm) {
            that.doRegister(name, passwd1)
            // wx.switchTab({
            //   url: '/pages/index/index'
            // })
            wx.redirectTo({
              url: '/pages/index/index',
            })
          }
        }
      })
    }
  },

  //提交注册请求
  doRegister: function (user_name, pass_word) {
    //todo:网络请求，提交数据
    //这里暂时代替以修改缓存和data.js
    var users = data.user
    var len = users.length
    var user_id = this.getUserId(len)
    var index = this.data.index
    var role_type = this.data.role_type[index]
    var user_nickname = getApp().globalData.userInfo.nickName
    users[len] = {
      user_id: user_id,
      user_name: user_name,
      pass_word: pass_word,
      role_type: role_type,
      user_nickname: user_nickname,
    }
    data.user = users
    //调试：输出data.user
    console.log(data.user)
    //修改缓存
    wx.setStorageSync('user_name', user_name)
    wx.setStorageSync('user_id', user_id)
    wx.setStorageSync('role_number', parseInt(index))
  },

  //根据序号自动生成user_id（为了在没有数据库的情况下自动生成id）
  getUserId: function (ii) {
    var i = ii + 1
    if (i < 10) { return 'user00' + i }
    else if (i < 100) { return 'user0' + i }
    else { return 'user' + i }
  },

  //* 转发********************************************
  onShareAppMessage: function (res) {
    if (res.from === 'button') { //如果来自页面内转发按钮
      console.log(res.target)
    }
    var path = '/pages/index/index?company_id=' + wx.getStorageSync('company_id') + '&user_id=' + wx.getStorageSync('user_id') + '&company_type=' + wx.getStorageSync('company_type');
    console.log("onShareAppMessage, path =", path)
    return {
      title: '生产管理小程序',
      path: path,
    }
  }
})
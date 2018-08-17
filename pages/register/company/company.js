// pages/login/company/company.js
const data = require('../../../utils/data.js')

Page({

  data: {
    userInfo: {},
    inputValue: '',
    industry_type: ["请选择", "服装"],
    index: 0,
  },

  bindPickerChange: function(e) {
    this.setData({
      index: e.detail.value
    })
  },

  bindKeyInput: function(e) {
    this.setData({
      inputValue: e.detail.value
    })
  },

  //* 点击取消按钮
  onReturn: function() {
    wx.redirectTo({
      url: '/pages/index/index'
    })
  },

  //* 点击注册按钮
  onConfirm: function() {
    var prompt = '',
      company_name = this.data.inputValue
    if (company_name == '') {
      prompt = '企业名称不能为空！'
    }
    if (this.data.index == 0) {
      prompt = prompt + '行业未选择！'
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
        content: '是否确认您的填写无误并立刻注册？',
        success: function(res) {
          //用户点击确定，页面跳转
          if (res.confirm) {
            data.registerCompany(company_name)
            wx.redirectTo({
              url: '/pages/index/index',
            })
          }
        }
      })
    }
  },

  onLoad: function() {
    this.setData({
      userInfo: getApp().globalData.userInfo,
    })
  }
})
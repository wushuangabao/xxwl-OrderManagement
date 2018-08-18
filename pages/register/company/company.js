// pages/login/company/company.js
const data = require('../../../utils/data.js')
const app = getApp()

Page({

  data: {
    userInfo: {},
    inputValue: '',
    industry_name: ["请选择行业"],
    industry_type: [],
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
      that = this,
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
            data.registerCompany(company_name, that.data.industry_type[that.data.index - 1])
            wx.redirectTo({
              url: '/pages/index/index',
            })
          }
        }
      })
    }
  },

  onLoad: function() {
    var industry = app.globalData.industry,
      len = industry.length,
      industry_type = new Array(len),
      industry_name = new Array(len + 1);
    industry_name[0] = "请选择行业";
    for (var i = 0; i < len; i++) {
      industry_name[i + 1] = industry[i].type_name;
      industry_type[i] = industry[i].industry_code + industry[i].industry_type;
    }
    this.setData({
      userInfo: app.globalData.userInfo,
      industry_name: industry_name,
      industry_type: industry_type,
    })
  }
})
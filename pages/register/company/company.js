// pages/login/company/company.js
const data = require('../../../utils/data.js')
const app = getApp()

Page({

  data: {
    userInfo: {},
    inputValue: '',
    industry_name: [
      ["请选择行业"],
      []
    ],
    industry_name_list: [],
    industry_type: [],
    index: [0, 0],
  },

  bindPickerChange: function(e) {
    this.setData({
      index: e.detail.value
    })
  },
  bindPickerColumnChange: function(e) {
    var pickerData = {
      industry_name: this.data.industry_name,
      index: this.data.index
    };
    pickerData.index[e.detail.column] = e.detail.value;
    if (e.detail.column == 0) {
      pickerData.industry_name[1] = this.data.industry_sons[e.detail.value];
      pickerData.index[1] = 0;
    }
    this.setData(pickerData);
  },

  bindKeyInput: function(e) {
    this.setData({
      inputValue: e.detail.value
    })
  },

  //* 点击取消按钮************************
  onReturn: function() {
    app.globalData.wantRegisterCompany = false;
    wx.redirectTo({
      url: '/pages/index/index'
    })
  },

  //* 点击注册按钮************************************************
  onConfirm: function() {
    var prompt = '',
      that = this,
      company_name = this.data.inputValue
    if (company_name == '') {
      prompt = '企业名称不能为空！'
    }
    if (this.data.index[0] === 0 && this.data.index[1] === 0) {
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
          wx.setStorageSync('role_type', "01") //设置用户角色为管理员
          //用户点击确定
          if (res.confirm) {
            data.registerCompany(company_name, that.getIndustryType(), that.registerSuccess);
          }
        }
      })
    }
  },

  //注册成功------------------
  registerSuccess: function(res) {
    if (res.data.company_id) {
      // 将company_id写入缓存
      wx.setStorageSync('company_id', res.data.company_id);
      wx.showToast({
        title: '注册成功',
        icon: 'success',
        duration: 1000
      })
      //页面跳转
      setTimeout(function() { //延时1秒
        wx.redirectTo({
          url: '/pages/index/index',
        });
      }.bind(this), 1000);
      //如果注册失败
    } else {
      console.log('registerCompany...没有得到company_id');
      wx.showModal({
        title: '提示',
        content: "注册失败！请重试...",
        showCancel: false
      })
    }
  },

  // 获取行业代码----------------------------------
  // 形式为industry_code + industry_type字符串
  getIndustryType: function() {
    var name = this.data.industry_name[1][this.data.index[1]],
      name_list = this.data.industry_name_list,
      len = name_list.length,
      type_list = this.data.industry_type;
    for (var i = 0; i < len; i++) {
      if (name === name_list[i]) {
        return type_list[i];
      }
    }
  },

  //* 页面加载****************************************************
  onLoad: function(e) {
    var industry = app.globalData.industry,
      len = industry.length,
      industry_type = new Array(len),
      industry_name_list = new Array(len),
      industry_sons = [
        ["请选择行业"]
      ],
      industry_father = [];
    for (var i = 0; i < len; i++) {
      industry_name_list[i] = industry[i].type_name;
      industry_type[i] = industry[i].industry_code + industry[i].industry_type;
      var father_len = industry_father.length,
        father_id = -1;
      for (var j = 0; j < father_len; j++)
        if (industry_father[j] === industry[i].code_name)
          father_id = j;
      if (father_id === -1) {
        industry_father.push(industry[i].code_name);
        father_id = father_len;
        industry_sons.push([]);
      }
      industry_sons[father_id].push(industry[i].type_name);
    }
    this.setData({
      userInfo: app.globalData.userInfo,
      industry_name_list: industry_name_list,
      industry_name: [industry_father, industry_sons[0]],
      industry_type: industry_type,
      industry_sons: industry_sons,
    })
  },

  //* 转发********************************************
  onShareAppMessage: function(res) {
    if (res.from === 'button') { //如果来自页面内转发按钮
      console.log(res.target)
    }
    var path = '/pages/index/index?company_id=' + wx.getStorageSync('company_id') + '&user_id=' + wx.getStorageSync('user_id')
    console.log("onShareAppMessage, path =", path)
    return {
      title: '生产管理小程序',
      path: path,
    }
  }
})
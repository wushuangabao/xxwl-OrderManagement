//index.js
//获取应用实例
const app = getApp()
const data = require('../../utils/data.js')

Page({
  data: {
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
  },

  // 根据服务器数据设置role_type-------------------------------------
  setRoleType: function(res) {
    console.log("setRoleType...res = ", res)
    if (res.data.sys_modify) {
      wx.setStorageSync('sys_modify', res.data.sys_modify)
    } else {
      console.log("setRoleType...sys_modify读取失败")
    }
    wx.setStorageSync('company_type', res.data.company_type);
    data.getRecptType(); //拉取订单类型的信息
    if (res.data.login_flag == "1") { //用户是第一次使用小程序
      try {
        wx.setStorageSync('company_id', res.data.company_id);
      } catch (e) {}
      wx.redirectTo({
        url: '../register/company/company'
      });
    } else if (res.data.company_id == "00000" && app.globalData.wantRegisterCompany) { //用户是“朋友”
      wx.setStorageSync('company_id', "00000");
      wx.redirectTo({
        url: '../register/company/company'
      });
    } else if (res.data.role_type != null) { //用户不是第一次使用
      wx.setStorageSync('role_type', res.data.role_type);
      wx.setStorageSync('company_id', res.data.company_id);
      wx.setStorageSync('company_type', res.data.company_type);
      this.goTo(res.data.role_type);
    }
  },

  //（废弃）长按motto，用于测试
  bindViewTap: function() {
    var that = this
    wx.showActionSheet({
      itemList: ['企业注册', '管理通讯录', '重新登录', '创建工序'],
      success: function(res) {
        var i = res.tapIndex
        //注册
        if (i == 0) {
          wx.navigateTo({
            url: '../register/company/company'
          })
        }
        //管理通讯录
        else if (i == 1) {
          wx.navigateTo({
            url: '../friends/manage'
          })
        }
        //调整角色类型（测试用）
        else if (i == 2) {
          that.setData({
            hasUserInfo: false,
          })
          app.globalData.userInfo = null;
        }
        //设置工序（测试用）
        else if (i == 3) {
          wx.navigateTo({
            url: '../operate/create'
          })
        }
      },
      fail: function(res) {
        //console.log(res.errMsg)
      }
    })
  },

  //* 页面显示********************************************
  onShow: function() {},

  //* 页面加载**************************************************
  onLoad: function(e) {
    // 尝试获取url中的参数
    console.log("index onLoad, e =", e);
    try {
      if (e.company_id)
        wx.setStorageSync('friend_company_id', e.company_id)
      if (e.user_id)
        wx.setStorageSync('friend_id', e.user_id)
    } catch (e) {}
    // 获取用户信息
    var that = this;
    if (app.globalData.userInfo) {
      this.setData({
        hasUserInfo: true,
        userInfo: app.globalData.userInfo
      })
      setTimeout(function() { //延时1.5秒
        that.initializeAppData();
      }.bind(this), 1500)
    } else if (this.data.canIUse) {
      app.userInfoReadyCallback = res => {
        this.setData({
          hasUserInfo: true,
          userInfo: app.globalData.userInfo
        })
        setTimeout(function() { //延时1.5秒
          that.initializeAppData();
        }.bind(this), 1500)
      }
    }
  },

  // 初始化数据---------------------------------
  initializeAppData() {
    data.getRoleType(this.setRoleType) //调用数据库查询来获取角色信息
    data.getIndustry() //从服务器拉取行业的信息
  },

  // 获取用户信息-----------------------------------
  getUserInfo: function(e) {
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      hasUserInfo: true
    })
    this.initializeAppData();
  },

  //根据身份不同，跳转页面----------------------------
  goTo: function(s) {
    if (s == "02") { //销售
      wx.redirectTo({
        url: '/pages/recpt/input'
      })
    } else if (s == "01") { //管理员
      wx.redirectTo({
        url: '/pages/friends/manage'
      })
    } else if (parseInt(s) > 100 && parseInt(s) < 200) { //不同工种的工人
      wx.redirectTo({
        url: '/pages/operate/operate'
      })
    } else {
      wx.redirectTo({
        url: '/pages/inquiry/inquiry'
      })
    }
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
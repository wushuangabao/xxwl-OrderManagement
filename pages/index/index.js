//index.js
//获取应用实例
const app = getApp()
const data = require('../../utils/data.js')

Page({
  data: {
    motto: '欢迎使用本程序',
    userInfo: {},
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
    if (res.data.login_flag == "1") { //用户是第一次使用小程序
      wx.redirectTo({
        url: '../register/company/company'
      })
    } else if (res.data.role_type != null) { //用户不是第一次使用
      try {
        wx.setStorageSync('role_type', res.data.role_type)
        wx.setStorageSync('company_id', res.data.company_id)
        wx.setStorageSync('company_type', res.data.company_type)
      } catch (e) {
        console.log('setRoleType...设置缓存失败,catch err =', e)
      }
      this.changeRole(res.data.role_type)
    }
  },

  //* 长按motto，用于测试********************************************
  bindViewTap: function() {
    if (this.data.hasUserInfo == false) {
      return
    }
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
            motto: 'TEST:重新登录',
          })

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
  onShow: function() {
    //////////////////////////////////////////
    // 获取userInfo
    //////////////////////////////////////////
    if (app.globalData.userInfo) {
      this.setData({
        hasUserInfo: true,
        userInfo: app.globalData.userInfo
      })
      setTimeout(function () { //延时1秒
        data.getRoleType(this.setRoleType) //调用数据库查询来获取角色信息
        data.getIndustry() //从服务器拉取行业的信息
      }.bind(this), 1000)
    } else if (this.data.canIUse) {
      app.userInfoReadyCallback = res => {
        this.setData({
          hasUserInfo: true,
          userInfo: app.globalData.userInfo
        })
        setTimeout(function () { //延时1秒
          data.getRoleType(this.setRoleType) //调用数据库查询来获取角色信息
          data.getIndustry() //从服务器拉取行业的信息
        }.bind(this), 1000)
      }
    }
  },

  //* 页面加载**************************************************
  onLoad: function(e) {
    ///////////////////////////////////////////
    // 尝试获取url中的参数
    ///////////////////////////////////////////
    console.log("index onLoad, e =", e);
    try {
      if (e.company_id)
        wx.setStorageSync('company_id', e.company_id)
      if (e.friend_id)
        wx.setStorageSync('friend_id', e.user_id)
    } catch (e) {}
  },

  // 获取用户信息-----------------------------------
  getUserInfo: function(e) {
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      hasUserInfo: true
    })
    //调用数据库查询来获取角色信息
    data.getRoleType(this.setRoleType)
  },

  //根据身份不同，跳转页面----------------------------
  goTo: function(s) {
    if (s == "02") { //销售
      wx.redirectTo({
        url: '/pages/input/input'
      })
    } else if (s == "100") { //客户
      wx.redirectTo({
        url: '/pages/inquiry/inquiry'
      })
    } else if (s == "01") { //管理员
      wx.redirectTo({
        url: '/pages/friends/manage'
      })
    } else if (s == "03") { //剩下的是不同工种的工人
      wx.redirectTo({
        url: '/pages/operate/operate'
      })
    }
  },

  //改变使用者的role（角色）--------------------------
  changeRole: function(s) {
    //修改缓存
    try {
      wx.setStorageSync('role_type', s)
    } catch (e) {}
    //判断角色，设置TabBar
    var role
    if (s == "100") {
      role = '客户'
    } else if (s == "02") {
      role = '销售'
    } else if (s == "01") {
      role = '管理员'
    } else { //剩下的是不同工种的工人
      role = '工人'
    }
    //设置motto的内容
    var str = '我的身份：' + role
    this.setData({
      motto: str,
    })
    //延迟2秒后，进入与身份对应的页面
    setTimeout(function() {
      this.goTo(s)
    }.bind(this), 2000)
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
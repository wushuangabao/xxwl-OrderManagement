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
    industry: ["服装生产", "more"],
    index: 0,
    isAdmin: false,
  },

  // 根据服务器数据设置role_type
  setRoleType: function(res) {
    console.log("setRoleType...", res)
    if (res.data.login_flag == "1") {
      wx.setStorageSync('role_type', "01")
      wx.redirectTo({
        url: '../register/company/company'
      })
    } else if (res.data.role_type != null) {
      wx.setStorageSync('role_type', res.data.role_type)
      wx.setStorageSync('company_id', res.data.company_id)
      this.changeRole(res.data.role_type)
    }
  },

  //* 长按motto，用于测试
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
            userInfo: {},
            isAdmin: false,
            motto: '欢迎使用本程序',
          })
          // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
          // 所以此处加入 callback 以防止这种情况
          app.userInfoReadyCallback = res => {
            this.setData({
              userInfo: res.userInfo,
              hasUserInfo: true,
            })
          }
        }
        //查看启动日志（测试用）
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
    // 7/31测试 网络请求
    // wx.request({
    //   url: "http://140.143.154.96/day07/logonAuthServlet",//'http://140.143.154.96/day07/loginServlet',
    //   data: {},
    //   // header: {
    //   //   'content-type': 'application/json'
    //   // },
    //   success: function(res) {
    //     console.log(res)
    //     var obj = JSON.parse(res.data)
    //     console.log(obj)
    //   }
    // })
  },

  //于7/28弃用 询问是否注销、重新注册（0）或登录（1）
  askReLogIn: function(i) {
    var that = this
    wx.showModal({
      title: '提示',
      content: '您已拥有账户，并已经处于登录的状态。是否注销？',
      success: function(res) {
        //用户点击确定，清空user_id及相关缓存（表示注销）
        if (res.confirm) {
          wx.setStorageSync('user_id', '')
          wx.removeStorageSync('user_name')
          wx.setStorageSync('role_type', '')
          that.setData({
            motto: '您的身份：游客'
          })
          if (i == 0) { //注册
            wx.navigateTo({
              url: '../register/register'
            })
          } else if (i == 1) { //登录
            wx.navigateTo({
              url: '../login/login'
            })
          }
        }
      }
    })
  },

  //* 页面显示
  onShow: function() {
    var that = this
    //获取并修改role（角色）信息
    try {
      var value = wx.getStorageSync('role_type')
      if (value != "") {
        that.changeRole(value)
      }
    } catch (e) {
      // Do something when catch error
    }
  },

  //* 页面加载
  onLoad: function(e) {
    // 尝试获取company_id
    console.log("index onLoad, e = ", e);
    var value;
    try {
      value = e.company_id
    } catch (err) {}
    if (value)
      wx.setStorageSync('company_id', value);
    //
    // 获取userInfo
    if (app.globalData.userInfo) {
      this.setData({
        // 弃用头像的显示 userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true,
        })
      }
    }
  },

  // 获取用户信息
  getUserInfo: function(e) {
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
    //调用数据库查询来获取角色信息
    data.getRoleType(this.setRoleType)
  },

  //根据身份不同，跳转页面
  goTo: function(s) {
    if (s == "02") {
      wx.redirectTo({
        url: '/pages/input/input'
      })
    } else if (s == "100") {
      wx.redirectTo({
        url: '/pages/inquiry/inquiry'
      })
    } else if (s == "03") { //剩下的是不同工种的工人
      wx.redirectTo({
        url: '/pages/operate/operate'
      })
    }
  },

  //根据身份不同，跳转页面（测试版，可返回主页）
  testTo: function(s) {
    if (s == "03") {
      wx.navigateTo({
        url: '/pages/operate/operate'
      })
    } else if (s == "02") {
      wx.navigateTo({
        url: '/pages/input/input'
      })
    } else if (s == "100") {
      wx.navigateTo({
        url: '/pages/inquiry/inquiry'
      })
    }
  },

  //改变使用者的role（角色）-------------------
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
      //设置TabBar
      var myTabBar = app.globalData.tabBar
      myTabBar.list[0].active = true
      myTabBar.list[1].active = false
      myTabBar.list[2].active = false
      myTabBar.list[3].active = false
      this.setData({
        isAdmin: true,
        tabBar: myTabBar
      })
    } else if (s == "03") { //剩下的是不同工种的工人
      role = '工人'
    }
    //设置motto的内容
    var str = '我的身份：' + role
    this.setData({
      motto: str,
    })
    //如果身份非管理员，直接进入可操作的页面
    if (s != "01") {
      this.goTo(s)
    }
  },

  // （未来可能用到的） 选择行业
  bindPickerChange: function(e) {
    this.setData({
      index: e.detail.value
    })
  },

  //转发
  onShareAppMessage: function(res) {
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
    }
    var path = '/pages/index/index?company_id=' + wx.getStorageSync('company_id')
    return {
      title: '自定义转发标题',
      path: path,
    }
  }

})
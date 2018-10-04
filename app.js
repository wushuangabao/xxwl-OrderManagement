//app.js

App({
  onLaunch: function() {

    // 展示本地存储能力
    // var logs = wx.getStorageSync('logs') || []
    // logs.unshift(Date.now())
    // wx.setStorageSync('logs', logs)

    // 登录
    wx.login({
      success: function(res) {
        var that = this;
        if (res.code)
          wx.setStorageSync('code', res.code); //准备发送code到后台换取 openId, sessionKey, unionId
        else
          console.log('wx.login.....code获取失败' + res.errMsg);
        //尝试读取缓存中的user_id
        var user_id = wx.getStorageSync('user_id');
        if (user_id)
          console.log("wx.login...缓存中的user_id =", user_id);
        else {
          console.log("wx.login...缓存中的user_id获取失败");
          //wx.setStorageSync('user_id', '00000');
        }
      }
    })

    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
  },

  globalData: {
    wantRegisterCompany: true,
    userInfo: null,
    industry: null, //行业类型数据，从服务器拉取
    tabBar: {
      "color": "#9E9E9E",
      "selectedColor": "#f00",
      "backgroundColor": "#fff",
      "borderStyle": "#ccc",
      "list": [{
          "pagePath": "/pages/friends/manage",
          "text": "我的商群",
          "iconPath": "/imgs/mine.png",
          "selectedIconPath": "/imgs/mine_fill.png",
          "selectedColor": "#1aad19",
          active: false
        },
        {
          "pagePath": "/pages/recpt/input",
          "text": "录入订单",
          "iconPath": "/imgs/barrage.png",
          "selectedIconPath": "/imgs/barrage_fill.png",
          "selectedColor": "#1aad19",
          active: false
        },
        {
          "pagePath": "/pages/inquiry/inquiry",
          "text": "我的订单",
          "iconPath": "/imgs/browse.png",
          "selectedIconPath": "/imgs/browse_fill.png",
          "selectedColor": "#1aad19",
          active: false
        },
        {
          "pagePath": "/pages/operate/operate",
          "text": "我的工单",
          "iconPath": "/imgs/brush.png",
          "selectedIconPath": "/imgs/brush_fill.png",
          "selectedColor": "#1aad19",
          active: false
        }
      ],
      "position": "bottom"
    }
  }

})
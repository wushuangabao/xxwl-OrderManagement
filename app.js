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
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        if (res.code) {
          try { //尝试读取缓存中的user_id
            var user_id = wx.getStorageSync('user_id');
            if (user_id)
              console.log("wx.login...缓存中的user_id =", user_id);
            else //如果不能拿到缓存中的user_id，就向服务器获取
              wx.request({
                url: 'https://api.weixin.qq.com/sns/jscode2session?appid=wxc70057280c56f254&secret=4b1176fdf52fa6bb86f0969bc2569dbb&js_code=' + res.code + '&grant_type=authorization_code',
                method: "POST",
                success: function(res) {
                  wx.setStorageSync('user_id', res.data.openid)
                  console.log("wx.login...成功向服务器获取user_id!")
                }
              })
          } catch (e) { //如果不能拿到缓存中的user_id，就向服务器获取
            wx.request({
              url: 'https://api.weixin.qq.com/sns/jscode2session?appid=wxc70057280c56f254&secret=4b1176fdf52fa6bb86f0969bc2569dbb&js_code=' + res.code + '&grant_type=authorization_code',
              method: "POST",
              success: function(res) {
                wx.setStorageSync('user_id', res.data.openid)
                console.log("wx.login...成功向服务器获取user_id!")
              }
            })
          }
        } else {
          console.log('获取用户登录态失败！' + res.errMsg)
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
          "pagePath": "/pages/input/input",
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
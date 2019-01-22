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

    //* 转发*********************************************
    shareApp: function(res) {
      if (res.from === 'button') { //如果来自页面内转发按钮
        console.log(res.target)
      }
      var path = '/pages/index/index?company_id=' + wx.getStorageSync('company_id') + '&user_id=' + wx.getStorageSync('user_id') + '&company_type=' + wx.getStorageSync('company_type'); //+ '&role_type=' + wx.getStorageSync('role_type');
      console.log("onShareAppMessage, path =", path);
      return {
        title: '生产管理小程序',
        path: path,
      }
    },

    ////////////////////////////////////////////////////
    // moreInfo menu 路由菜单
    ////////////////////////////////////////////////////
    // 设置moreInfo菜单的内容--------------------------
    setMenu: function(that, contents, str_type, associate_code) {
      //遍历contents数组中的[str_type]属性，将它们添加到数组types中
      var len = contents.length;
      if (len == 0)
        return;
      var types = [contents[0][str_type]];
      for (var i = 1; i < len; i++) {
        var n = types.length,
          type = contents[i][str_type],
          b = false;
        for (var j = 0; j < n; j++) {
          if (type === types[j]) {
            b = true;
            break;
          }
        }
        if (!b)
          types.push(type);
      }
      // that.setData({
      //   types: types
      // });
      // console.log("types=",types);
      //根据不同的types，查询若干个路由菜单列表，以type为key将这些列表放入menuObject
      len = types.length;
      for (var i = 0; i < len; i++) {
        var args = ['menuObject.' + types[i], that];
        var param = {
          their_scene_code: "01", //暂时写死
          their_scene_type: wx.getStorageSync('role_type'), //暂时写死
          their_scene_name: "用户", //暂时写死
          their_associate_code: associate_code,
          their_associate_type: types[i],
          their_associate_name: this.convertCode(associate_code),
        };
        // console.log(param);
        require('utils/data.js').getParamsByEntity(param, this.setMenuObject, args);
      }
    },
    setMenuObject: function(res, args) {
      var data = res.data,
        l = data.length;
      console.log("setMenu...res.data = ", data, "args=", args);
      if (l > 0) {
        args[1].setData({
          [args[0]]: data
        })
      }
    },

    //* 显示更多内容（显示路由菜单）*******************************************
    showMoreInfo: function(that, index, content_type, goByIdFunc) {
      var self = this,
        menuList = that.data.menuObject[content_type],
        itemList = [];
        console.log("menuList=",menuList)
      if (menuList.length <= 1) {
        goByIdFunc(index);
        return;
      }
      for (var i = 0; i < menuList.length; i++)
        itemList.push(menuList[i].other_associate_name);
      wx.showActionSheet({
        itemList: itemList,
        success(res) {
          var value = menuList[res.tapIndex].other_associate_code,
            name = menuList[res.tapIndex].other_associate_name;
          if (name == "详情")//此处用other_associate_code判断的话，会跳转到list页面而非详情页面
            goByIdFunc(index);
          else if (name == "代理商")
            wx.navigateTo({
              url: "/pages/friends/roleSale/manage"
            });
          else
            wx.navigateTo({
              url: self.getUrlByCode(value),
            });
          //设置接下来：从朋友这边跳转到页面时，屏蔽tabBar，且查询所用参数为该朋友的
          
        }
      })
    },

    //////////////////////////////////////////////////////////
    // tabBar
    //////////////////////////////////////////////////////////
    tabBar: {
      "color": "#9E9E9E",
      "selectedColor": "#f00",
      "backgroundColor": "#fff",
      "borderStyle": "#ccc",
      "list": [],
      "position": "bottom"
    },

    getTabBarListItem: function(data) {
      var entity_code = data.entity_code; //商群01、工单02、订单03、评价单04、业务单据05、记账凭证06、内容07、钱包08、店铺09、商品10
      var listItem = {
        pagePath: "",
        text: data.entity_name,
        iconPath: "",
        selectedIconPath: "",
        selectedColor: "#1aad19",
        active: false,
        //number: parseInt(data.serial_number),
      };
      listItem.pagePath = this.getUrlByCode(entity_code);
      listItem.iconPath = "/imgs/" + entity_code + ".png";
      listItem.selectedIconPath = "/imgs/" + entity_code + "_fill.png";
      return listItem;
    },

    convertCode: function(code) {
      var str = "";
      switch (code) {
        case "01":
          str = "用户";
          break;
        case "02":
          str = "工单";
          break;
        case "03":
          str = "订单";
          break;
        case "05":
          str = "业务单据";
          break;
        case "06":
          str = "记账凭证";
          break;
        case "07":
          str = "内容";
          break;
        case "08":
          str = "账户"; //钱包
          break;
        case "09":
          str = "店铺";
          break;
        case "10":
          str = "商品";
          break;
        case "11":
          str = "CLASS";
          break;
        case "90":
          str = "报表";
          break;
        case "98":
          str = "系统";
          break;
      }
      return str;
    },

    getUrlByCode: function(code) {
      var str = "";
      switch (code) {
        case "01":
          str = "/pages/friends/manage";
          break;
        case "02":
          str = "/pages/operate/operate";
          break;
        case "03":
          str = "/pages/inquiry/inquiry";
          break;
        case "05":
          str = "业务单据";
          break;
        case "06":
          str = "记账凭证";
          break;
        case "07":
          str = "/pages/market/content/list";
          break;
        case "08":
          str = "/pages/market/wallet/wallet";
          break;
        case "09":
          str = "/pages/market/shop/list";
          break;
        case "10":
          str = "商品";
          break;
        case "11":
          str = "CLASS";
          break;
        case "90":
          str = "报表";
          break;
        case "98":
          str = "系统";
          break;
      }
      return str;
    },
  }

})
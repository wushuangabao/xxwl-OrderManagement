const app = getApp(),
  data = require('../../utils/data.js');

Page({
  data: {
    hasUserInfo: false,
    // wx.canIUse判断小程序的API，回调，参数，组件等是否可用。
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    signal: "00",
    debug: true, //开发者模式
    pageDebug: [
      "by role_type",
      "/pages/message/list",
    ],
  },

  // 根据服务器数据设置role_type等信息-------------------------------------
  setRoleType: function(res) {
    console.log("设置角色类型...res.data = ", res.data);

    // 设置缓存
    if (res.data.sys_modify)
      wx.setStorageSync('sys_modify', res.data.sys_modify);
    else
      console.log("setRoleType...sys_modify读取失败");
    wx.setStorageSync('company_type', res.data.company_type);

    // 拉取订单类型
    data.getRecptType();

    // 设置user_id
    var user_id = wx.getStorageSync('user_id');
    if (user_id == '00000' || !user_id) {
      if (res.data.hasOwnProperty('openid')) {
        user_id = res.data.openid;
        wx.setStorageSync('user_id', user_id);
      } else {
        wx.lin.showMessage({
          type: 'error',
          duration: 4000,
          content: '用户id获取失败，稍后将再次尝试登录'
        });
        var that = this;
        setTimeout(function() {
          that.initializeAppData();
        }.bind(this), 4000);
        return;
      }
    }

    //注释掉下面的大段代码后新增-------------
    //为了省去注册公司的环节
    wx.setStorageSync('role_type', res.data.role_type);
    wx.setStorageSync('company_id', res.data.company_id);
    data.getEntityOfRole(this.setEntityOfRole); //获取角色对应的tabBar（实体）
    //-------------------------------------
    //用户是第一次使用小程序，则判断是否有公司id
    // if (res.data.login_flag == "1") {
    //   try {
    //     wx.setStorageSync('company_id', res.data.company_id);
    //   } catch (e) {}
    //   wx.redirectTo({
    //     url: '../register/company/company'
    //   });
    // }
    //用户不是第一次使用，用户是“朋友”（公司id为00000），并且想要注册公司
    // else if (res.data.company_id == "00000" && app.globalData.wantRegisterCompany) {
    //   wx.setStorageSync('company_id', "00000");
    //   wx.redirectTo({
    //     url: '../register/company/company'
    //   });
    // }
    //用户不是第一次使用，用户有角色类型
    // else if (res.data.role_type != null) {
    // wx.setStorageSync('role_type', res.data.role_type);
    // wx.setStorageSync('company_id', res.data.company_id);
    // data.getEntityOfRole(this.setEntityOfRole); //获取角色对应的tabBar（实体）
    //}
  },

  // 设置TabBar，然后跳转页面--------------------------
  setEntityOfRole: function(res) {
    var data = res.data,
      len = data.length;
    console.log("获取导航栏信息：", data);
    var myList = [];
    for (var i = 1; i <= len; i++) {
      var index = i - 1;
      if (data[index].serial_number == i) {
        var listItem = app.globalData.getTabBarListItem(data[index]);
        myList[index] = listItem;
      }
    }
    console.log("myList = ", myList);
    app.globalData.tabBar.list = myList;
    //
    if (this.data.signal === "00")
      if (!this.data.debug)
        // 跳转页面
        this.goTo(wx.getStorageSync('role_type'));
      else
        // 开发者模式
        return;
    else {
      // 跳转到分享的页面
      var url;
      switch (this.data.signal) {
        case "09": //店铺
          url = "/pages/market/shop/list?signal=09";
          break;
        case "07": //内容
          url = "/pages/market/content/list?signal=07";
          break;
      }
      wx.redirectTo({
        url: url
      });
    }
  },

  //* 页面加载**************************************************
  onLoad: function(e) {
    // if(!e.signal) //这段代码用于测试，模拟收到店铺的分享
    // {wx.redirectTo({
    //   url: "/pages/market/shop/list?their_associate_code=01&their_associate_type=301&their_associate_number=oh1zH5QdEhZG_k44r-VEKO8uhCPw&their_associate_name=无双BaOY_WHA&other_associate_name=京东店铺&other_associate_code=07&other_associate_number=002&other_associate_type=01"
    // })
    // return}

    // if (!e.signal) //这段代码用于测试，模拟收到内容的分享
    // {
    //   wx.redirectTo({
    //     url: "/pages/market/content/content?their_associate_code=01&their_associate_type=301&their_associate_number=oh1zH5QdEhZG_k44r-VEKO8uhCPw&their_associate_name=分享者用户名&other_associate_name=财务喜讯&other_associate_code=07&other_associate_number=002&other_associate_type=01&url=https://www.xiangxun1.com/day07/index.jsp"
    //   })
    //   return
    // }

    // 若有转发记号
    if (e.hasOwnProperty('signal')) {
      this.setData({
        signal: e.signal
      });
    }

    // 尝试获取url中的参数
    console.log("index onLoad, e =", e);
    if (e.company_id)
      wx.setStorageSync('friend_company_id', e.company_id);
    if (e.user_id)
      wx.setStorageSync('friend_id', e.user_id);
    if (e.company_type)
      wx.setStorageSync('friend_company_type', e.company_type);
    if (e.et) {
      var info = {
        entity_type: e.et,
        associate_type: e.at,
        associate_number: e.anum,
        associate_name: e.anam
      };
      wx.setStorageSync('info', info);
    } else {
      var info = {
        entity_type: '00',
        associate_type: '000',
        associate_number: '0000000000000000000',
        associate_name: ''
      };
      wx.setStorageSync('info', info);
    }

    // 获取用户信息
    var that = this;
    // 用户信息已存在
    if (app.globalData.userInfo) {
      this.setData({
        hasUserInfo: true
      });
      that.initializeAppData();
    }
    // 用户信息不存在
    else if (this.data.canIUse) {
      app.userInfoReadyCallback = res => {
        console.log("执行app.userInfoReadyCallbackde回调函数，res = ", res);
        this.setData({
          hasUserInfo: true
        });
        that.initializeAppData();
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

  //根据role_type跳转页面----------------------------
  goTo: function(s) {
    var url = '';
    if (s == "301" || s == "100") { //市场（代理商）或客户
      // url = '/pages/friends/roleSale/manage';
      url = '/pages/friends/manage';
    } else if (s == "02") { //销售
      url = '/pages/recpt/input'
    } else if (s == "01") { //管理员
      url = '/pages/friends/manage'
    } else if (parseInt(s) > 100 && parseInt(s) < 200) { //不同工种的工人
      url = '/pages/operate/operate'
    } else { //其他角色
      url = '/pages/market/content/content?content_id=00000&content_name=咨询页面&content_type=00&url=https://www.xiangxun1.com/day07/index.jsp';
    }
    wx.redirectTo({
      url: url
    });
  },

  //* debug*********************
  debugPage: function(e) {
    var that = this,
      id = e.currentTarget.id;
    if (id == 0)
      this.goTo(wx.getStorageSync('role_type'));
    else
      wx.redirectTo({
        url: that.data.pageDebug[id]
      });
  },

  //* 转发************************
  onShareAppMessage: function(res) {
    app.globalData.shareApp(res);
  },

})
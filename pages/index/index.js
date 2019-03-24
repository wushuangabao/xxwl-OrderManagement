//index.js
//获取应用实例
const app = getApp()
const data = require('../../utils/data.js')

Page({
  data: {
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    signal: "00",
    debug: true, //开发者模式
  },

  // 根据服务器数据设置role_type等信息-------------------------------------
  setRoleType: function(res) {
    console.log("setRoleType...res.data = ", res.data);
    if (res.data.sys_modify) {
      wx.setStorageSync('sys_modify', res.data.sys_modify)
    } else {
      console.log("setRoleType...sys_modify读取失败")
    }
    wx.setStorageSync('company_type', res.data.company_type);
    data.getRecptType(); //拉取订单类型的信息
    //设置user_id-------------------------------
    var user_id = wx.getStorageSync('user_id');
    if (user_id == '00000' || !user_id) {
      if (res.data.hasOwnProperty('openid')) {
        user_id = res.data.openid
        wx.setStorageSync('user_id', user_id);
        console.log('setRoleType...user_id:', user_id);
      } else {
        console.log('setRoleType...opnenid获取失败，user_id设置失败...2秒后重新登录');
        var that = this;
        setTimeout(function() {
          that.initializeAppData();
        }.bind(this), 2000);
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

  // 设置TabBar--------------------------
  setEntityOfRole: function(res) {
    var data = res.data,
      len = data.length;
    console.log("setEntityOfRole...res.data = ", data);
    var myList = [];
    for (var i = 1; i <= len; i++) {
      var index = i - 1;
      if (data[index].serial_number == i) {
        var listItem = app.globalData.getTabBarListItem(data[index]);
        myList[index] = listItem;
      }
    }
    app.globalData.tabBar.list = myList;
    //开发者模式：
    if(this.data.debug)
    {
      wx.redirectTo({
        url: '/pages/message/list', //用于测试的页面
      })
      return;
    }
    //初始化完毕，准备跳转页面----------------
    if (this.data.signal === "00")
      this.goTo(wx.getStorageSync('role_type'));
    else {
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

    // 若有转发记号-------------
    if (e.hasOwnProperty('signal')) {
      this.setData({
        signal: e.signal
      });
    }

    // 尝试获取url中的参数-------
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

    // 获取用户信息----------
    var that = this;
    if (app.globalData.userInfo) { //若用户信息已存在
      this.setData({
        hasUserInfo: true,
        userInfo: app.globalData.userInfo
      });
      that.initializeAppData();
    } else if (this.data.canIUse) {
      app.userInfoReadyCallback = res => {
        this.setData({
          hasUserInfo: true,
          userInfo: app.globalData.userInfo
        });
        setTimeout(function() {
          that.initializeAppData();
        }.bind(this), 1000);
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
    } else {
      // url = '/pages/inquiry/inquiry';
      url = '/pages/market/content/content?content_id=00000&content_name=咨询页面&content_type=00&url=https://www.xiangxun1.com/day07/index.jsp';
      // url = '/pages/register/company/company';
    }
    wx.redirectTo({
      url: url
    });
  },

  //* 转发********************************************
  onShareAppMessage: function(res) {
    app.globalData.shareApp(res);
  }

  //（废弃）长按motto，用于测试
  // bindViewTap: function() {
  //   var that = this
  //   wx.showActionSheet({
  //     itemList: ['企业注册', '管理通讯录', '重新登录', '创建工序'],
  //     success: function(res) {
  //       var i = res.tapIndex
  //       //注册
  //       if (i == 0) {
  //         wx.navigateTo({
  //           url: '../register/company/company'
  //         })
  //       }
  //       //管理通讯录
  //       else if (i == 1) {
  //         wx.navigateTo({
  //           url: '../friends/manage'
  //         })
  //       }
  //       //调整角色类型（测试用）
  //       else if (i == 2) {
  //         that.setData({
  //           hasUserInfo: false,
  //         })
  //         app.globalData.userInfo = null;
  //       }
  //       //设置工序（测试用）
  //       else if (i == 3) {
  //         wx.navigateTo({
  //           url: '../operate/create'
  //         })
  //       }
  //     },
  //     fail: function(res) {
  //       //console.log(res.errMsg)
  //     }
  //   })
  // },

})
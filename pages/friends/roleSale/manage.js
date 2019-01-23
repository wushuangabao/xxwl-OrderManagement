// pages/friends/manage.js

const data = require('../../../utils/data.js'),
  app = getApp();

Page({
  data: {
    titles: [{
        index: 0,
        name: '一级',
        color_b: '#F8F8F8',
        color_f: '#9E9E9E'
      },
      {
        index: 1,
        name: '二级',
        color_b: '#F8F8F8',
        color_f: '#9E9E9E'
      },
      {
        index: 2,
        name: '三级',
        color_b: '#F8F8F8',
        color_f: '#9E9E9E'
      },
      {
        index: 3,
        name: '四级',
        color_b: '#F8F8F8',
        color_f: '#9E9E9E'
      },
    ],
    index: 0,
    friendsInfo: [],
    multiIndex: [0, 0],
    hasTabBar: true,
  },

  //* 点击Tit事件*****************************************************
  changeTit: function(event) {
    var id = event.currentTarget.dataset.id;
    this.changeTitWXSS(id);
    wx.setStorageSync('level', id);
    var level_code = "0" + (id + 1).toString();
    data.getUsersByLevel(level_code, this.setFriendsInfo);
  },

  // 设置FriendsInfo数组数据-----------------------------------------
  setFriendsInfo: function(res) {
    var friendsList = res.data,
      len = friendsList.length;
    console.log("setFriendsInfo:", friendsList)
    for (var i = 0; i < len; i++) {
      friendsList[i].index = i;
      if (!friendsList[i].image_address || friendsList[i].image_address == 0)
        friendsList[i].image_address = "/imgs/image.png"; //无头像时顶替用
    }
    this.setData({
      friendsInfo: friendsList
    });
  },

  // 设置MoreInfo menu（路由菜单）的内容-------------
  setMenu: function(res) {
    var data = res.data,
      len = data.length;
    console.log("setMenu...res.data =", data);
    if (len != 0) {
      this.setData({
        ['menuObject.301']: data
      });
    }
  },

  //* 显示更多朋友的有关信息*********************************
  showMoreInfo: function(e) {
    var index = e.currentTarget.dataset.id,
      friend = this.data.friendsInfo[index];
    app.globalData.setTheirInfo("01", friend.role_type, friend.user_id);
    app.globalData.showMoreInfo(this, index, '301', console.log); //这里console.log暂时替代goToFriendById函数
  },

  // 改变titles数据的WXML标签样式-----------------------------
  changeTitWXSS: function(i) {
    var str1 = 'titles[' + i + '].color_b',
      str2 = 'titles[' + i + '].color_f',
      that = this
    that.setData({
      [str1]: '#FFF',
      [str2]: '#000',
    })
    var old_i = that.data.index
    if (i != old_i) {
      str1 = 'titles[' + old_i + '].color_b'
      str2 = 'titles[' + old_i + '].color_f'
      that.setData({
        [str1]: '#F8F8F8',
        [str2]: '#9E9E9E',
        index: i,
      })
    }
  },

  //* 生命周期函数--监听页面加载*************************************
  onLoad: function(options) {
    var param, level = parseInt(wx.getStorageSync('level')) + 1,
      level_code = "0" + level.toString();
    if (options.hasTabBar == "false") {
      this.setData({
        hasTabBar: false
      });
      param = app.globalData.param;
    } else {
      var param = {
        their_associate_code: "01",
        their_associate_type: wx.getStorageSync('role_type'),
        their_associate_number: wx.getStorageSync('user_id'),
        their_associate_name: app.globalData.userInfo.nickName,
        their_associate_code: "01",
        their_associate_type: "301",
        their_associate_name: "代理商",
      };
    }
    this.setData({
      param: param
    });
    this.changeTitWXSS(level);
    wx.setStorageSync('level', level);
    data.getUsersByLevel2(level_code, param, this.setFriendsInfo);
    data.getParamsByEntity({
      their_scene_code: "01",
      their_scene_type: "301",
      their_scene_name: "商群",
      their_associate_code: "01",
      their_associate_type: "301",
      their_associate_name: "代理商",
    }, this.setMenu); //设置MoreInfo menu的内容
  },

  //* 生命周期函数--监听页面显示*************************************
  onShow: function() {
    wx.setStorageSync('level', this.data.index);
    //设置tabBar
    var myTabBar = getApp().globalData.tabBar,
      len = myTabBar.list.length;
    for (var i = 0; i < len; i++) {
      if (myTabBar.list[i].text == "商群")
        myTabBar.list[i].active = true;
      else
        myTabBar.list[i].active = false;
    }
    this.setData({
      tabBar: myTabBar,
    });
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {},

  //* 生命周期函数--监听页面卸载***************
  onUnload: function() {
    wx.setStorageSync('level', wx.getStorageSync('level') - 1);
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  //* 转发********************************************
  onShareAppMessage: function(res) {
    app.globalData.shareApp(res);
  }
})
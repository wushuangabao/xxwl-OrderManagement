// pages/friends/manage.js

const data = require('../../../utils/data.js')

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
    // worker: [],
    multiIndex: [0, 0],
    // infoReady: null,
  },

  //* 点击Tit事件*****************************************************
  changeTit: function(event) {
    var id = event.currentTarget.dataset.id;
    this.changeTitWXSS(id);
    var level_code = "0" + (id + 1).toString();
    data.getUsersByLevel(level_code, this.setFriendsInfo)
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
    })
    //设置selector--------
    this.setData({
      selectorArray: null
    });
    var param = {
      their_scene_code: "01", //表示用户
      their_scene_type: "301", //role_type，小程序进入的模式。为测试暂时写死为“代理商”模式
      their_scene_name: "商群",
      their_associate_code: "01",
      their_associate_type: "301",
      their_associate_name: "代理商",
    };
    data.getParamsByEntity(param, this.setParamsByEntity);
    data.getParamsByEntity(param, this.setParamsByEntity);
    param.their_scene_type = "000";
    data.getParamsByEntity(param, this.setParamsByEntity);
  },

  // 设置selector-------------
  setParamsByEntity: function(res) {
    if (this.data.selectorArray)
      return;
    var data = res.data,
      len = data.length,
      array = new Array(len);
    console.log("setParamsByEntity...res.data = ", data);
    if (len > 0) {
      for (var i = 0; i < len; i++) {
        array[i] = data[i].other_associate_name;
      }
      this.setData({
        selectorArray: array
      });
    }
  },

  //* 显示更多朋友的有关信息*********************************
  showMoreInfo: function() {
    var that = this,
      url = "";
    wx.showActionSheet({
      itemList: that.data.selectorArray,
      success(res) {
        var value = that.data.selectorArray[res.tapIndex];
        switch (value) {
          case "内容":
            url = "/pages/market/content/list";
            break;
          case "订单":
            url = "/pages/inquiry/inquiry";
            break;
        }
        wx.navigateTo({
          url: url,
        });
      },
      fail(res) {
        console.log(res.errMsg)
      }
    })
  },

  // 改变titles数据的WXML标签样式-----------------------------------
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
    this.changeTitWXSS(0)
    data.getUsersByLevel("01", this.setFriendsInfo)
    // data.getParam("01", this.setSelector)
  },

  //* 生命周期函数--监听页面显示*************************************
  onShow: function() {
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
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

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
// pages/friends/manage.js

const data = require('../../utils/data.js')

Page({
  /**
   * 页面的初始数据
   */
  data: {
    titles: [{
        index: 0,
        name: '朋友',
        color_b: '#F8F8F8',
        color_f: '#9E9E9E'
      },
      {
        index: 1,
        name: '伙伴',
        color_b: '#F8F8F8',
        color_f: '#9E9E9E'
      },
      {
        index: 2,
        name: '员工',
        color_b: '#F8F8F8',
        color_f: '#9E9E9E'
      },
      {
        index: 3,
        name: '客户',
        color_b: '#F8F8F8',
        color_f: '#9E9E9E'
      },
    ],
    index: 3,
    friendsInfo: [],
    multiArray: [
      ['客户', '员工', '伙伴', '朋友'],
      ['']
    ],
    worker: [],
    multiIndex: [0, 0],
    infoReady: null,
  },

  // 中文转化为数字---------------------------------------------------
  // “1”：客户 “2”：员工 “3”：伙伴 “0”：其他
  convertTitType: function(id) { //id是Tit的index
    return this.convertType(this.data.titles[id].name);
  },
  convertType: function(str) { // 将user_type中文转化为代码
    switch (str) {
      case '客户':
        return "1";
      case '员工':
        return "2";
      case '伙伴':
        return "3";
      case '朋友':
        return "0";
    }
  },

  //* 点击Tit事件*****************************************************
  changeTit: function(event) {
    var id = event.currentTarget.dataset.id,
      user_type = this.convertTitType(id);
    this.changeTitWXSS(id)
    data.getFriendsList(user_type, this.setFriendsInfo)
  },

  // 设置FriendsInfo数组数据-----------------------------------------
  setFriendsInfo: function(res) {
    var friendsList = res.data,
      len = friendsList.length;
    console.log("setFriendsInfo:", friendsList)
    for (var i = 0; i < len; i++) {
      friendsList[i].index = i;
      friendsList[i].role_type_name = this.convertRole(friendsList[i].role_type);
      if (!friendsList[i].image_address || friendsList[i].image_address == 0)
        friendsList[i].image_address = "/imgs/image.png"; //无头像时顶替用
    }
    this.setData({
      friendsInfo: friendsList
    })
  },

  // 转换role_type的格式---------------------
  convertRole: function(obj) {
    if (obj === "100")
      return "客户"
    else if (obj === "300")
      return "伙伴"
    else if (obj == "000")
      return "朋友";
    if (obj === "客户")
      return "100"
    else if (obj === "伙伴")
      return "300"
    else if (obj === "朋友")
      return "000";
    var name_list = this.data.worker,
      code_list = this.data.worker_code,
      len = name_list.length;
    for (var i = 0; i < len; i++) {
      if (obj === name_list[i])
        return code_list[i];
      if (obj == code_list[i])
        return name_list[i];
    }
    return obj;
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

  //* 点击MultiPicker的确定按钮****************************************
  bindMultiPickerChange: function(e) {
    var id = e.currentTarget.dataset.id,
      role_type_name = null,
      role_type = null,
      user_type_name = this.data.multiArray[0][this.data.multiIndex[0]],
      str1 = 'friendsInfo[' + id + '].role_type_name',
      str2 = 'friendsInfo[' + id + '].user_type',
      str3 = 'friendsInfo[' + id + '].role_type',
      user_type = this.convertType(user_type_name),
      friend = this.data.friendsInfo[id];
    if (user_type != '2') {
      role_type_name = user_type_name;
      role_type = this.convertRole(role_type_name);
    } else { //是员工
      role_type_name = this.data.multiArray[1][this.data.multiIndex[1]];
      role_type = this.data.worker_code[this.data.multiIndex[1]];
    }
    data.changeFriendInfo(friend.user_id, user_type, role_type, friend.user_type, friend.role_type, this.finishChange);
    wx.showLoading({
      title: "请稍候..."
    });
    this.setData({
      infoReady: {
        str: [str1, str2, str3],
        data: [role_type_name, user_type, role_type]
      }
    });
    if (user_type != this.convertTitType(this.data.index))
      this.setData({
        removeId: id,
      });
    else
      this.setData({
        removeId: -1,
      });
  },

  // 修改朋友信息的回调函数------------------------------------------
  finishChange: function(res) {
    wx.hideLoading();
    if (res.data.code == 1) { //成功
      if (this.data.removeId == -1) {
        var info_str = this.data.infoReady.str,
          info_data = this.data.infoReady.data;
        this.setData({
          [info_str[0]]: info_data[0],
          [info_str[1]]: info_data[1],
          [info_str[2]]: info_data[2],
          infoReady: null
        })
      } else
        this.removeFriend(this.data.removeId);
    } else { //失败
      wx.showToast({
        title: res.data.error,
        icon: 'none',
        duration: 1700
      });
    }
  },

  // 从friend数组中移除一条数据---------------------------------
  removeFriend: function(id) {
    var friends = this.data.friendsInfo,
      newLen = friends.length - 1;
    for (var i = id; i < newLen; i++) {
      friends[i] = friends[i + 1];
    }
    friends.pop();
    this.setData({
      friendsInfo: friends,
    });
  },

  //* 滚动MultiPicker********************************************
  bindMultiPickerColumnChange: function(e) {
    // console.log('修改的列为', e.detail.column, '，值为', e.detail.value);
    var data_ = {
        multiArray: this.data.multiArray,
        multiIndex: this.data.multiIndex
      },
      id = e.currentTarget.dataset.id;
    data_.multiIndex[e.detail.column] = e.detail.value;
    if (e.detail.column == 0) {
      switch (data_.multiArray[0][data_.multiIndex[0]]) {
        case '客户':
          data_.multiArray[1] = [''];
          break;
        case '员工':
          data_.multiArray[1] = this.data.worker;
          break;
        case '伙伴':
          data_.multiArray[1] = [''];
          break;
        case '朋友':
          data_.multiArray[1] = [''];
          break;
      }
      data_.multiIndex[1] = 0;
    }
    this.setData(data_); //设置mutiArray和multiIndex
  },

  // 根据服务器拉取的数据，设置员工的角色类型表-------------------------
  setSelector: function(res) {
    console.log("setSelector(初始化员工的类型表)...res =", res)
    var len = res.data.length,
      worker_code = new Array(len),
      worker = new Array(len);
    for (var i = 0; i < len; i++) {
      worker[i] = res.data[i].type_name;
      worker_code[i] = res.data[i].entity_type;
    }
    this.setData({
      worker: worker,
      worker_code: worker_code,
    })
  },

  //* 生命周期函数--监听页面加载*************************************
  onLoad: function(options) {
    this.changeTitWXSS(3)
    data.getFriendsList("1", this.setFriendsInfo)
    data.getParam("01", this.setSelector)
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
      isAdmin: true
    })
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
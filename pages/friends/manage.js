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
      ['客户', '员工', '伙伴'],
      ['']
    ],
    worker: [],
    multiIndex: [0, 0],
  },

  // 中文转化为数字---------------------------------------------------
  // 将Tit的index转换为user_type
  // “1”：客户 “2”：员工 “3”：伙伴 “0”：其他
  convertType: function(id) {
    switch (this.data.titles[id].name) {
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
      user_type = this.convertType(id);
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
      if (!friendsList[i].image_address)
        friendsList[i].image_address = "/imgs/image.png"; //无头像时顶替用
    }
    this.setData({
      friendsInfo: friendsList
    })
  },

  // 根据worker和worker_code两张表，转换角色类型的格式---------------------
  convertRole: function(obj) {
    if (obj == "1")
      return "客户"
    else if (obj == "3")
      return "伙伴"
    else if (obj == "0")
      return "朋友"
    //
    var name_list = this.data.worker,
      code_list = this.data.worker_code,
      len = name_list.length;
    for (var i = 0; i < len; i++) {
      if (obj == name_list[i])
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
      str1 = 'friendsInfo[' + id + '].role_type_name',
      str2 = 'friendsInfo[' + id + '].user_type',
      str3 = 'friendsInfo[' + id + '].role_type',
      user_type = (this.data.multiIndex[0] + 1).toString(),
      role_type_name = this.data.multiArray[1][this.data.multiIndex[1]],
      role_type = user_type, //角色代码，默认和user_type一致（因为还没有数据）
      friend = this.data.friendsInfo[id];
    console.log("bindMultiPickerChange...friend =", friend);
    if (user_type == "2") //如果是员工，角色代码变更
      role_type = this.data.worker_code[this.data.multiIndex[1]];
    data.changeFriendInfo(friend.user_id, user_type, role_type, friend.user_type, friend.role_type);
    this.setData({
      [str1]: role_type_name,
      [str2]: user_type,
      [str3]: role_type,
    });
    if (user_type != this.convertType(this.data.index))
      this.removeFriend(id);
  },

  // 从friend数组中移除一条数据
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
      }
      data_.multiIndex[1] = 0;
    }
    this.setData(data_);
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
    var myTabBar = getApp().globalData.tabBar
    myTabBar.list[0].active = true
    myTabBar.list[1].active = false
    myTabBar.list[2].active = false
    myTabBar.list[3].active = false
    this.setData({
      tabBar: myTabBar,
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
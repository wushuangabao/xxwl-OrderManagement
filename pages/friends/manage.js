// pages/friends/manage.js

const data = require('../../utils/data.js')

Page({
  /**
   * 页面的初始数据
   */
  data: {
    avatarUrl: "/imgs/image.png", //无头像时顶替用
    titles: [{
        index: 0,
        name: '其他',
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
      ['200', '201', '202']
    ],
    multiIndex: [0, 0],
  },

  //将Tit的index转换为user_type（“1”：客户 “2”：员工 “3”：伙伴 “0”：其他）
  convertType: function(id) {
    switch (this.data.titles[id].name) {
      case '客户':
        return "1";
      case '员工':
        return "2";
      case '伙伴':
        return "3";
      case '其他':
        return "0";
    }
  },

  //* 点击Tit事件
  changeTit: function(event) {
    var id = event.currentTarget.dataset.id,
      user_type = this.convertType(id);
    this.changeTitWXSS(id)
    data.getFriendsList(user_type, this.setFriendsInfo)
  },

  //设置FriendsInfo数组数据
  setFriendsInfo: function(res) {
    var friendsList = res.data,
      len = friendsList.length;
    console.log("setFriendsInfo:", friendsList)
    for (var i = 0; i < len; i++) {
      friendsList[i].index = i;
    }
    this.setData({
      friendsInfo: friendsList
    })
  },

  //改变titles数据的WXML标签样式
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

  //* 点击MultiPicker的确定按钮：
  bindMultiPickerChange: function(e) {
    var id = e.currentTarget.dataset.id,
      str1 = 'friendsInfo[' + id + '].role_type',
      str2 = 'friendsInfo[' + id + '].user_type',
      user_type = (this.data.multiIndex[0]+1).toString(),
      role_type = this.data.multiArray[1][this.data.multiIndex[1]],
      friend = this.data.friendsInfo[id];
    console.log("user_type = ", user_type);
    this.setData({
      [str1]: role_type,
      [str2]: user_type,
    });
    data.changeFriendInfo(friend.user_id, user_type, role_type);
  },

  //* 滚动MultiPicker：
  bindMultiPickerColumnChange: function(e) {
    console.log('修改的列为', e.detail.column, '，值为', e.detail.value);
    var data_ = {
        multiArray: this.data.multiArray,
        multiIndex: this.data.multiIndex
      },
      id = e.currentTarget.dataset.id;
    data_.multiIndex[e.detail.column] = e.detail.value;
    if (e.detail.column == 0) {
      switch (data_.multiArray[0][data_.multiIndex[0]]) {
        case '客户':
          data_.multiArray[1] = ['100', '101', '102', '103'];
          break;
        case '员工':
          data_.multiArray[1] = ['02', '03', '04', '05', '06'];
          break;
        case '伙伴':
          data_.multiArray[1] = ['200', '201', '202'];
          break;
      }
      data_.multiIndex[1] = 0;
    }
    this.setData(data_);
  },

  //* 生命周期函数--监听页面加载
  onLoad: function(options) {
    this.changeTitWXSS(3)
    data.getFriendsList("1", this.setFriendsInfo)
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

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

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})
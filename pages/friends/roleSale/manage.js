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
    index: 3,
    friendsInfo: [],
    multiArray: [
      [''],
      ['']
    ],
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
    var param = {};
    data.getParamsByEntity(param, this.setParamsByEntity);
  },

  // 设置selector-------------
  setParamsByEntity: function(res) {
    var data = res.data,
      len = data.length;
    console.log("setParamsByEntity...res.data = ", data);
    for(var i=0;i<len;i++){
      var str = "multiArray[0][" + i.toString() + "]";
      this.setData({
        [str]: data[i].other_associate_name,
      });
    }
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
      friend = this.data.friendsInfo[id]; //获取所选friend的信息
    var value = this.data.multiArray[0][this.data.multiIndex[0]],
      url="";
    console.log("选择的value = ",value);
    switch(value){
      case "内容":
      url="/pages/market/content/list";
    }
    wx.redirectTo({
      url: url,
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
    this.setData(data_); //修改this.data.multiIndex
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
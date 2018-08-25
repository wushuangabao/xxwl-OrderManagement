// pages/inquiry/inquiry.js

const data = require('../../utils/data.js');

Page({
  data: {
    titles: [{
        name: '已完成',
        color_b: '#F8F8F8',
        color_f: '#9E9E9E'
      },
      {
        name: '未完成',
        color_b: '#F8F8F8',
        color_f: '#9E9E9E'
      }
    ],
    index: 0,
    receipt: [],
    isAdmin: false,
    status: "0", //0表示未完成，1表示已完成
  },

  //* 点击“已完成”或“未完成”**********************************
  changeTit: function(event) {
    var name = event.currentTarget.dataset.name;
    if (this.data.titles[this.data.index].name == name)
      return;
    wx.showLoading({ //让用户进入等待状态，不要操作
      title: '加载中',
    });
    this.setData({
      receipt: [],
    })
    if (name == "未完成") {
      this.changeTitWXSS(1)
      data.getRecptData("0", "00000", this.setRecptData)
    } else if (name == "已完成") {
      this.changeTitWXSS(0)
      data.getRecptData("2", "00000", this.setRecptData)
    }
  },

  //* 点击某条订单-->查询订单详情*************************************
  inquiryRecpt: function(event) {
    var r_number = event.currentTarget.dataset.num,
      index = event.currentTarget.dataset.id,
      path1 = this.data.receipt[index].r_img;
    wx.setStorageSync('imgUrl_1', path1);
    wx.setStorageSync('imgUrl_2', this.data.receipt[index].image_2);
    wx.setStorageSync('imgUrl_3', this.data.receipt[index].image_3);
    wx.setStorageSync('imgUrl_4', this.data.receipt[index].image_4);
    wx.setStorageSync('r_number', r_number);
    if (this.data.index == 1) {
      wx.navigateTo({
        url: '/pages/recpt/info?done=' + '0'
      })
    } else {
      wx.navigateTo({
        url: '/pages/recpt/info?done=' + '2'
      })
    }
  },

  // 改变titles数据的WXML标签样式，以及页面数据status------------
  changeTitWXSS: function(i) {
    var str1 = 'titles[' + i + '].color_b',
      str2 = 'titles[' + i + '].color_f',
      that = this;
    that.setData({
      [str1]: '#FFF',
      [str2]: '#000',
    })
    var old_i = that.data.index;
    if (i != old_i) {
      wx.setStorageSync('gmt_modify', '');
      str1 = 'titles[' + old_i + '].color_b';
      str2 = 'titles[' + old_i + '].color_f';
      var s;
      if (i == 0)
        s = "1";
      else
        s = "0";
      that.setData({
        [str1]: '#F8F8F8',
        [str2]: '#9E9E9E',
        index: i,
        status: s,
        receipt: [],
      })
    }
  },

  // 设置this.data中的receipt数组-----------------------------------
  setRecptData: function(res) {
    var _data_ = res.data,
      len = _data_.length,
      old_data = this.data.receipt,
      real_i = old_data.length,
      state, //=this.data.status
      old_len = real_i;
    if (len > 0 && _data_[0].work_status == "0")
      state = "未完成";
    else
      state = "已完成";
    console.log("setRecptData...res.data =", _data_);
    for (var i = 0; i < len; i++) {
      old_data[real_i] = _data_[i];
      old_data[real_i].r_number = data.convertRecptNum(_data_[i].receipt_number);
      var note = data.simplfStr(_data_[i].remark, 28), // remark长度控制
        r_type = data.convertType(_data_[i].receipt_type);
      old_data[real_i].note = note;
      old_data[real_i].state = state;
      old_data[real_i].type = r_type;
      old_data[real_i].index = real_i;
      old_data[real_i].r_img = data.Img_Url + _data_[i].receipt_number + '_0' + _data_[i].image_1;
      real_i++;
    }
    this.setData({
      receipt: old_data
    })
    if (real_i > old_len) {
      wx.setStorageSync('gmt_modify', old_data[real_i - 1].gmt_modify);
    } else {
      wx.showToast({
        title: '没有更多的了',
        icon: 'none',
        duration: 900
      })
    }
    wx.hideLoading();
  },

  //* 点击“查看进度”************************************************
  inquiry: function(event) {
    var r_number = event.currentTarget.dataset.num,
      r_type = event.currentTarget.dataset.type;
    wx.setStorageSync('r_number', r_number);
    wx.setStorageSync('r_type', r_type);
    //根据r_number检索数据在receipt数组中的位置，播放动画
    // var recpts = this.data.receipt,len = recpts.length
    // for (var i = 0; i < len; i++) {
    //   var recpt = recpts[i]
    //   if (recpt.receipt_number == r_number) {
    //     this.playAnima(i)
    //   }
    // }
    //延迟300ms后跳页面
    //setTimeout(function() {
    wx.navigateTo({
      url: '../progress/progress'
    })
    //}.bind(this), 300)
  },

  // （废弃）播放动画
  playAnima: function(i) {
    var str = 'receipt[' + i + '].animaData'
    var animation = wx.createAnimation({
      duration: 200,
    })
    this.animation = animation
    //缩小
    animation.scale(0.7, 0.7).step()
    this.setData({
      [str]: animation.export()
    })
    //放大
    setTimeout(function() {
      animation.scale(1, 1).step({
        duration: 100
      })
      this.setData({
        [str]: animation.export()
      })
    }.bind(this), 200)
  },

  //* 生命周期函数--监听页面显示***********************************
  onShow: function() {
    //判断用户身份是否为管理员
    var value = wx.getStorageSync('role_type')
    if (value == "01") { //是管理员
      //设置tabBar
      var myTabBar = getApp().globalData.tabBar
      myTabBar.list[0].active = false
      myTabBar.list[1].active = false
      myTabBar.list[2].active = true
      myTabBar.list[3].active = false
      this.setData({
        tabBar: myTabBar,
        isAdmin: true
      })
    }
  },

  //* 生命周期函数--监听页面加载************************************
  onLoad: function(options) {
    wx.showLoading({ //让用户进入等待状态，不要操作
      title: '加载中',
    });
    wx.setStorageSync('gmt_modify', '');
    data.getRecptData(this.data.status, "00000", this.setRecptData);
    this.changeTitWXSS(1) //切换到"未完成"页
  },

  //* 页面上拉触底事件的处理函数***************************************
  onReachBottom: function() {
    wx.showLoading({ //让用户进入等待状态，不要操作
      title: '加载中',
    });
    data.getRecptData(this.data.status, "00000", this.setRecptData)
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

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
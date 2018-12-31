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
    isLoading:false,
    status: "0", //0表示未完成，1表示已完成
  },

  //* 点击“已完成”或“未完成”**********************************
  changeTit: function(event) {
    if (this.data.isLoading)
      return;
    var name = event.currentTarget.dataset.name;
    if (this.data.titles[this.data.index].name == name)
      return;
    wx.showLoading({ //让用户进入等待状态，不要操作
      title: '加载中',
    });
    this.setData({
      receipt: [],
      isLoading:true
    });
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
      old_data[real_i].moreLayer = false;
      old_data[real_i].hasPraise = false;
      old_data[real_i].comment = null;
      real_i++;
    }
    this.setData({
      receipt: old_data,
      isLoading:false,
    });
    wx.hideLoading();
    if (real_i > old_len) {
      wx.setStorageSync('gmt_modify', old_data[real_i - 1].gmt_modify);
    } else {
      wx.showToast({
        title: '没有更多的了',
        icon: 'none',
        duration: 900
      })
    }
  },

  //* 点击“查看进度”************************************************
  inquiry: function(event) {
    var r_number = event.currentTarget.dataset.num,
      r_type = event.currentTarget.dataset.type;
    wx.setStorageSync('r_number', r_number);
    wx.setStorageSync('r_type', r_type);
    wx.navigateTo({
      url: '../progress/progress'
    })
  },

  //////////////////////////////////////////////////////////////
  // 点赞、评论
  //////////////////////////////////////////////////////////////

  //* 点击“More”按钮*****************************************
  catchTapMore: function (e) {
    if (this.data.isLoading)
      return;
    var index = e.currentTarget.dataset.id,
      r = this.data.receipt[index],
      str = "receipt[" + index + "].moreLayer";
    this.setData({
      [str]: !r.moreLayer
    });
  },

  //* 输入评论******************************
  bindCommentInput: function (e) {
    var str = "receipt[" + e.currentTarget.dataset.id + "].comment";
    this.setData({
      [str]: e.detail.value
    })
  },

  //* 确认评论******************************
  catchTapComment: function (e) {
    var index = e.currentTarget.dataset.id,
      receipt = this.data.receipt[index];
    if (receipt.comment) {
      var str1 = "receipt[" + index + "].comment",
        str2 = "receipt[" + index + "].moreLayer",
        str3 = "receipt[" + index + "].rating_102",
        param = {
          entity_code: '03', //02表示工单，03表示订单
          entity_type: receipt.receipt_type,
          entity_number: receipt.receipt_number,
          entity_name: receipt.receipt_name,
          rating_type: '102',
          rating_name: '评论',
          remark: receipt.comment,
        };
      console.log("catchTapComment...my param = ", param);
      data.ratingCreate(param, this.successComment);
      this.setData({
        [str1]: null,
        [str2]: false,
        [str3]: (parseInt(receipt.rating_102) + 1).toString()
      })
    }
  },

  //* 点赞**********************************
  catchTapPraise: function (e) {
    var index = e.currentTarget.dataset.id,
      receipt = this.data.receipt[index],
      str1 = "receipt[" + index + "].hasPraise",
      str2 = "receipt[" + index + "].rating_101";
    if (!receipt.hasPraise) {
      this.setData({
        [str1]: true,
        [str2]: (parseInt(receipt.rating_101) + 1).toString()
      });
      var param = {
        entity_code: '03', //02表示工单，03表示订单
        entity_type: receipt.receipt_type,
        entity_number: receipt.receipt_number,
        entity_name: receipt.receipt_name,
        rating_type: '101', //101表示点赞，102表示评论
        rating_name: '点赞',
        remark: '1',
      };
      console.log("catchTapPraise...my param = ", param);
      data.ratingCreate(param, this.successPraise);
    }
  },

  // 成功点赞--------------------
  successPraise: function (res) {
    console.log('successPraise...res.data = ', res.data);
  },

  // 成功评论--------------------
  successComment: function (res) {
    console.log('successComment...res.data = ', res.data);
  },

  ////////////////////////////////////////////////////////////////
  // 生命周期函数
  ////////////////////////////////////////////////////////////////

  //* 监听页面显示***********************************
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
    this.setData({
      isLoading:true
    });
    wx.setStorageSync('gmt_modify', '');
    data.getRecptData(this.data.status, "00000", this.setRecptData);
    this.changeTitWXSS(1) //切换到"未完成"页
  },

  //* 页面上拉触底事件的处理函数***************************************
  onReachBottom: function() {
    if (this.data.isLoading)
      return;
    wx.showLoading({ //让用户进入等待状态，不要操作
      title: '加载中',
    });
    this.setData({
      isLoading: true
    });
    data.getRecptData(this.data.status, "00000", this.setRecptData)
  },

  //* 转发********************************************
  onShareAppMessage: function(res) {
    if (res.from === 'button') { //如果来自页面内转发按钮
      console.log(res.target)
    }
    var path = '/pages/index/index?company_id=' + wx.getStorageSync('company_id') + '&user_id=' + wx.getStorageSync('user_id') + '&company_type=' + wx.getStorageSync('company_type');
    console.log("onShareAppMessage, path =", path)
    return {
      title: '生产管理小程序',
      path: path,
    }
  }
})
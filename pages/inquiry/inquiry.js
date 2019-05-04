// pages/inquiry/inquiry.js

const data = require('../../utils/data.js'),
  app = getApp();

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
    isLoading: false,
    status: "0", //0表示未完成，2表示已完成
    hasTabBar: true,
  },

  //* 跳转到录单页面*********************************
  addReceipt() {
    wx.navigateTo({
      url: "../recpt/input"
    });
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
      isLoading: true
    });
    if (name == "未完成") {
      this.changeTitWXSS(1);
      this.getRecptData("0");
    } else if (name == "已完成") {
      this.changeTitWXSS(0);
      this.getRecptData("2");
    }
  },

  //* 点击某条订单-->查询订单详情*************************************
  inquiryRecpt: function(event) {
    var index = event.currentTarget.dataset.id;
    this.inquiryRecptById(index);
  },
  inquiryRecptById: function(index) {
    var receipt = this.data.receipt[index],
      r_number = receipt.receipt_number,
      path1 = receipt.r_img;
    wx.setStorageSync('imgUrl_1', path1);
    wx.setStorageSync('imgUrl_2', receipt.image_2);
    wx.setStorageSync('imgUrl_3', receipt.image_3);
    wx.setStorageSync('imgUrl_4', receipt.image_4);
    wx.setStorageSync('r_number', r_number);
    if (receipt.state === "未完成") {
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
        s = "2";
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
    var _data_ = res.data;
    if (!_data_) {
      console.log("没有接收到数据");
      return;
    }
    let len = _data_.length,
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
      // console.log(_data_[i].image_1[0])
      if (_data_[i].image_1 && _data_[i].image_1[0] != '.') // <---貌似没有必要？
        _data_[i].image_1 = '.' + _data_[i].image_1;
      old_data[real_i].r_img = data.Img_Url + _data_[i].receipt_number + '_0' + _data_[i].image_1;
      old_data[real_i].moreLayer = false;
      old_data[real_i].hasPraise = false;
      old_data[real_i].comment = null;
      real_i++;
    }
    this.setData({
      receipt: old_data,
      isLoading: false,
    });
    this.setMenu(); //设置路由菜单
    wx.hideLoading();
    if (real_i > old_len) {
      wx.setStorageSync('gmt_modify', old_data[real_i - 1].gmt_modify);
    } else {
      wx.showToast({
        title: '没有更多的了',
        icon: 'none',
        duration: 900
      });
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

  getRecptData: function(status) {
    var param;
    if (this.data.hasTabBar)
      param = {
        their_associate_code: "01", //主体。用户为“01”
        their_associate_type: '000', //wx.getStorageSync('role_type'),
        their_associate_number: '00000', //wx.getStorageSync('user_id'),
        their_associate_name: app.globalData.userInfo.nickName,
        other_associate_code: "03", //所选的主体。订单为"03"
        other_associate_type: "000",
        other_associate_number: "00000",
        other_associate_name: "",
        work_status: status,
      };
    else {
      param = app.globalData.param;
      param.work_status = status;
    }
    if (wx.getStorageSync('role_type') == "100")
      data.getRecptData2(param, this.setRecptData, true);
    else
      data.getRecptData2(param, this.setRecptData);
  },

  //////////////////////////////////////////////////////////////
  // 点赞、评论
  //////////////////////////////////////////////////////////////

  //* 点击“More”按钮*****************************************
  catchTapMore: function(e) {
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
  bindCommentInput: function(e) {
    var str = "receipt[" + e.currentTarget.dataset.id + "].comment";
    this.setData({
      [str]: e.detail.value
    })
  },

  //* 确认评论******************************
  catchTapComment: function(e) {
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
  catchTapPraise: function(e) {
    var index = e.currentTarget.dataset.id,
      receipt = this.data.receipt[index],
      str1 = "receipt[" + index + "].hasPraise",
      str2 = "receipt[" + index + "].rating_101";
    if (!receipt.hasPraise) {
      var str_rating_101;
      if (receipt.rating_101)
        str_rating_101 = (parseInt(receipt.rating_101) + 1).toString();
      else
        str_rating_101 = "1";
      this.setData({
        [str1]: true,
        [str2]: str_rating_101
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
  successPraise: function(res) {
    console.log('successPraise...res.data = ', res.data);
  },

  // 成功评论--------------------
  successComment: function(res) {
    console.log('successComment...res.data = ', res.data);
  },

  ////////////////////////////////////////////////////////////////
  // moreInfo menu 路由菜单
  ////////////////////////////////////////////////////////////////
  setMenu: function() {
    app.globalData.setMenu(this, this.data.receipt, "receipt_type", "03");
  },

  showMoreInfo: function(e) {
    var index = e.currentTarget.dataset.id,
      type = this.data.receipt[index].receipt_type,
      number = this.data.receipt[index].receipt_number;
    app.globalData.setTheirInfo("03", type, number);
    app.globalData.showMoreInfo(this, index, type, this.inquiryRecptById);
  },

  ////////////////////////////////////////////////////////////////
  // 生命周期函数
  ////////////////////////////////////////////////////////////////

  //* 监听页面显示***********************************
  onShow: function() {
    //设置tabBar
    var myTabBar = getApp().globalData.tabBar,
      len = myTabBar.list.length;
    for (var i = 0; i < len; i++) {
      if (myTabBar.list[i].text == "订单")
        myTabBar.list[i].active = true;
      else
        myTabBar.list[i].active = false;
    }
    this.setData({
      tabBar: myTabBar,
    })
  },

  //* 生命周期函数--监听页面加载************************************
  onLoad: function(options) {
    wx.showLoading({ //让用户进入等待状态，不要操作
      title: '加载中',
    });
    this.setData({
      isLoading: true
    });
    if (options.hasTabBar == "false")
      this.setData({
        hasTabBar: false
      });
    wx.setStorageSync('gmt_modify', '');
    this.getRecptData(this.data.status);
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
    this.getRecptData(this.data.status);
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
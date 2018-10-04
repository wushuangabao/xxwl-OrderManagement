// pages/operate/operate.js

const util = require('../../utils/util.js'),
  data = require('../../utils/data.js'),
  app = getApp(),
  MAX_NUM_NOTE = 24; //note最大长度（按照窄字符计算）

Page({

  /**
   * 页面的初始数据
   */
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
      },
      {
        name: '待领取',
        color_b: '#F8F8F8',
        color_f: '#9E9E9E'
      }
    ],
    index: 0,
    operation: [],
    isAdmin: false,
    note: '',
    //isMoving: false,
  },

  //* 点击“领取”或“完工”按钮***********************************
  onTapButton: function(event) {
    var id = event.currentTarget.dataset.id,
      operation = this.data.operation[id],
      job_number = operation.job_number;
    if (operation.button == '领取') {
      data.upLoadOpertGet(job_number);
    } else if (operation.button == '完工') {
      //跳转到more/input页面----------
      wx.navigateTo({
        url: "/pages/operate/more/input?job_number=" + job_number + "&receipt_number=" + operation.receipt_number + "&job_name=" + operation.job_name
      })
    }
    //从operation和imgs数组中移除数据-------
    operation = this.data.operation;
    var imgs = this.data.imgs,
      len = operation.length - 1;
    for (var i = id; i < len; i++) {
      operation[i] = operation[i + 1];
      imgs[i] = imgs[i + 1];
    }
    operation.pop();
    imgs.pop();
    this.setData({
      operation: operation,
      imgs: imgs
    })
  },

  //* 点击“已完成”、“待领取”或“未完成”**************************
  changeTit: function(event) {
    var name = event.currentTarget.dataset.name;
    if (name == this.data.titles[this.data.index].name)
      return;
    wx.showLoading({ //让用户进入等待状态，不要操作
      title: '加载中',
    });
    if (name == "待领取") {
      this.changeTitWXSS(2)
      data.getOpertData("0", this.setJobTable)
    } else if (name == "未完成") {
      this.changeTitWXSS(1)
      data.getOpertData("1", this.setJobTable)
    } else if (name == "已完成") {
      this.changeTitWXSS(0)
      data.getOpertData("2", this.setJobTable)
    }
  },

  //改变titles数据的WXML标签样式，重新设置index等数据----------------------
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
      wx.setStorageSync('apply_receive_time', '');
      str1 = 'titles[' + old_i + '].color_b';
      str2 = 'titles[' + old_i + '].color_f';
      that.setData({
        [str1]: '#F8F8F8',
        [str2]: '#9E9E9E',
        index: i,
        operation: [],
        imgs: [],
      })
    }
  },

  // 设置operation数据------------------------------------------------------------
  setJobTable: function(res) {
    if (res.data == null) {
      wx.hideLoading();
      return;
    }
    var operation = res.data,
      len = operation.length,
      my_operation = this.data.operation,
      real_i = my_operation.length,
      old_len = real_i;
    console.log("setJobTable...res.data =", operation);
    //遍历res.data数组--------------------------------
    for (var i = 0; i < len; i++) {
      my_operation[real_i] = operation[i]; //复制operation[i]给my_operation[real_i]
      my_operation[real_i].j_number = data.convertRecptNum(operation[i].job_number);
      //备注处理----------------------------
      if (operation[i].remark == 'null') {
        my_operation[real_i].note = '';
        my_operation[real_i].remark = '';
      } else {
        my_operation[real_i].note = data.simplfStr(operation[i].remark, MAX_NUM_NOTE);
      }
      //设置index---------------------
      my_operation[real_i].index = real_i;
      //判断title---------------------
      if (this.data.index == 0) //已完成
        my_operation[real_i].img_path_1 = data.Img_Url + operation[i].job_number + '_0' + operation[i].image_1;
      else {
        my_operation[real_i].img_path_1 = data.Img_Url + operation[i].receipt_number + '_0' + operation[i].image_1;
        if (this.data.index == 1) //未完成
          my_operation[real_i].button = "完工";
        else //待领取
          my_operation[real_i].button = "领取";
      }
      real_i++;
    }
    //如果有新的数据加载进来-------------
    if (real_i > old_len) {
      wx.setStorageSync('apply_receive_time', my_operation[real_i - 1].apply_receive_time);
      this.setData({
        operation: my_operation
      });
    }
    //如果没有新的数据加载进来----------- 
    else {
      wx.showToast({
        title: '没有更多的了',
        icon: 'none',
        duration: 1000
      });
    }
    //隐藏loading
    wx.hideLoading();
  },

  //* 点击某条工单-->查询订单/工单详情********************************************
  inquiryRecpt: function(event) {
    var index = event.currentTarget.dataset.id,
      operation = this.data.operation[index];
    wx.setStorageSync('imgUrl_1', operation.img_path_1);
    wx.setStorageSync('imgUrl_2', operation.image_2);
    wx.setStorageSync('imgUrl_3', operation.image_3);
    wx.setStorageSync('imgUrl_4', operation.image_4);
    //判断title的index
    if (this.data.index == 0) //title为“已完成”
    {
      wx.setStorageSync('info', operation);
      wx.navigateTo({
        url: '/pages/progress/info'
      })
    } else //title为“未完成”或“待领取”
    {
      wx.setStorageSync('r_number', operation.receipt_number);
      wx.navigateTo({
        url: '/pages/recpt/info'
      })
    }
  },

  //* 生命周期函数--监听页面加载***********************************************
  onLoad: function(options) {
    wx.setStorageSync('apply_receive_time', '');
    wx.showLoading({ //让用户进入等待状态，不要操作
      title: '加载中',
    });
    data.getOpertData("0", this.setJobTable); //"0"待领取 "1"未完成 "2"已完成
    this.changeTitWXSS(2); //切换到"待领取"页
  },

  //* 生命周期函数--监听页面显示******************************************
  onShow: function() {
    //判断用户身份是否为管理员
    var value = wx.getStorageSync('role_type')
    if (value == "01") { //是管理员
      //设置tabBar
      var myTabBar = app.globalData.tabBar
      myTabBar.list[0].active = false
      myTabBar.list[1].active = false
      myTabBar.list[2].active = false
      myTabBar.list[3].active = true
      this.setData({
        tabBar: myTabBar,
        isAdmin: true
      })
    }
  },

  //* 页面上拉触底事件的处理函数
  onReachBottom: function() {
    wx.showLoading({ //让用户进入等待状态，不要操作
      title: '加载中',
    });
    data.getOpertData(this.getStatus(this.data.index), this.setJobTable)
  },

  // 根据Tit的index获取status------------------------
  // "0"待领取 "1"未完成 "2"已完成
  getStatus: function(i) {
    switch (i) {
      case 0:
        return "2";
      case 1:
        return "1";
      case 2:
        return "0";
    }
  },

  //* 转发***********************************************
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
  },
})
// pages/operate/operate.js

const util = require('../../utils/util.js'),
  data = require('../../utils/data.js'),
  app = getApp(),
  MAX_NUM_NOTE = 24; //note最大长度（按照窄字符计算）
var isLoading = false,
  numOfJobs = 0,
  numOfImgs = 0;

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
    imgs: [],
    isAdmin: false,
    note: '',
    isMoving: false,
  },

  //* 点击“领取”或“完工”按钮***********************************
  onTapButton: function(event) {
    if (isLoading)
      return;
    var id = event.currentTarget.dataset.id,
      operation = this.data.operation[id],
      job_number = operation.job_number;
    numOfImgs--;
    numOfJobs--;
    if (operation.button == '领取') {
      data.upLoadOpertGet(job_number);
    } else if (operation.button == '完工') {
      data.upLoadOpertDone(job_number, operation.remark);
    }
    //从operation和imgs数组中移除数据
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

  //（弃用）播放动画
  playAnima: function(i) {
    var str = 'operation[' + i + '].animaData'
    var animation = wx.createAnimation({
      duration: 200, //缩小动画的持续时间
    })
    this.animation = animation
    setTimeout(function() {
      animation.scale(0.25, 0.25).rotate(30).step()
      this.setData({
        [str]: animation.export()
      })
    }.bind(this), 100) //缩小动画播放的延迟时间
    setTimeout(function() {
      animation.scale(1, 1).rotate(0).step({
        duration: 200
      })
      this.setData({
        [str]: animation.export()
      })
    }.bind(this), 500) //恢复原来大小的动画
  },

  //* 点击“已完成”、“待领取”或“未完成”**************************
  changeTit: function(event) {
    if (isLoading)
      return;
    var name = event.currentTarget.dataset.name;
    if (name == this.data.titles[this.data.index].name)
      return;
    wx.showLoading({ //让用户进入等待状态，不要操作
      title: '加载中',
    });
    isLoading = true;
    numOfImgs = 0;
    numOfJobs = 0;
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

  //* 点击备注输入框*****************
  catchNoteTap: function(e) {},

  //* 输入备注****************************************
  bindNoteInput: function(e) {
    var i = e.currentTarget.dataset.id,
      note = e.detail.value;
    if (note != '') {
      var str1 = 'operation[' + i + '].remark', //完整的备注
        str2 = 'operation[' + i + '].note'; //缩略的备注
      this.setData({
        [str1]: note,
        [str2]: data.simplfStr(note, MAX_NUM_NOTE)
      })
    }
  },

  //（废弃）点击图片，放大预览
  catchTapImg: function(e) {
    var id = e.currentTarget.dataset.id,
      that = this;
    wx.getImageInfo({
      src: that.data.imgs[id],
      success: function(res) {
        var width = res.width,
          height = res.height;
        console.log("catchTapImg...", width, "X", height);
        wx.navigateTo({
          url: "/pages/others/image?width=" + width + "&height=" + height + "&path=" + that.data.imgs[id]
        })
      }
    });
  },

  // 下载图片-----------------------------------------------------------
  setImgPath: function(i) {
    var that = this;
    wx.downloadFile({
      url: data.API_IMGDOWN,
      header: {
        "receipt_number": that.data.operation[i].receipt_number
      },
      success: function(res) {
        if (res.statusCode === 200) {
          that.setData({
            ['imgs[' + i + ']']: res.tempFilePath
          });
          numOfImgs++;
          if (numOfImgs == numOfJobs) {
            wx.hideLoading(); //结束等待状态
            isLoading = false;
          }
        }
      }
    })
  },

  // 设置operation数据------------------------------------------------------------
  setJobTable: function(res) {
    var operation = res.data,
      len = operation.length,
      my_operation = this.data.operation,
      real_i = my_operation.length,
      old_len = real_i,
      button = '领取';
    console.log("setJobTable...res.data =", operation);
    if (this.data.index == 1)
      button = '完工';
    for (var i = 0; i < len; i++) {
      my_operation[real_i] = operation[i];
      my_operation[real_i].j_number = data.convertRecptNum(operation[i].job_number);
      my_operation[real_i].note = data.simplfStr(operation[i].remark, MAX_NUM_NOTE);
      my_operation[real_i].index = real_i;
      my_operation[real_i].button = button;
      this.setImgPath(real_i);
      real_i++;
    }
    if (real_i > old_len) {
      wx.setStorageSync('apply_receive_time', my_operation[real_i - 1].apply_receive_time);
      console.log('numOfRecpts =', real_i);
      numOfJobs = real_i;
    } else {
      wx.hideLoading(); //结束等待状态
      isLoading = false;
      wx.showToast({
        title: '没有更多的了',
        icon: 'none',
        duration: 900
      });
    }
    this.setData({
      operation: my_operation
    });
  },

  //* 点击某条工单-->查询订单详情********************************************
  inquiryRecpt: function(event) {
    var r_number = event.currentTarget.dataset.num,
      id = event.currentTarget.dataset.id,
      path1 = this.data.imgs[id];
    wx.setStorageSync('imgUrl_1', path1);
    wx.setStorageSync('r_number', r_number);
    wx.navigateTo({
      url: '/pages/recpt/info'
    })
  },

  //* 生命周期函数--监听页面加载***********************************************
  onLoad: function(options) {
    wx.setStorageSync('apply_receive_time', '');
    wx.showLoading({ //让用户进入等待状态，不要操作
      title: '加载中',
    });
    isLoading = true;
    data.getOpertData("0", this.setJobTable); //"0"待领取 "1"未完成 "2"已完成
    this.changeTitWXSS(2); //切换到"待领取"页
  },

  //* 生命周期函数--监听页面初次渲染完成
  onReady: function() {},

  //* 生命周期函数--监听页面显示******************************************
  onShow: function() {
    numOfJobs = this.data.operation.length;
    numOfImgs = this.data.imgs.length;
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

  //* 页面上拉触底事件的处理函数
  onReachBottom: function() {
    if (isLoading)
      return;
    wx.showLoading({ //让用户进入等待状态，不要操作
      title: '加载中',
    });
    isLoading = true;
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

  // //手指刚放到屏幕触发
  // touchS: function(e) {
  //   //判断是否只有一个触摸点
  //   if (e.touches.length == 1) {
  //     this.setData({
  //       //记录触摸起始位置的X坐标
  //       startX: e.touches[0].clientX
  //     })
  //   }
  // },

  // //触摸时触发，手指在屏幕上每移动一次，触发一次
  // touchM: function(e) {
  //   console.log("touchM")
  //   if (this.data.isMoving) { //如果已经触发滑动事件，就不要重复触发了
  //     return
  //   }
  //   var Width = 80 //如果滑动距离小于这个值，滑动视作无效
  //   if (e.touches.length == 1) {
  //     //记录触摸点位置的X坐标
  //     var moveX = e.touches[0].clientX;
  //     //计算手指起始点的X坐标与当前触摸点的X坐标的差值（向左划为正，向右滑为负）
  //     var disX = this.data.startX - moveX;
  //     console.log("disX==" + disX)
  //     //→
  //     if (disX < -Width) {
  //       var old_index = this.data.index
  //       if (old_index > 0) {
  //         this.changeTitWXSS(old_index - 1)
  //         this.setOperations()
  //       }
  //       this.setData({
  //         isMoving: true
  //       })
  //     }
  //     //←
  //     else if (disX >= Width) {
  //       var old_index = this.data.index
  //       if (old_index < 2) {
  //         this.changeTitWXSS(old_index + 1)
  //         this.setOperations()
  //       }
  //       this.setData({
  //         isMoving: true
  //       })
  //     }
  //   }
  // },

  // //触摸结束
  // touchE: function(e) {
  //   this.setData({
  //     isMoving: false
  //   })
  // }
})
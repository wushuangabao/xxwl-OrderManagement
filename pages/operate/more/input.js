const data = require('../../../utils/data.js');

Page({
  data: {
    info: null,
    textAreaValue1: '', //备注
    img_path: ["/imgs/add.png", "/imgs/add.png", "/imgs/add.png", "/imgs/add.png"],
  },

  //* 点击图片*********************************************
  onImage: function(event) {
    var that = this,
      index = event.currentTarget.dataset.index,
      str = "img_path[" + index + "]";
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      success: function(res) {
        that.setData({
          [str]: res.tempFilePaths[0]
        })
      }
    })
  },

  //* 长按图片*********************************************
  deleteImage: function(event) {
    var index = event.currentTarget.dataset.index,
      str = "img_path[" + index + "]";
    this.setData({
      [str]: "/imgs/add.png",
    })
  },

  //* 点击“提交”按钮****************************************
  onConfirm: function() {
    var that = this;
    if (this.checkValue()) {
      wx.showModal({
        title: '提示',
        content: '确认完工并提交？',
        success: function(res) {
          if (res.confirm) { //用户点击确定
            var img_format = that.getImgFormat(),
              param = {
                job_number: that.data.info.job_number,
                remark: that.data.textAreaValue1,
                image_1: img_format[0],
                image_2: img_format[1],
                image_3: img_format[2],
                image_4: img_format[3],
              };
            console.log("完工提交...my param = ", param)
            wx.showLoading({
              title: '提交中',
            });
            data.upLoadOpertDone(param, that.finishInput);
          }
        }
      })
    }
  },

  // 获取图片的格式----------------------------------------
  getImgFormat() {
    var img_path = this.data.img_path,
      format = [],
      id;
    for (var i = 0; i < 4; i++)
      if (img_path[i] != "/imgs/add.png") {
        id = img_path[i].lastIndexOf('.');
        format.push(img_path[i].slice(id));
      }
    var len = format.length;
    if (len < 4)
      for (var i = len; i < 4; i++) {
        format[i] = '';
      }
    this.setData({
      image_format: format
    });
    return format;
  },

  // 工单数据上传完毕--------------------------------------------
  finishInput: function(res) {
    var job_number = this.data.info.job_number,
      img_path = this.hasImg(),
      len = img_path.length,
      that = this;
    console.log()
    wx.hideLoading();
    // 如果成功
    if (res.data.code == 1) {
      if (len > 0)
        for (var i = 0; i < len; i++) //上传图片
          wx.uploadFile({
            url: data.Img_Upload,
            filePath: img_path[i],
            name: 'file',
            formData: {
              'image_id': job_number + '_' + i + that.data.image_format[i]
            },
            success: function(res) {
              console.log('工单图片上传成功，res = ', res);
            }
          });
      wx.setStorageSync('info', 'success');
      wx.navigateBack({ //回到原来的页面
        delta: 1
      });
    }
    // 如果失败
    else {
      wx.showToast({
        title: res.data.error,
        icon: 'none',
        duration: 1000
      });
    }
  },

  // 检查提交的数据是否符合格式------------------------------------
  checkValue: function() {
    return true
  },

  // 返回存在图片的路径所组成的的数组----------------------
  hasImg: function() {
    var img_path = this.data.img_path,
      imgArray = [];
    for (var i = 0; i < 4; i++)
      if (img_path[i] != "/imgs/add.png")
        imgArray.push(img_path[i]);
    return imgArray;
  },

  //* TextArea失去焦点***********************
  bindTextAreaBlur1: function(e) {
    this.setData({
      textAreaValue1: e.detail.value
    })
  },

  //* 监听页面加载**************************************
  onLoad: function(options) {
    var info = wx.getStorageSync('info');
    info.r_number = data.convertRecptNum(info.receipt_number);
    this.setData({
      info: info
    });
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
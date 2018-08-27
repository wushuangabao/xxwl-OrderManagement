const data = require('../../utils/data.js')

Page({

  data: {
    r_type_list: [],
    r_name_list: [],
    index: 0,
    cif_id: [''],
    cif_name: ['请选择客户名称'],
    index_cif: 0,
    textAreaValue1: '', //备注
    img_path: ["/imgs/add.png", "/imgs/add.png", "/imgs/add.png", "/imgs/add.png"],
    isAdmin: false,
  },

  //* 查看历史订单*****************************************
  inquiry: function() {
    wx.navigateTo({
      url: '/pages/inquiry/inquiry'
    })
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
        content: '是否确认您的填写无误并立刻提交？',
        success: function(res) {
          if (res.confirm) { //用户点击确定
            var index = that.data.index,
              index_cif = that.data.index_cif,
              img_format = that.getImgFormat(),
              param = {
                receipt_type: that.data.r_type_list[index - 1],
                receipt_name: that.data.r_name_list[index],
                remark: that.data.textAreaValue1,
                cif_user_id: that.data.cif_id[index_cif],
                cif_user_name: that.data.cif_name[index_cif],
                image_1: img_format[0],
                image_2: img_format[1],
                image_3: img_format[2],
                image_4: img_format[3],
              };
            wx.showLoading({
              title: '提交中',
            });
            data.upLoadRecpt(param, that.uploadImg);
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
    console.log('getImgFormat...format =', format);
    return format;
  },

  // 获取订单号之后，上传订单图片，清空表单----------------------------------
  uploadImg: function(res) {
    console.log('upLoadRecpt,res =', res);
    var receipt_number = null,
      img_path = this.hasImg(),
      len = img_path.length,
      that = this;
    try {
      receipt_number = res.data.receipt_number;
    } catch (e) {
      wx.showToast({
        title: '提交失败!',
        icon: 'none',
        duration: 1800
      });
      return;
    }
    console.log("uploadImg...receipt_number = ", receipt_number);
    console.log('img_path =', img_path);
    if (len > 0)
      for (var i = 0; i < len; i++)
        wx.uploadFile({
          url: 'http://121.42.193.223:8088/home/upload/upload',
          filePath: img_path[i],
          name: 'file',
          formData: {
            'image_id': receipt_number + '_' + i
          },
          success: function(res) {
            console.log("res.data =", res.data);
          }
        });
    this.finishInput();
  },

  // 订单数据上传完毕--------------------------------------------
  finishInput: function() {
    this.setData({
      index: 0,
      index_cif: 0,
      textAreaValue1: '',
      img_path: ["/imgs/add.png", "/imgs/add.png", "/imgs/add.png", "/imgs/add.png"],
    })
    wx.hideLoading();
    wx.showToast({ //bug:并没有把握一定提交成功了
      title: '提交成功',
      icon: 'success',
      duration: 1000
    })
  },

  // 检查提交的数据是否符合格式------------------------------------
  checkValue: function() {
    if (this.data.index != 0) //&& this.data.index_cif != 0)
      return true
    else {
      wx.showModal({
        title: '提示',
        content: '请先选择订单类型和客户名称！',
        showCancel: false
      })
      return false
    }
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
  //废弃：
  bindTextAreaBlur2: function(e) {
    this.setData({
      textAreaValue2: e.detail.value
    })
  },

  //* 订单类型Picker************************
  bindPickerChange: function(e) {
    this.setData({
      index: e.detail.value
    })
  },

  //* 客户名称Picker************************
  bindPickerChange2: function(e) {
    this.setData({
      index_cif: e.detail.value
    })
  },

  // 客户地址Picker（废弃）
  bindRegionChange: function(e) {
    this.setData({
      region: e.detail.value
    })
  },

  // 初始化订单类型数组r_type_list和r_name_list-------------------
  setRecptParam: function() {
    var recptType = getApp().globalData.receiptType,
      len = recptType.length,
      r_type_list = new Array(len),
      r_name_list = new Array(len + 1);
    r_name_list[0] = "请选择订单类型";
    for (var i = 0; i < len; i++) {
      r_name_list[i + 1] = recptType[i].type_name;
      r_type_list[i] = recptType[i].entity_type;
    }
    this.setData({
      r_type_list: r_type_list,
      r_name_list: r_name_list,
    })
  },

  // 初始化客户信息-----------------------------------
  setCif: function(res) {
    console.log("setCif, res = ", res)
    var len = res.data.length + 1,
      id_list = new Array(len),
      name_list = new Array(len);
    id_list[0] = '';
    name_list[0] = '请选择客户名称';
    for (var i = 1; i < len; i++) {
      id_list[i] = res.data[i - 1].user_id;
      name_list[i] = res.data[i - 1].nickname;
    }
    this.setData({
      cif_id: id_list,
      cif_name: name_list,
    })
  },

  //* 监听页面加载**************************************
  onLoad: function(options) {
    this.setRecptParam() // 设置订单类型
    data.getFriendsList("1", this.setCif) // 获取客户信息
  },

  //* 监听页面显示**************************************
  onShow: function() {
    //判断用户身份是否为管理员
    try {
      var value = wx.getStorageSync('role_type')
      if (value == "01") { //是管理员
        //设置tabBar
        var myTabBar = getApp().globalData.tabBar
        myTabBar.list[0].active = false
        myTabBar.list[1].active = true
        myTabBar.list[2].active = false
        myTabBar.list[3].active = false
        this.setData({
          tabBar: myTabBar,
          isAdmin: true
        })
      }
    } catch (e) {
      // Do something when catch error
    }
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
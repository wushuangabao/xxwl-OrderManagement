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
    var that = this
    if (this.checkValue()) {
      wx.showModal({
        title: '提示',
        content: '是否确认您的填写无误并立刻提交？',
        success: function(res) {
          //用户点击确定
          if (res.confirm) {
            var index = that.data.index,
              index_cif = that.data.index_cif;
            wx.showLoading({ //让用户进入等待状态，不要操作
              title: '提交中',
            });
            //提交订单(参数：订单类型编号，订单类型名称，备注，客户id，客户昵称)
            data.upLoadRecpt(that.data.r_type_list[index - 1], that.data.r_name_list[index], that.data.textAreaValue1, that.data.cif_id[index_cif], that.data.cif_name[index_cif], that.uploadImg);
          }
        }
      })
    }
  },

  // 获取订单号之后，上传订单图片，清空表单----------------------------------
  uploadImg: function(res) {
    var receipt_number = res.data.receipt_number,
      img_path = this.hasImg(),
      that = this;
    console.log("receipt_number = ", receipt_number);
    console.log("img_path = ", img_path);
    if (img_path) //这里只上传第一张图片
      wx.uploadFile({
        url: data.API_IMGUP,
        filePath: img_path,
        name: 'image',
        formData: {
          'receipt_number': receipt_number //HTTP 请求中其他额外的 form data
        },
        success: function(res) {
          console.log("uploadImg...res =", res)
          that.finishInput()
        }
      })
    else {
      this.finishInput()
    }
  },

  // 订单数据上传完毕--------------------------------------------
  finishInput:function(){
    this.setData({
      index: 0,
      index_cif: 0,
      textAreaValue1: '',
      img_path: ["/imgs/add.png", "/imgs/add.png", "/imgs/add.png", "/imgs/add.png"],
    })
    wx.hideLoading(); //结束等待状态
    wx.showToast({
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

  // 判断是否有上传图片----------------------------------------
  // 有则返回首张图的地址，否则返回空字符串
  hasImg: function() {
    var img_path = this.data.img_path;
    for (var i = 0; i < 4; i++)
      if (img_path[i] != "/imgs/add.png")
        return img_path[i];
    return "";
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
  setRecptParam: function(res) {
    console.log("set recpt_list, res = ", res);
    var len = res.data.length,
      r_type_list = new Array(len),
      r_name_list = new Array(len + 1);
    r_name_list[0] = "请选择订单类型";
    for (var i = 0; i < len; i++) {
      r_name_list[i + 1] = res.data[i].type_name;
      r_type_list[i] = res.data[i].entity_type;
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
    data.getParam("03", this.setRecptParam) // 设置订单类型
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
  onShareAppMessage: function (res) {
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
// pages/recpt/info.js
const data = require('../../utils/data.js')

Page({

  data: {
    recpt_info: {},
    imgUrls: [],
    indicatorDots: true,
    autoplay: true,
    interval: 5000,
    duration: 1000,
    praiseArray: [],
    commentArray: [],
  },

  //* （弃用，因为手机上有bug）点击图片
  bindTapImg: function(e) {
    var urls = this.data.imgUrls,
      len = urls.length,
      i = 0,
      url = e.currentTarget.dataset.url;
    for (i = 0; i < len; i++) {
      if (url == urls[i])
        break;
    };
    wx.previewImage({
      current: this.data.imgUrls[i], // 当前显示图片的http链接
      urls: this.data.imgUrls // 需要预览的图片http链接列表
    })
  },

  // 设置this.data中的receipt数组-----------------------------------
  setRecptInfo: function(res) {
    console.log("setRecptInfo...res.data =", res.data);
    var info = res.data,
      r_number = data.convertRecptNum(res.data[0].receipt_number),
      str = 'recpt_info.r_number';
    if (info[0].remark == '')
      info[0].remark = '无备注';
    this.setData({
      recpt_info: info[0],
      [str]: r_number
    });
    data.ratingQuery({
      entity_type: info[0].receipt_type,
      entity_number: info[0].receipt_number,
      entity_code: '03'
    }, this.finishRatQry);
  },

  // 设置图片数组-------------------------------------
  setImgPath: function(r_number) {
    var path1 = wx.getStorageSync('imgUrl_1'),
      format = [wx.getStorageSync('imgUrl_2'),wx.getStorageSync('imgUrl_3'), wx.getStorageSync('imgUrl_4')],
      path = [path1];
    for (var i = 1; i < 4; i++) {
     if(format[i-1])
       path.push(data.Img_Url + r_number + '_' + i + format[i-1]);
    }
    this.setData({
      imgUrls: path
    });
  },

  // 完成点赞、评论查询-----------------------------
  finishRatQry: function (res) {
    var praiseArray = [],
      commentArray = [],
      p_i = 0,
      c_i = 0,
      len = res.data.length;
    for (var i = 0; i < len; i++)
      if (res.data[i].rating_type == '101') { //点赞
        //判断是否点赞用户是否重复
        var p_l = praiseArray.length,
          p_b = false;
        for (var j = 0; j < p_l; j++)
          if (praiseArray[j].user_id == res.data[i].user_id) {
            p_b = true;
            break;
          }
        if (!p_b) { //如果没有重复
          praiseArray[p_i] = {
            user_id: res.data[i].user_id,
            image_address: res.data[i].image_address
          };
          p_i++;
        }
      } else if (res.data[i].rating_type == '102') { //评论
        commentArray[c_i] = {
          user_name: res.data[i].user_name,
          comment: res.data[i].remark,
          image_address: res.data[i].image_address,
          time: this.simpTime(res.data[i].finish_time)
        };
        c_i++;
      }
    var n_pA = parseInt(p_i / 8), //满8个的数组的数目
      praiseArray1 = [],
      praiseArray2 = [];
    for (var i = 0; i < n_pA; i++) { //将满8个的数组填满
      var preN = 8 * i;
      for (var j = 0; j < 8; j++)
        praiseArray1[j] = praiseArray[preN + j];
      praiseArray2[i] = praiseArray1;
      praiseArray1 = [];
    }
    var preN = n_pA * 8,
      n_lastArray = p_i - preN; //最后一个数组的数目
    if (n_lastArray > 0) {
      for (var i = 0; i < n_lastArray; i++) //填最后一个数组
        praiseArray1[i] = praiseArray[preN + i];
      praiseArray2[n_pA] = praiseArray1;
    }
    this.setData({
      praiseArray: praiseArray2,
      commentArray: commentArray
    })
  },

  //* 生命周期函数--监听页面加载********************
  onLoad: function(options) {
    var r_number = wx.getStorageSync('r_number');
    this.setImgPath(r_number);
    data.getRecptData(options.done, r_number, this.setRecptInfo)
  },

  // time字符串处理--------------------------
  simpTime: function (time) {
    return time.slice(5, 16)
  },
  getDate: function (time) {
    return time.slice(5, 10)
  },
  getHour: function (time) {
    return time.slice(11, 16)
  },

  //* 转发********************************************
  onShareAppMessage: function(res) {
    if (res.from === 'button') { //如果来自页面内转发按钮
      console.log(res.target)
    }
    var info = this.data.recpt_info,
      path = '/pages/index/index?company_id=' + wx.getStorageSync('company_id') + '&user_id=' + wx.getStorageSync('user_id') + '&et=03&at=' + info.receipt_type + '&anum=' + info.receipt_number + '&anam=' + info.receipt_name;
    console.log("onShareAppMessage, path =", path);
    return {
      title: '生产管理小程序',
      path: path,
    }
  }
})
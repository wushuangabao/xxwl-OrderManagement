// pages/progress/progress.js

const data = require('../../utils/data.js')
const Dark_Font_Color = "#2c2c2c"
const Light_Font_Color = "#bfbfbf"
const Dark_Line_Color = "#bfbfbf"
const Light_Line_Color = "#e6e6e6"

Page({

  /**
   * 页面的初始数据
   */
  data: {
    receipt_number: '',
    receipt_type: '',
    processData: [],
  },
  
  ////////////////////////////////////////////////////////////////////////
  // 根据拉取的job_table，设置进度条数据
  ////////////////////////////////////////////////////////////////////////
  setProcessData: function(res) {
    var job_table = res.data,
      len = job_table.length,
      processData = [],
      real_i = 0;
    console.log("setProcessData...job_table =", job_table);
    if (len <= 1)
      return;
    for (var i = 0; i < len; i++) {
      var job = job_table[i];
      if (job.remark == "null") {
        job.remark = "";
      }
      //如果已处理
      if (job.work_status == "2") {
        processData[real_i] = {
          job_name: job.job_name,
          job_type: job.job_type,
          user_name: job.user_name,
          job_number: job.job_number,
          time_date: this.getDate(job.finish_time),
          time_hour: this.getHour(job.finish_time),
          line_color: Dark_Line_Color,
          font_color: Dark_Font_Color,
          icon: '/imgs/check-circle.png',
          state: '已完成',
          note: job.remark,
          index: real_i,
          imgs: [job.image_1, job.image_2, job.image_3, job.image_4],
          hasPraise:false,
          moreLayer:false,
          comment:null,
          rating_101:job.rating_101,
          rating_102: job.rating_102,
        }
        real_i++;
      }
      //如果正在处理
      else if (job.work_status == "1") {
        processData[real_i] = {
          job_name: job.job_name,
          user_name: job.user_name,
          job_number: job.job_number,
          time_date: this.getDate(job.finish_time), //名为finish_time，其实是领取时间
          time_hour: this.getHour(job.finish_time), //名为finish_time，其实是领取时间
          line_color: Light_Line_Color,
          font_color: Dark_Font_Color,
          icon: '/imgs/time-circle.png',
          state: '处理中',
          note: job.remark,
          index: real_i,
          hasPraise: false,
          moreLayer: false,
          comment: null,
          rating_101: job.rating_101,
          rating_102: job.rating_102,
        }
        real_i++;
      }
      //如果是无效的数据
      else if (job.job_type == "000") {}
      //如果还没处理
      else {
        processData[real_i] = {
          job_name: job.job_name,
          job_number: job.job_number,
          line_color: Light_Line_Color,
          font_color: Light_Font_Color,
          icon: '/imgs/undo-circle.png',
          note: job.remark,
          index: real_i,
          hasPraise: false,
          moreLayer: false,
          comment: null,
          rating_101: job.rating_101,
          rating_102: job.rating_102,
        }
        real_i++;
      }
    }
    processData[real_i - 1].line_color = "#ffffff";
    this.setData({
      processData: processData,
    })
  },

  //////////////////////////////////////////////////////////////
  //  点赞、评论
  //////////////////////////////////////////////////////////////

  //* 点击“More”按钮*****************************************
  catchTapMore: function (e) {
    if (this.data.isLoading)
      return;
    var index = e.currentTarget.dataset.id,
      operation = this.data.processData[index],
      str = "processData[" + index + "].moreLayer";
    this.setData({
      [str]: !operation.moreLayer
    });
  },

  //* 输入评论******************************
  bindCommentInput: function (e) {
    var str = "processData[" + e.currentTarget.dataset.id + "].comment";
    this.setData({
      [str]: e.detail.value
    })
  },

  //* 确认评论******************************
  catchTapComment: function (e) {
    var index = e.currentTarget.dataset.id,
      operation = this.data.processData[index];
    if (operation.comment) {
      var str1 = "processData[" + index + "].comment",
        str2 = "processData[" + index + "].moreLayer",
        str3 = "processData[" + index + "].rating_102",
        param = {
          entity_code: '02', //02表示工单，03表示订单
          entity_type: operation.job_type,
          entity_number: operation.job_number,
          entity_name: operation.job_name,
          rating_type: '102',
          rating_name: '评论',
          remark: operation.comment,
        };
      console.log("catchTapComment...my param = ", param);
      data.ratingCreate(param, this.successComment);
      this.setData({
        [str1]: null,
        [str2]: false,
        [str3]: (parseInt(operation.rating_102) + 1).toString()
      })
    }
  },

  //* 点赞**********************************
  catchTapPraise: function (e) {
    var index = e.currentTarget.dataset.id,
      operation = this.data.processData[index],
      str1 = "processData[" + index + "].hasPraise",
      str2 = "processData[" + index + "].rating_101";
    if (!operation.hasPraise) {
      this.setData({
        [str1]: true,
        [str2]: (parseInt(operation.rating_101) + 1).toString()
      });
      var param = {
        entity_code: '02', //02表示工单，03表示订单
        entity_type: operation.job_type,
        entity_number: operation.job_number,
        entity_name: operation.job_name,
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

  //* 查看工单详情************************************************
  bindTapToInfo: function(res) {
    var id = res.currentTarget.dataset.id,
      progressData = this.data.processData[id];
    console.log("bindTapToInfo...progressData=", progressData);
    //设置图片格式的缓存
    wx.setStorageSync('imgUrl_1', data.Img_Url + progressData.job_number + '_0' + progressData.imgs[0]);
    for (var i = 2; i < 5; i++) {
      var str = 'imgUrl_' + i;
      wx.setStorageSync(str, progressData.imgs[i - 1]);
    }
    wx.setStorageSync('info', {
      job_name: progressData.job_name,
      job_type: progressData.job_type,
      job_number: progressData.job_number,
      remark: progressData.note,
    })
    wx.navigateTo({
      url: "/pages/progress/info"
    })
  },

  //* 生命周期函数--监听页面显示***********************************************
  onShow: function() {
    var receipt_number = wx.getStorageSync('r_number'),
      r_number = data.convertRecptNum(receipt_number),
      receipt_type = wx.getStorageSync('r_type'),
      r_type = data.convertType(receipt_type)
    this.setData({
      receipt_number: r_number,
      receipt_type: r_type,
    })
    //获取r_number订单的工单表数据
    data.getProgrData(receipt_number, receipt_type, this.setProcessData)
  },

  // time字符串处理--------------------------
  simpTime: function(time) {
    return time.slice(5, 16)
  },
  getDate: function(time) {
    return time.slice(5, 10)
  },
  getHour: function(time) {
    return time.slice(11, 16)
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
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

  //根据job_table，设置进度条数据
  setProcessData: function(res) {
    var job_table = res.data,
      len = job_table.length,
      processData = []
    console.log("job_table:")
    console.log(job_table)
    //this.setData
    for (var i = 0; i < len; i++) {
      var job = job_table[i]
      //如果已处理
      if (job.work_status == "2") {
        processData[i] = {
          name: job.job_name,
          user_name: job.user_name,
          time_date: this.getDate(job.finish_time),
          time_hour: this.getHour(job.finish_time),
          line_color: Dark_Line_Color,
          font_color: Dark_Font_Color,
          icon: '/imgs/check-circle.png',
          state: '已完成',
          note: job.remark,
        }
      }
      //如果正在处理
      else if (job.work_status == "1") {
        processData[i] = {
          name: job.job_name,
          user_name: job.user_name,
          time_date: this.getDate(job.finish_time), //名为finish_time，其实是领取时间
          time_hour: this.getHour(job.finish_time), //名为finish_time，其实是领取时间
          line_color: Light_Line_Color,
          font_color: Dark_Font_Color,
          icon: '/imgs/time-circle.png',
          state: '处理中',
          note: job.remark
        }
      }
      //如果还没处理
      else {
        processData[i] = {
          name: job.job_name,
          line_color: Light_Line_Color,
          font_color: Light_Font_Color,
          icon: '/imgs/undo-circle.png',
          note: job.remark,
        }
      }
    }
    processData[len - 1].line_color = "#ffffff"
    this.setData({
      processData: processData,
    })
  },

  //* 生命周期函数--监听页面显示
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

  //time字符串处理
  simpTime: function(time) {
    return time.slice(5, 16)
  },
  getDate: function(time) {
    return time.slice(5, 10)
  },
  getHour: function(time) {
    return time.slice(11, 16)
  },

  //生命周期函数--监听页面加载
  onLoad: function(options) {},

  //转发
  onShareAppMessage: function(res) {

  }

})
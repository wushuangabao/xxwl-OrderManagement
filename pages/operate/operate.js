// pages/operate/operate.js

const util = require('../../utils/util.js')
const data = require('../../utils/data.js')
const app = getApp()
const MAX_NUM_NOTE = 24

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
    isMoving: false,
  },

  //* 点击“领取”或“完工”按钮
  onTapButton: function(event) {
    var job_number = event.currentTarget.dataset.number,
      operations = this.data.operation,
      len = operations.length
    //根据job_number检索数据在operation数组中的位置
    for (var i = 0; i < len; i++) {
      var operation = operations[i]
      if (operation.job_number == job_number) {
        if (operation.button == '领取') {
          //this.setButton(i, false)
          //this.playAnima(i)
          this.setData({
            operation: [],
          })
          setTimeout(function() {
            this.changeTitWXSS(1)
            data.getOpertData("1", this.setJobTable)
          }.bind(this), 300)
          data.upLoadOpertGet(job_number)
        } else if (operation.button == '完工') {
          //this.setButton(i, true)
          //this.playAnima(i)
          this.setData({
            operation: [],
          })
          setTimeout(function() {
            this.changeTitWXSS(0)
            data.getOpertData("2", this.setJobTable)
          }.bind(this), 300)
          data.upLoadOpertDone(job_number, operation.remark)
        }
        break
      }
    }
  },

  //设置第i条工序的备注
  setNote: function(i, note) {
    if (note != '') {
      var str1 = 'operation[' + i + '].remark' //完整的备注
      var str2 = 'operation[' + i + '].note' //缩略的备注
      this.setData({
        [str1]: note,
        [str2]: data.simplfStr(note, MAX_NUM_NOTE)
      })
    }
  },

  //播放动画
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

  //* 点击“已完成”、“待领取”或“未完成”
  changeTit: function(event) {
    var name = event.currentTarget.dataset.name
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

  //改变titles数据的WXML标签样式，重新设置index
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
      str1 = 'titles[' + old_i + '].color_b'
      str2 = 'titles[' + old_i + '].color_f'
      that.setData({
        [str1]: '#F8F8F8',
        [str2]: '#9E9E9E',
        index: i,
      })
    }
  },

  //给operation数组数据赋新的属性hid_button和button
  setNewButton: function() {
    var operations = this.data.operation,
      len = operations.length,
      str1;
    for (var i = 0; i < len; i++) {
      str1 = 'operation[' + i + '].hid_button'
      this.setData({
        [str1]: false,
      })
      var the_operation = operations[i]
      if (the_operation.work_status == '0') {
        str1 = 'operation[' + i + '].button'
        this.setData({
          [str1]: '领取'
        })
      } else if (the_operation.work_status == '1') {
        str1 = 'operation[' + i + '].button'
        this.setData({
          [str1]: '完工'
        })
      }
    }
  },

  //* 输入备注
  bindNoteInput: function(e) {
    var index = e.currentTarget.dataset.number
    //根据number检索数据在operation数组中的位置
    var operations = this.data.operation
    var len = operations.length
    for (var i = 0; i < len; i++) {
      var operation = operations[i]
      if (operation.job_number == index) {
        index = i
        break
      }
    }
    //设置备注
    this.setNote(i, e.detail.value)
  },

  // 设置operation数据
  setJobTable: function(res) {
    var operation = res.data
    console.log("setJobTable")
    console.log(operation)
    this.setData({
      operation: operation
    })
    var len = operation.length,
      str1 = '',
      str2 = '';
    for (var i = 0; i < len; i++) {
      str1 = 'operation[' + i + '].j_number'
      str2 = 'operation[' + i + '].note'
      this.setData({
        [str1]: data.convertRecptNum(operation[i].job_number),
        [str2]: data.simplfStr(operation[i].remark, MAX_NUM_NOTE)
      })
    }
    //设置按钮的属性
    this.setNewButton()
  },

  //* 生命周期函数--监听页面加载
  onLoad: function(options) {
    data.getOpertData("0", this.setJobTable) //"0"待领取 "1"未完成 "2"已完成
    //切换到"待领取"页
    this.changeTitWXSS(2)
  },

  //* 生命周期函数--监听页面初次渲染完成
  onReady: function() {},

  //* 生命周期函数--监听页面显示
  onShow: function() {
    //判断用户身份是否为管理员
    try {
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
    } catch (e) {
      // Do something when catch error
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

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  //* 用户点击右上角分享
  onShareAppMessage: function() {

  },

  //根据按下的button，设置operation的状态数据，增加对应的user、time数据。
  // setButton: function(i, bool) {
  //   var that = this
  //   var time = util.formatTime(new Date())
  //   //bool为false表示该操作未领取。
  //   if (bool == false) {
  //     var str1 = 'operation[' + i + '].button',
  //       str2 = 'operation[' + i + '].hid_button', //隐藏button，防止误点第二下
  //       str3 = 'operation[' + i + '].user_name',
  //       str4 = 'operation[' + i + '].time',
  //       str5 = 'operation[' + i + '].status',
  //       str6 = 'operation[' + i + '].work_status',
  //       user_name = app.globalData.userInfo.nickName
  //     that.setData({
  //       [str1]: '完工',
  //       [str2]: true,
  //       [str3]: user_name,
  //       [str4]: util.formatTime(new Date()),
  //       [str5]: '未完成',
  //       [str6]: '1',
  //     })
  //     //等待600ms后动画播放完毕，再显示button
  //     setTimeout(function() {
  //       that.setData({
  //         [str2]: false,
  //       })
  //     }.bind(this), 600)
  //   }
  //   //bool为true表示该操作已领取。
  //   else {
  //     var str1 = 'operation[' + i + '].status',
  //       str2 = 'operation[' + i + '].time', //完工时，修改time，由领取时的时间，变为完工时的时间
  //       str3 = 'operation[' + i + '].work_status'
  //     that.setData({
  //       [str1]: '已完成',
  //       [str2]: time,
  //       [str3]: '2',
  //     })
  //   }
  // },

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
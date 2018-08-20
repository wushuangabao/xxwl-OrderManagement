// pages/operate/create.js

const data = require('../../utils/data.js')
const Color_Gray = "#e6e6e6"
const Color_Green = "#1aad19"

Page({

  /**
   * 页面的初始数据
   */
  data: {
    r_type_list: [],
    r_name_list: ["请选择订单类型"],
    r_index: 0,
    operation: [],
    new_operation: null,
    canAdd: true,
    index: 0,
  },

  //* 输入备注（废弃）
  bindNoteInput: function(e) {
    var id = e.currentTarget.dataset.id - 1,
      text = e.detail.value,
      str = 'operation[' + id + '].remark';
    this.setData({
      [str]: text,
    })
  },

  //* 选择订单类型********************************************
  bindRcepTypeChange: function(e) {
    this.setData({
      r_index: e.detail.value
    })
    if (this.data.operation.length == 0)
      data.getCorparam(this.data.r_type_list[this.data.r_index - 1], this.setOperation); //设置工序模板
  },

  // 判断工序的“+”按钮是否可用，设置按钮颜色----------------------
  setButtonColor: function() {
    var operation = this.data.operation,
      len = operation.length;
    for (var i = 0; i < len; i++) {
      if (operation[i].job_type == "000") {
        this.setData({
          canAdd: false,
        })
        for (var j = 0; j < len; j++) {
          this.setData({
            ["operation[" + j + "].buttonColor"]: Color_Gray,
          })
        }
        return;
      }
    }
    this.setData({
      canAdd: true,
    })
    for (var i = 0; i < len; i++) {
      this.setData({
        ["operation[" + i + "].buttonColor"]: Color_Green,
      })
    }
  },

  //* 选择工序类型***********************************************
  bindPickerSelect: function(e) {
    var id = e.currentTarget.dataset.id - 1,
      job_type = this.data.operation[id].job_type,
      select_id = e.detail.value;
    if (job_type == "000") { //如果此工序还没有选择过工序类型
      var job_name = this.data.job_name_list[select_id];
      job_type = this.data.job_type_list[select_id];
      this.setData({
        ['operation[' + id + '].job_name']: job_name,
        ['operation[' + id + '].job_type']: job_type,
      })
      this.changeCorparam("add", id)
      this.setButtonColor()
    }
  },

  //* 最后一个按钮“+”按下*************************************
  // 给operation最后面插入空数据
  onTapAddLast: function() {
    if (this.data.canAdd) {
      var operation = this.data.operation,
        len = operation.length;
      operation.push({
        index: len + 1,
        job_type: '000',
        job_name: '请选择类型',
        job_code: '00',
      });
      this.setData({
        operation: operation,
        canAdd: false,
      })
      this.setButtonColor()
    }
  },

  //* 按钮“+”***********************************************
  onTapAdd: function(e) {
    var old_id = e.currentTarget.dataset.id - 1,
      old_operation = this.data.operation;
    if (old_operation[old_id].buttonColor == Color_Gray)
      return;
    var new_operation = [],
      old_len = old_operation.length;
    for (var i = 0; i <= old_len; i++) {
      if (i < old_id) {
        new_operation[i] = old_operation[i]
      } else if (i > old_id) {
        new_operation[i] = old_operation[i - 1]
        new_operation[i].index = i + 1
      } else {
        new_operation[i] = { //新建一条operation记录
          index: i + 1,
          job_type: '000',
          job_name: '请选择类型',
          job_code: '00',
        }
      }
    }
    this.setData({
      operation: new_operation,
    })
    this.setButtonColor()
  },

  //* 按钮“-”***********************************************
  onTapMinus: function(e) {
    var old_id = e.currentTarget.dataset.id - 1,
      old_operation = this.data.operation,
      new_operation = [],
      old_len = old_operation.length,
      notSet = false;
    if (old_operation[old_id].job_type == "000")
      notSet = true;
    for (var i = 0; i < old_len - 1; i++) {
      if (i < old_id) {
        new_operation[i] = old_operation[i]
      } else {
        new_operation[i] = old_operation[i + 1]
        new_operation[i].index = i + 1
      }
    }
    //如果对应的工序还没有选择类型
    if (notSet) {
      if (old_id == (old_len - 1))
        this.setData({
          canAdd: true,
          operation: new_operation,
        });
      else
        this.setData({
          operation: new_operation,
        });
      this.setButtonColor();
    }
    //如果已经选过类型了（发起过add的网络请求了）
    else {
      this.setData({
        new_operation: new_operation,
      })
      wx.showLoading({ //让用户进入等待状态，不要操作
        title: '加载中',
      })
      this.changeCorparam("minus", old_id)
    }
  },

  // 在网络请求回调之后，-------------------------------------
  // 用new_operation替换operation
  setNewData: function(res) {
    console.log("setNewData, res=", res)
    if (this.data.new_operation != null) {
      if (res.data.code == "1") { //code为"1"表示成功
        this.setData({
          operation: this.data.new_operation,
        })
        this.setData({
          new_operation: null,
        })
        this.setButtonColor()
        wx.hideLoading() //让用户结束等待状态，可以接着操作
      } else { //没有成功
        //让用户结束等待状态，提示失败
        wx.hideLoading()
        wx.showToast({
          title: '操作失败',
          icon: 'none',
          duration: 1000
        })
      }
    }
  },

  // 增/减工序的网络请求----------------------------------------
  changeCorparam: function(event, id) {
    var p_id = id - 1,
      n_id = id + 1,
      pre_type, pre_name, pre_code,
      next_code, next_type, next_name;
    if (p_id < 0) {
      pre_type = "000";
      pre_name = "00000";
      pre_code = "00";
    } else {
      pre_type = this.data.operation[p_id].job_type;
      pre_name = this.data.operation[p_id].job_name;
      pre_code = this.data.operation[p_id].job_code;
    };
    if (n_id >= this.data.operation.length) {
      next_type = "000";
      next_name = "00000";
      next_code = "00";
    } else {
      next_type = this.data.operation[n_id].job_type;
      next_name = this.data.operation[n_id].job_name;
      next_code = this.data.operation[n_id].job_code;
    };
    data.changeCorparam(event, {
      recpt_type: this.data.receipt_type,
      recpt_name: this.data.receipt_name,
      pre_code: pre_code,
      pre_type: pre_type,
      pre_name: pre_name,
      my_code: this.data.operation[id].job_code,
      my_type: this.data.operation[id].job_type,
      my_name: this.data.operation[id].job_name,
      next_code: next_code,
      next_type: next_type,
      next_name: next_name,
    }, this.setNewData)
  },

  // 根据模板初始化operation数组--------------------------------------
  setOperation: function(res) {
    console.log("setOperation, res = ", res);
    var recvList = res.data,
      myLen = recvList.length - 1,
      firstData = recvList[0]; //数组的第一个元素
    if (myLen > 0) {
      //将数组从第2个元素开始的数据，全部前移1个位置，并增加index属性
      for (var i = 0; i < myLen; i++) {
        recvList[i] = {
          job_name: recvList[i + 1].their_associate_name,
          job_type: recvList[i + 1].their_associate_type,
          job_code: recvList[i + 1].their_associate_code,
          buttonColor: Color_Green,
          index: i + 1,
        }
      }
      recvList.splice(myLen, 1) //删除原数组的最后一个元素
      this.setData({
        operation: recvList,
        receipt_type: firstData.their_associate_type,
        receipt_name: firstData.their_associate_name,
        receipt_code: firstData.their_associate_code,
      })
    } else if (myLen == 0) {
      this.setData({
        receipt_type: firstData.their_associate_type,
        receipt_name: firstData.their_associate_name,
        receipt_code: firstData.their_associate_code,
      })
    }
  },

  // 初始化工序类型数组job_type_list和job_name_list-------------
  setJobParam: function(res) {
    console.log("set job_list, res = ", res);
    var len = res.data.length,
      job_type_list = new Array(len),
      job_name_list = new Array(len);
    for (var i = 0; i < len; i++) {
      job_name_list[i] = res.data[i].type_name;
      job_type_list[i] = res.data[i].entity_type;
    }
    this.setData({
      job_type_list: job_type_list,
      job_name_list: job_name_list,
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

  //* 监听页面加载*****************************************
  onLoad: function(options) {
    data.getParam("02", this.setJobParam); //设置工单类型
    data.getParam("03", this.setRecptParam) // 设置订单类型
  },

  //* 生命周期函数--监听页面显示
  onShow: function() {},

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

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})
// pages/operate/create.js

const data = require('../../utils/data.js')
const Color_Gray = "#e6e6e6"
const Color_Green = "#1aad19"

Page({

  /**
   * 页面的初始数据
   */
  data: {
    receipt_type: '',
    receipt_name: '',
    operation: [],
    new_operation: null,
    canAddLast: true,
    index: 0,
    job_type_list: ["领料", "裁料", "补烫", "做衣", "钉扣", "质检", "送货", "签收", "收款"],
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

  // 将工序名称转化为工序类型代码（暂时）
  convertType: function(job_name) {
    var job_list = this.data.job_type_list,
      len = job_list.length;
    for (var i = 0; i < len; i++) {
      if (job_list[i] == job_name) {
        return (201 + i).toString()
      }
    }
    return "000"
  },

  // 判断工序的“+”按钮是否可用，设置按钮颜色
  setButtonColor: function() {
    var operation = this.data.operation,
      len = operation.length,
      last_i = len - 1;
    for (var i = 0; i < len; i++) {
      if (operation[i].job_type == "000" || (i > 0 && operation[i - 1].job_type == "000")) {
        this.setData({
          ["operation[" + i + "].buttonColor"]: Color_Gray,
        })
      } else {
        this.setData({
          ["operation[" + i + "].buttonColor"]: Color_Green,
        })
        if (i == last_i)
          this.setData({
            canAddLast: true,
          })
      }
    }
  },

  //* 选择工序类型
  bindPickerSelect: function(e) {
    var id = e.currentTarget.dataset.id - 1,
      job_type = this.data.operation[id].job_type,
      select_id = e.detail.value;
    if (job_type == "000") {
      var job_name = this.data.job_type_list[select_id];
      job_type = this.convertType(job_name);
      this.setData({
        ['operation[' + id + '].job_name']: job_name,
        ['operation[' + id + '].job_type']: job_type,
      })
      this.changeCorparam("add", id)
      this.setButtonColor()
    }
  },

  //* 最后一个按钮“+”按下，给operation最后面插入新数据
  onTapAddLast: function() {
    if (this.data.canAddLast) {
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
        canAddLast: false,
      })
      this.setButtonColor()
    }
  },

  //* 按钮“+”
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

  //* 按钮“-”
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
          canAddLast: true,
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
      //todo:让用户进入等待状态，不要操作
      this.changeCorparam("minus", old_id)
    }
  },

  // 在网络请求回调之后，用new_operation替换operation
  setNewData: function(res) {
    console.log("setNewData, res=", res)
    if (this.data.new_operation != null) {
      if (rea.data.code == "1") { //code为"1"表示成功
        this.setData({
          operation: this.data.new_operation,
        })
        this.setData({
          new_operation: null,
        })
        this.setButtonColor()
        //todo:让用户结束等待状态，可以接着操作
      }
      else { //没有成功，让用户结束等待状态，提示失败

      }
    }
  },

  // 增/减工序的网络请求
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

  // 根据模板初始化operation数组
  setOperation: function(res) {
    console.log("setOperation, res = ", res);
    var recvList = res.data,
      myLen = recvList.length - 1,
      firstData = recvList[0]; //数组的第一个元素
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
  },

  //* 生命周期函数--监听页面加载
  onLoad: function(options) {
    data.getCorparam("301", this.setOperation)
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
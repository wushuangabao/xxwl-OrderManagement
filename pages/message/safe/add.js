// pages/message/safe/add.js
const data = require('../../../utils/data.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    name: "",
    idType: '居民身份证',
    idTypeNum: 6,
    idNum: "",
    pay: "",
  },

  ///////////////////////////////////////////
  // 表单
  ///////////////////////////////////////////
  selectIdType: function() {
    this.showActionSheet([
      "护照",
      "通行证",
      "回乡证",
      "台胞证",
      "旅行证",
      "居民身份证",
      "军官证",
      "学籍证",
      "其他",
    ], this.setIdType);
  },

  setIdType: function(res) {
    this.setData({
      idType: res.item.name,
      idTypeNum: res.index + 1
    });
  },


  ////////////////////////////////////////
  // 提交请求
  ////////////////////////////////////////
  submit: function() {
    let pageData = this.data,
      param = {
        /** 客户ID */
        traderId: wx.getStorageSync("user_id"),
        /** 机构ID */
        companyId: wx.getStorageSync("company_id"),

        /** 证件类型 */
        identityType: pageData.idTypeNum,
        /** 证件号码 */
        identityId: pageData.idNum,
        /** 姓名 */
        name: pageData.name,
        /** 性别 */
        sex: "",
        /** 国籍 */
        country: "",
        /** 工资薪金 */
        pay: pageData.pay,
        /** 出生日期 */
        birthday: "",
        /** 人员类别 */
        personType: "",
        /** 人员状态 */
        personStatus: "",
        /** 用工形式 */
        workForm: "",
        /** 户籍类型 */
        registerType: "",

        /** 申报日期 */
        reportDate: "201901",
        /** 个人社保号 */
        safeId: "000001",
        /** 参保开始日期 */
        beginDate: "201909",
        /** 手机号码 */
        telNo: "13333333333",
        /** 0101-基本养老保险 */
        agedSafe: "1", //1:真，2:假
        /** 0201-工伤保险 */
        jobSafe: "",
        /** 0301-农民工失业保险 */
        peasantSafe: "",
        /** 0302-城镇工失业保险 */
        workSafe: "",
        /** 0401-基本医疗保险 */
        medicalSafe: "",
        /** 0505-生育保险 */
        birthSafe: "",

      }
    data.addUserSafe(param, function(res) {
      console.log("submit...res = ", res);
    });
  },

  /////////////////////////////////////////
  // 通用方法
  /////////////////////////////////////////
  convertNameList: function(nameList) {
    let len = nameList.length,
      list = [];
    if (len < 1) return;
    for (var i = 0; i < len; i++) {
      list.push({
        name: nameList[i]
      });
    }
    return list;
  },

  showActionSheet: function(nameList, func) {
    if (!nameList) {
      console.log("showActionSheet ERROR: nameList不能为空！");
      return;
    }
    if (!func) {
      console.log("showActionSheet ERROR: 回调函数不能为空！");
      return;
    }
    this.setData({
      disabled: true
    });
    var that = this,
      itemList = this.convertNameList(nameList);
    wx.lin.showActionSheet({
      itemList: itemList,
      locked: false,
      success: function(res) {
        func(res);
        that.setData({
          disabled: false
        });
      },
      complete: function(res) {
        that.setData({
          disabled: false
        });
      },
    });
  },

  /////////////////////////////////////////
  // 生命周期函数--监听页面加载
  /////////////////////////////////////////
  onLoad: function(options) {

  },

  onReady: function() {

  },

  onShow: function() {

  },
})
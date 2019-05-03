// pages/message/safe/add.js
const data = require('../../../utils/data.js');

Page({
  data: {
    name: "",
    idType: '居民身份证',
    idTypeNum: 6,
    idNum: "",
    pay: "",
    registerType: "001",
    safeType: {},
    itemsId: [
      "护照",
      "通行证",
      "回乡证",
      "台胞证",
      "旅行证",
      "居民身份证",
      "军官证",
      "学籍证",
      "其他",
    ],
    itemsSafe: [
      '基本养老保险',
      '工伤保险',
      '农民工失业保险',
      '城镇工失业保险',
      '基本医疗保险',
      '生育保险'
    ]
  },

  ///////////////////////////////////////////
  // 表单处理
  ///////////////////////////////////////////

  // 设置姓名
  setName: function(e) {
    this.setData({
      name: e.detail.detail.value
    });
  },

  // 设置证件号码
  setIdNum: function(e) {
    this.setData({
      idNum: e.detail.detail.value
    });
  },

  // 设置户口类型
  setRegisterType: function(e) {
    this.setData({
      registerType: e.detail.detail.value
    });
  },

  // 设置工资
  setPay: function(e) {
    this.setData({
      pay: e.detail.detail.value
    });
  },

  // 选择证件类型
  selectIdType: function() {
    this.showActionSheet(this.data.itemsId, this.setIdType);
  },

  // 设置证件类型
  setIdType: function(res) {
    this.setData({
      idType: res.item.name,
      idTypeNum: res.index + 1
    });
  },

  // 多选框
  onCheckBoxTap: function(res) {
    var current = res.detail.current,
      value = res.detail.value;
    this.data.safeType[value] = current ? "1" : "2";
  },


  ////////////////////////////////////////
  // 提交请求
  ////////////////////////////////////////
  submit: function() {
    let pageData = this.data,
      safeType = pageData.safeType,
      param = {
        traderId: this.data.trader_id,
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
        registerType: pageData.registerType,

        /** 申报日期 */
        reportDate: "201901",
        /** 个人社保号 */
        safeId: "000001",
        /** 参保开始日期 */
        beginDate: "201909",
        /** 手机号码 */
        telNo: "13333333333",
        /** 0101-基本养老保险 */
        agedSafe: safeType['基本养老保险'], //1:真，2:假
        /** 0201-工伤保险 */
        jobSafe: safeType['工伤保险'],
        /** 0301-农民工失业保险 */
        peasantSafe: safeType['农民工失业保险'],
        /** 0302-城镇工失业保险 */
        workSafe: safeType['城镇工失业保险'],
        /** 0401-基本医疗保险 */
        medicalSafe: safeType['基本医疗保险'],
        /** 0505-生育保险 */
        birthSafe: safeType['生育保险'],

      }
    console.log("增添社保人员：", param);
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
    if (options.trader_id) {
      this.setData({
        trader_id: options.trader_id
      });
    }

    // 初始化safeType对象
    var safeType = this.data.safeType,
      itemsSafe = this.data.itemsSafe,
      len = itemsSafe.length;
    for (var i = 0; i < len; i++)
      safeType[itemsSafe[i]] = "2";
    this.setData({
      safeType: safeType
    });
  },

  onReady: function() {

  },

  onShow: function() {

  },
})
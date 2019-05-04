// pages/message/safe/add.js
const data = require('../../../utils/data.js'),
  dateTimePicker = require('../../../utils/dateTimePicker.js');

Page({
  data: {
    name: "",
    idType: '居民身份证',
    idTypeNum: 6,
    idNum: "",
    pay: "",
    personStatus: "0",
    registerType: "001", //户籍类型
    telNo: "13333333333",
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
  /// 表单处理
  ///////////////////////////////////////////

  // 设置姓名
  setName(e) {
    this.setData({
      name: e.detail.detail.value
    });
  },

  // 设置证件号码
  setIdNum(e) {
    this.setData({
      idNum: e.detail.detail.value
    });
  },

  // 设置户口类型
  setRegisterType(e) {
    this.setData({
      registerType: e.detail.detail.value
    });
  },

  // 设置申报工资
  setReportSalary(e) {
    this.setData({
      reportSalary: e.detail.detail.value
    });
  },

  // 选择证件类型
  selectIdType() {
    this.showActionSheet(this.data.itemsId, this.setIdType);
  },

  // 设置证件类型
  setIdType(res) {
    this.setData({
      idType: res.item.name,
      idTypeNum: res.index + 1
    });
  },

  // 选择参保时间
  changeDate(e) {
    this.setData({
      dateIndex: e.detail.value
    });
  },
  // columnChange(e) {
  //   const data = {
  //     dateArray: this.data.dateArray,
  //     dateIndex: this.data.dateIndex
  //   };
  //   data.dateIndex[e.detail.column] = e.detail.value;
  //   this.setData(data);
  // },

  // 多选框
  onCheckBoxTap(res) {
    var current = res.detail.current,
      value = res.detail.value;
    this.data.safeType[value] = current ? "1" : "2";
  },


  ////////////////////////////////////////
  /// 提交请求
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
        // 性别
        sex: "",
        // 国籍
        country: "",
        // 工资薪金
        pay: pageData.pay,
        // 出生日期
        birthday: "",
        // 人员类别
        personType: "",
        // 人员状态
        personStatus: pageData.personStatus,
        // 用工形式 
        workForm: "",
        // 户籍类型
        registerType: pageData.registerType,

        // 申报日期
        reportDate: "201901",
        // 个人社保号
        safeId: "000001",
        // 参保开始日期
        beginDate: this.getBeginDate(),
        // 手机号码
        telNo: pageData.telNo,
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
        // 申报工资
        reportSalary: pageData.reportSalary
      }
    console.log("增添社保人员：", param);
    data.addUserSafe(param, function(res) {
      console.log("submit...res = ", res);
      wx.showToast({
        title: res.data.error,
        icon: 'none',
        duration: 1000
      });
    });
  },

  /////////////////////////////////////////
  /// 通用方法
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

  // 将选择得到的日期转换为"YYYY[0]m"形式
  getBeginDate() {
    let year = this.data.dateArray[0][this.data.dateIndex[0]],
      month = this.data.dateArray[1][this.data.dateIndex[1]];
    if (month < 10)
      return year.toString() + "0" + month.toString();
    else
      return year.toString() + month.toString();
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
  /// 生命周期函数--监听页面加载
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

    // 初始化“年、月”日期数组
    var dateTimeArray = [
      [],
      []
    ];
    dateTimeArray[0] = dateTimePicker.getLoopArray(2019, 2120);
    dateTimeArray[1] = dateTimePicker.getLoopArray(1, 12);
    this.setData({
      dateArray: dateTimeArray,
      dateIndex: [0, 6]
    })
  },

  onReady: function() {

  },

  onShow: function() {

  },
})
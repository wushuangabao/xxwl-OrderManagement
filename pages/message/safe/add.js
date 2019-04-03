// pages/message/safe/add.js
const data = require('../../../utils/data.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  //* 提交请求****************************
  submit:function(){
    let param={
      /** 客户ID */
      traderId: wx.getStorageSync("user_id"),
      /** 机构ID */
      companyId:wx.getStorageSync("company_id"),

      /** 个人社保号 */
      afeId:"",
      /** 证件类型 */
      identityType: 6,
      /** 证件号码 */
      identityId: "331003199410260000",
      /** 姓名 */
      name: "王宏奥",
      /** 性别 */
      sex: "",
      /** 国籍 */
      country: "",
      /** 工资薪金 */
      pay: "120",
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
      safeId:"000001",
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
    data.addUserSafe(param,function(res){
      console.log("submit...res = ",res);
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})
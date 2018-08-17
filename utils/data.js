//////////////////////////API//////////////////////////

// 用户授权接口
const API_LOGON = "http://140.143.154.96/day07/logonAuthServlet"
// 用户注册登记接口
const API_REG = "http://140.143.154.96/day07/regServlet"
// 订单录入接口
const API_BILLCRT = 'http://140.143.154.96/day07/BillCreateServlet'
// 订单查询接口
const API_BILLQRY = 'http://140.143.154.96/day07/BillQueryServlet'
// 工单领取或完工接口
const API_JOBDEAL = "http://140.143.154.96/day07/JobDealServlet"
// 工单查询接口
const API_JOBQRY = "http://140.143.154.96/day07/JobQueryServlet"
// 订单进度查询接口
const API_BILLPRO = "http://140.143.154.96/day07/BillProQueryServlet"
// 企业注册接口
const API_CPNYREG = "http://140.143.154.96/day07/CompanyRegisterServlet"
// 通讯录-用户列表查询接口
const API_USERQRY = "http://140.143.154.96/day07/userQueryServlet"
// 通讯录-调整用户role接口
const API_USERDEAL = "http://140.143.154.96/day07/UserDealServlet"
// 工序设置-模板查询接口
const API_CORPQRY = "http://140.143.154.96/day07/CorparamQueryServlet"
// 工序设置-增减工序接口
const API_CORPDEAL = "http://140.143.154.96/day07/CorparamDealServlet"

const app = getApp()

// wx.request 封装
function wxRequest(url, data, resolve) {
  wx.request({
    url: url,
    data: { ...data
    },
    method: 'POST', //'GET'会中文乱码
    header: {
      'content-type': 'application/x-www-form-urlencoded;charset=utf-8', //'application/json', //application/x-www-form-urlencoded
    },
    success: (data) => resolve(data),
    fail: (err) => console.log(err) //可以加入第四个参数reject方法
  })
}

// 获取role_type
function getRoleType(setRoleType) {
  wxRequest(API_LOGON, {
    user_id: wx.getStorageSync('user_id'),
    nickname: app.globalData.userInfo.nickName,
  }, setRoleType)
}

// 上传录入订单数据
function upLoadRecpt(receipt_type, receipt_name, remark, cif_user_id, cif_user_name) {
  var data = {
    user_id: wx.getStorageSync('user_id'),
    user_name: app.globalData.userInfo.nickName,
    role_type: wx.getStorageSync('role_type'),
    company_id: wx.getStorageSync('company_id'),
    receipt_type: receipt_type,
    receipt_name: receipt_name,
    remark: remark,
    cif_user_id: cif_user_id,
    cif_user_name: cif_user_name
  }
  console.log("my data:")
  console.log(data)
  wxRequest(API_BILLCRT, data, putOutInfo)
}

// 获取订单数组的数据
function getRecptData(status, func) {
  wxRequest(API_BILLQRY, {
    user_id: wx.getStorageSync('user_id'),
    work_status: status,
    user_name: app.globalData.userInfo.nickName,
    role_type: wx.getStorageSync('role_type'),
    company_id: wx.getStorageSync('company_id'),
  }, func)
}

// 获取订单进度查询数据
function getProgrData(receipt_number, receipt_type, func) {
  wxRequest(API_BILLPRO, {
    receipt_number: receipt_number,
    receipt_type: receipt_type,
    user_id: wx.getStorageSync('user_id'),
    user_name: app.globalData.userInfo.nickName,
    role_type: wx.getStorageSync('role_type'),
    company_id: wx.getStorageSync('company_id'),
  }, func)
}

// 获取工单表
function getOpertData(status_n, func) {
  wxRequest(API_JOBQRY, {
    user_id: wx.getStorageSync('user_id'),
    user_name: app.globalData.userInfo.nickName,
    role_type: wx.getStorageSync('role_type'),
    company_id: wx.getStorageSync('company_id'),
    work_status: status_n,
  }, func)
}

// 工单操作-领取
function upLoadOpertGet(job_number, time) {
  var data = {
    job_event: "01",
    user_id: wx.getStorageSync('user_id'),
    job_number: job_number,
    user_name: app.globalData.userInfo.nickName,
    //time: time,
    role_type: wx.getStorageSync('role_type'),
    company_id: wx.getStorageSync('company_id'),
  }
  wxRequest(API_JOBDEAL, data, putOutInfo)
}

// 工单操作-完工
function upLoadOpertDone(job_number, note) {
  var data = {
    job_event: "02",
    user_id: wx.getStorageSync('user_id'),
    job_number: job_number,
    user_name: app.globalData.userInfo.nickName,
    role_type: wx.getStorageSync('role_type'),
    company_id: wx.getStorageSync('company_id'),
    //time: time,
    remark: note,
  }
  wxRequest(API_JOBDEAL, data, putOutInfo)
}

// 公司注册
function registerCompany(company_name) {
  var nickname = app.globalData.userInfo.nickName,
    data = {
      company_name: company_name,
      company_type: "001", //服装
      user_id: wx.getStorageSync('user_id'),
      user_name: nickname,
      nickname: nickname,
    };
  console.log('registerCompany', data)
  wxRequest(API_CPNYREG, data, putOutInfo)
}

// 通讯录：用户列表查询
function getFriendsList(user_type, func) {
  var data = {
    user_id: wx.getStorageSync('user_id'),
    user_name: app.globalData.userInfo.nickName,
    role_type: wx.getStorageSync('role_type'),
    company_id: wx.getStorageSync('company_id'),
    user_type: user_type, //1、客户 2、员工 3、伙伴 0、其他
  }
  console.log("my data = ", data)
  wxRequest(API_USERQRY, data, func)
}

// 通讯录：用户role调整
function changeFriendInfo(user_id1, user_type1, role_type1) {
  var data = {
    user_id: wx.getStorageSync('user_id'),
    user_name: app.globalData.userInfo.nickName,
    role_type: wx.getStorageSync('role_type'),
    company_id: wx.getStorageSync('company_id'),
    user_id1: user_id1,
    user_event: "01",
    user_type1: user_type1, //0-3：其他、客户、员工、伙伴
    role_type1: role_type1,
  }
  wxRequest(API_USERDEAL, data, putOutInfo)
}

// 工序设置：查询模板
function getCorparam(recpt_type, func) {
  var data = {
    user_id: wx.getStorageSync('user_id'),
    user_name: app.globalData.userInfo.nickName,
    role_type: wx.getStorageSync('role_type'),
    company_id: wx.getStorageSync('company_id'),
    their_scene_code: "03", //（主体代码，先写死"03"）
    their_scene_type: recpt_type, //（订单类型，目前301有数据）
  }
  wxRequest(API_CORPQRY, data, func)
}

// 工序设置：增/减工序  event参数从add和minus中二选一,param是一个对象
function changeCorparam(event,param,func) {
  var cor_event;
  if (event == "add")
    cor_event = "1";
  else if (event == "minus")
    cor_event = "2";
  var data = {
    user_id: wx.getStorageSync('user_id'),
    user_name: app.globalData.userInfo.nickName,
    role_type: wx.getStorageSync('role_type'),
    company_id: wx.getStorageSync('company_id'),
    cor_event: cor_event,
    their_scene_code:"03",
    their_scene_type: param.recpt_type,
    their_scene_name: param.recpt_name,
    pre_associate_code: param.pre_code,
    pre_associate_type: param.pre_type,
    pre_associate_name: param.pre_name,
    their_associate_code: "02", //表示工单
    their_associate_type: param.my_type,
    their_associate_name: param.my_name,
    next_associate_code: param.next_code,
    next_associate_type: param.next_type,
    next_associate_name: param.next_name,
  };
  console.log("my data:",data);
  wxRequest(API_CORPDEAL, data, func);
}

//输出服务器返回的信息
function putOutInfo(res) {
  console.log(res)
}

//////////////////////////data//////////////////////////

//订单类型列表
const receipt_type = ['请选择订单类型', '连衣裙', '上衣', '西服']

// 将订单号简化成“***123”的形式
function convertRecptNum(string) {
  var len = string.length
  if (len > 3) {
    var i = len - 3
    return "***" + string.slice(i)
  } else {
    return string
  }
}

// 将“数字”字符串转换为“工序状态”字符串
function convertState(string) {
  switch (string) {
    case "0":
      return "待领取"
    case "1":
      return "未完成"
    case "2":
      return "已完成"
  }
}

// 将“数字”字符串转换为“订单类型”字符串
function convertType(string) {
  switch (string) {
    case "301":
      return "连衣裙"
    case "302":
      return "上衣"
    case "303":
      return "西服"
  }
}

///<summary>获得字符串实际长度，中文2，英文1</summary>
function getLength(str) {
  var realLength = 0,
    len = str.length,
    charCode = -1;
  for (var i = 0; i < len; i++) {
    charCode = str.charCodeAt(i);
    if (charCode >= 0 && charCode <= 128)
      realLength += 1;
    else
      realLength += 2;
  }
  return realLength;
}

///<summary>根据实际长度n截取字符串的前n-1实际长度的字符，加上…符号</summary>
function simplfStr(remark, n) {
  if (getLength(remark) <= n)
    return remark;
  var i = 0,
    len = 0,
    realLen = n - 2,
    charCode = -1;
  while (i < realLen) {
    charCode = remark.charCodeAt(i);
    if (charCode >= 0 && charCode <= 128) {
      i += 1;
      len++
    } else {
      i += 2;
      len++
    }
  }
  return remark.slice(0, len) + "…"
}

module.exports = {
  wxRequest: wxRequest,
  getRoleType: getRoleType,
  upLoadRecpt: upLoadRecpt,
  getRecptData: getRecptData,
  getProgrData: getProgrData,
  getOpertData: getOpertData,
  upLoadOpertGet: upLoadOpertGet,
  upLoadOpertDone: upLoadOpertDone,
  registerCompany: registerCompany,
  getFriendsList: getFriendsList,
  changeFriendInfo: changeFriendInfo,
  getCorparam: getCorparam,
  changeCorparam: changeCorparam,

  convertType: convertType,
  convertRecptNum: convertRecptNum,
  simplfStr: simplfStr,

  receipt_type: receipt_type,
}
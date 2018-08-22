///////////////////////////////////////////////////////
//request API
///////////////////////////////////////////////////////

// URL通用部分
const URL_BASE = "http://140.143.154.96/day07/"
// 用户授权接口
var API_LOGON = URL_BASE + "logonAuthServlet",
  // 用户注册登记接口
  API_REG = URL_BASE + "regServlet",
  // 订单录入接口
  API_BILLCRT = URL_BASE + "BillCreateServlet",
  // 订单查询接口
  API_BILLQRY = URL_BASE + "BillQueryServlet",
  // 工单领取或完工接口
  API_JOBDEAL = URL_BASE + "JobDealServlet",
  // 工单查询接口
  API_JOBQRY = URL_BASE + "JobQueryServlet",
  // 订单进度查询接口
  API_BILLPRO = URL_BASE + "BillProQueryServlet",
  // 企业注册接口
  API_CPNYREG = URL_BASE + "CompanyRegisterServlet",
  // 通讯录-用户列表查询接口
  API_USERQRY = URL_BASE + "userQueryServlet",
  // 通讯录-调整用户role接口
  API_USERDEAL = URL_BASE + "UserDealServlet",
  // 工序设置-模板查询接口
  API_CORPQRY = URL_BASE + "CorparamQueryServlet",
  // 工序设置-增减工序接口
  API_CORPDEAL = URL_BASE + "CorparamDealServlet",
  // 角色、订单、工单类型的代码、名称查询接口
  API_PARAQRY = URL_BASE + "ParamQueryServlet",
  // 行业的代码、名称查询接口
  API_INDUSTRY = URL_BASE + "IndustryQueryServlet",
  // 图片上传接口
  API_IMGUP = URL_BASE + "TestUpServlet", //"TestImageServlet",//"ImageUpServlet",//
  // 图片下载接口
  API_IMGDOWN = URL_BASE + "ImageDownServlet"

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

// 获取role_type************************************************
function getRoleType(setRoleType) {
  var company_id, friend_id, user_id;
  if (user_id = wx.getStorageSync('user_id'))
    console.log("getRoleType...成功读取缓存中的user_id =", user_id)
  else {
    console.log("getRoleType...读取缓存中的user_id失败，退出API_LOGON");
    return;
  }
  try {
    company_id = wx.getStorageSync('company_id')
  } catch (e) {
    company_id = ''
  }
  try {
    friend_id = wx.getStorageSync('friend_id')
  } catch (e) {
    friend_id = ''
  }
  var data = {
    user_id: user_id,
    nickname: app.globalData.userInfo.nickName,
    image_address: app.globalData.userInfo.avatarUrl,
    company_id: company_id,
    friend_id: friend_id,
  };
  wxRequest(API_LOGON, data, setRoleType)
  console.log("API_LOGON...upload my userInfo:", data)
}

// 上传录入订单数据**********************************************
function upLoadRecpt(receipt_type, receipt_name, remark, cif_user_id, cif_user_name, func) {
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
  wxRequest(API_BILLCRT, data, func)
}

// 获取订单数组的数据**********************************************
// 或者查询某一张订单的信息。如果是数组，receipt_number="00000"
function getRecptData(status, receipt_number, func) {
  var gmt_modify = wx.getStorageSync('gmt_modify');
  if (gmt_modify == '')
    gmt_modify = '9999-12-31.0';
  console.log('getRecptData...gmt_modify =', gmt_modify);
  wxRequest(API_BILLQRY, {
    user_id: wx.getStorageSync('user_id'),
    work_status: status,
    user_name: app.globalData.userInfo.nickName,
    role_type: wx.getStorageSync('role_type'),
    company_id: wx.getStorageSync('company_id'),
    receipt_number: receipt_number,
    gmt_modify: gmt_modify,
  }, func)
}

// 获取订单进度查询数据**********************************************
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

// 获取工单表**********************************************
function getOpertData(status_n, func) {
  var apply_receive_time = wx.getStorageSync('apply_receive_time');
  if (apply_receive_time == '')
    apply_receive_time = '9999-12-31.0';
  console.log('getOpertData...apply_receive_time =', apply_receive_time);
  wxRequest(API_JOBQRY, {
    user_id: wx.getStorageSync('user_id'),
    user_name: app.globalData.userInfo.nickName,
    role_type: wx.getStorageSync('role_type'),
    company_id: wx.getStorageSync('company_id'),
    work_status: status_n,
    apply_receive_time: apply_receive_time,
  }, func)
}

// 工单操作-领取**********************************************
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

// 工单操作-完工**********************************************
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

// 企业注册**********************************************
function registerCompany(company_name, company_type) {
  var nickname = app.globalData.userInfo.nickName,
    data = {
      company_name: company_name,
      company_type: company_type,
      user_id: wx.getStorageSync('user_id'),
      user_name: nickname,
      nickname: nickname,
    };
  console.log('registerCompany, my data = ', data)
  wxRequest(API_CPNYREG, data, setCompanyID)
}

// 将company_id写入缓存----------------------------------
function setCompanyID(res) {
  wx.setStorageSync('company_id', res.data.company_id)
}

// 通讯录：用户列表查询**********************************************
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

// 通讯录：用户role调整**********************************************
function changeFriendInfo(user_id1, user_type1, role_type1) {
  var user_id = wx.getStorageSync('user_id');
  var data = {
    user_id: user_id,
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

// 工序设置：查询模板**********************************************
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

// 工序设置：增/减工序**********************************************
// event参数从"add"和"minus"中二选一,param是一个对象，具体设置看下面的代码
function changeCorparam(event, param, func) {
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
    their_scene_code: "03",
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
  console.log("my data:", data);
  wxRequest(API_CORPDEAL, data, func);
}

//输出服务器返回的信息------------------------------------------
function putOutInfo(res) {
  console.log(res)
}

// 角色类型、订单类型、工单类型的代码\名称查询********************
function getParam(code, func) {
  wxRequest(API_PARAQRY, {
    industry_code: "10", //行业代码
    industry_type: "101", //行业类型
    entity_code: code, //实体代码 "01"角色类型 "02"工单类型 "03"订单类型
  }, func)
}

// 行业类型 查询**********************************************
function getIndustry() {
  var user_name, role_type, company_id, user_id;
  try {
    user_name = app.globalData.userInfo.nickName
  } catch (e) {
    console.log("getIndustry...set user_name fail")
    user_name = ""
  }
  try {
    role_type = wx.getStorageSync('role_type')
  } catch (e) {
    console.log("getIndustry...set role_type fail")
    role_type = ""
  }
  try {
    company_id = wx.getStorageSync('company_id')
  } catch (e) {
    console.log("getIndustry...set company_id fail")
    company_id = ""
  }
  try {
    user_id = wx.getStorageSync('user_id')
  } catch (e) {
    console.log("getIndustry...set user_id fail")
    user_id = ""
  }
  var data = {
    user_id: user_id,
    user_name: user_name,
    role_type: role_type,
    company_id: company_id
  }
  wxRequest(API_INDUSTRY, data, setIndustry)
}

///////////////////////////////////////////////////////
//data
///////////////////////////////////////////////////////

// 将行业类型的数组写入app.globalData
function setIndustry(res) {
  app.globalData.industry = res.data
  console.log("setIndustry, industry = ", app.globalData.industry)
}

//订单类型列表
const receipt_type = ['请选择订单类型', '连衣裙', '上衣', '西服']

// 将订单号简化成“***123”的形式**********************************************
function convertRecptNum(string) {
  var len = string.length
  if (len > 3) {
    var i = len - 3
    return "***" + string.slice(i)
  } else {
    return string
  }
}

// 将“数字”字符串转换为“订单类型”字符串**************************************
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

// 获得字符串实际长度，中文2，英文1------------------------------------------
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

//根据实际长度n截取字符串的前n-1实际长度的字符，加上…符号********************
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

//////////////////////////////////////////////////////////
//module API
//////////////////////////////////////////////////////////

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

  getParam: getParam,
  getIndustry: getIndustry,

  convertType: convertType,
  convertRecptNum: convertRecptNum,
  simplfStr: simplfStr,

  API_IMGUP: API_IMGUP,
  API_IMGDOWN: API_IMGDOWN,
}
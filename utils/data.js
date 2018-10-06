//////////////////////////////////////////////////////
// URL\通用常量
///////////////////////////////////////////////////////

const URL_BASE = "https://www.xiangxun1.com/day07/", // http://140.143.154.96
  Img_Url = 'https://www.gongnang.com/uploads/files/',
  app = getApp();

// 用户-授权
var API_LOGON = URL_BASE + "logonAuthServlet",
  // 用户-注册登记
  API_REG = URL_BASE + "regServlet",
  // 企业-注册
  API_CPNYREG = URL_BASE + "CompanyRegisterServlet",
  //---------------------------------------------
  // 订单-录入
  API_BILLCRT = URL_BASE + "BillCreateServlet",
  // 订单-查询
  API_BILLQRY = URL_BASE + "BillQueryServlet",
  // 订单-进度查询
  API_BILLPRO = URL_BASE + "BillProQueryServlet",
  //---------------------------------------------
  // 工单-领取或完工
  API_JOBDEAL = URL_BASE + "JobDealServlet",
  // 工单-查询
  API_JOBQRY = URL_BASE + "JobQueryServlet",
  //---------------------------------------------
  // 通讯录-用户列表查询接口
  API_USERQRY = URL_BASE + "userQueryServlet",
  // 通讯录-调整用户role接口
  API_USERDEAL = URL_BASE + "UserDealServlet",
  //---------------------------------------------
  // 工序设置-模板查询接口
  API_CORPQRY = URL_BASE + "CorparamQueryServlet",
  // 工序设置-增减工序接口
  API_CORPDEAL = URL_BASE + "CorparamDealServlet",
  //--------------------------------------------
  // 查询-角色、订单、工单类型的代码、名称
  API_PARAQRY = URL_BASE + "ParamQueryServlet",
  // 查询-行业的代码、名称
  API_INDUSTRY = URL_BASE + "IndustryQueryServlet",
  //---------------------------------------------
  // 点赞、评论-操作
  API_RATINGCRT = URL_BASE + "RatingCreateServlet",
  // 点赞、评论-查询
  API_RATINGQRY = URL_BASE + "RatingQueryServlet",
  //---------------------------------------------
  // 图片-上传
  API_IMGUP = URL_BASE + "TestUpServlet", //"TestImageServlet",//"ImageUpServlet",//
  // 图片-下载
  API_IMGDOWN = URL_BASE + "ImageDownServlet";


// wx.request 封装-----------------------------------
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

//////////////////////////////////////////////////
// request API实现
//////////////////////////////////////////////////

// 获取role_type************************************************
function getRoleType(setRoleType) {
  var company_id = wx.getStorageSync('company_id'),
    friend_company_id = wx.getStorageSync('friend_company_id'),
    friend_id = wx.getStorageSync('friend_id'),
    user_id = wx.getStorageSync('user_id'),
    code = wx.getStorageSync('code'),
    info = wx.getStorageSync('info'),
    entity_type = info.entity_type,
    associate_type = info.associate_type,
    associate_number = info.associate_number,
    associate_name = info.associate_name;
  if (user_id)
    console.log("getRoleType...成功读取缓存中的user_id =", user_id)
  else {
    console.log("getRoleType...读取缓存中的user_id失败，发送code:", code);
    user_id = '00000';
    wx.setStorageSync('user_id', user_id);
  }
  if (!friend_company_id)
    friend_company_id = '00000';
  if (!company_id)
    company_id = '00000';
  if (!friend_id)
    friend_id = '00000';
  var data = {
    user_id: user_id,
    nickname: app.globalData.userInfo.nickName,
    image_address: app.globalData.userInfo.avatarUrl,
    company_id: company_id,
    friend_company_id: friend_company_id,
    friend_id: friend_id,
    code: code,
    their_entity_type: entity_type,
    their_associate_type: associate_type,
    their_associate_number: associate_number,
    their_associate_name: associate_name
  };
  wxRequest(API_LOGON, data, setRoleType)
  console.log("API_LOGON...upload my userInfo:", data)
}

// 上传录入订单数据**********************************************
function upLoadRecpt(param, func) {
  var data = {
    user_id: wx.getStorageSync('user_id'),
    user_name: app.globalData.userInfo.nickName,
    role_type: wx.getStorageSync('role_type'),
    company_id: wx.getStorageSync('company_id'),
    receipt_type: param.receipt_type,
    receipt_name: param.receipt_name,
    remark: param.remark,
    cif_user_id: param.cif_user_id,
    cif_user_name: param.cif_user_name,
    image_1: param.image_1,
    image_2: param.image_2,
    image_3: param.image_3,
    image_4: param.image_4,
  }
  console.log("upLoadRecpt...my data =", data)
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
function upLoadOpertGet(job_number, func) {
  var data = {
    job_event: "01",
    user_id: wx.getStorageSync('user_id'),
    job_number: job_number,
    user_name: app.globalData.userInfo.nickName,
    role_type: wx.getStorageSync('role_type'),
    company_id: wx.getStorageSync('company_id'),
  }
  wxRequest(API_JOBDEAL, data, func)
}

// 工单操作-完工**********************************************
function upLoadOpertDone(param, func) {
  var data = {
    job_event: "02",
    user_id: wx.getStorageSync('user_id'),
    job_number: param.job_number,
    user_name: app.globalData.userInfo.nickName,
    role_type: wx.getStorageSync('role_type'),
    company_id: wx.getStorageSync('company_id'),
    //time: time,
    remark: param.remark,
    image_1: param.image_1,
    image_2: param.image_2,
    image_3: param.image_3,
    image_4: param.image_4,
  }
  wxRequest(API_JOBDEAL, data, func)
}

// 企业注册**********************************************
function registerCompany(company_name, company_type, fun) {
  var nickname = app.globalData.userInfo.nickName,
    data = {
      company_name: company_name,
      company_type: company_type,
      user_id: wx.getStorageSync('user_id'),
      user_name: nickname,
      nickname: nickname,
    };
  console.log('registerCompany, my data = ', data)
  wxRequest(API_CPNYREG, data, fun)
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
  wxRequest(API_USERQRY, data, func)
}

// 通讯录：用户role调整**********************************************
function changeFriendInfo(user_id1, user_type1, role_type1, user_type0, role_type0, func) {
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
    user_type0: user_type0, //调整前的用户类型
    role_type0: role_type0, //调整前的角色类型
  }
  wxRequest(API_USERDEAL, data, func)
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

// 角色类型、订单类型、工单类型的代码\名称查询********************
function getParam(code, func) {
  var company_type = wx.getStorageSync('company_type');
  wxRequest(API_PARAQRY, {
    industry_code: company_type.slice(0, 2), //行业代码
    industry_type: company_type.slice(2), //行业类型
    entity_code: code, //实体代码 "01"角色类型 "02"工单类型 "03"订单类型
  }, func)
}

// 行业类型 查询**********************************************
function getIndustry() {
  var user_name, role_type, company_id, user_id;
  user_name = app.globalData.userInfo.nickName;
  role_type = wx.getStorageSync('role_type');
  company_id = wx.getStorageSync('company_id');
  user_id = wx.getStorageSync('user_id');
  var data = {
    user_id: user_id,
    user_name: user_name,
    role_type: role_type,
    company_id: company_id
  }
  wxRequest(API_INDUSTRY, data, setIndustry)
}

// 订单类型 查询**************************************************
function getRecptType() {
  getParam("03", setRecptType)
}

// 用户进行点赞、评论*******************************************
function ratingCreate(param, func) {
  var data = {
    user_id: wx.getStorageSync('user_id'),
    user_name: app.globalData.userInfo.nickName,
    role_type: wx.getStorageSync('role_type'),
    company_id: wx.getStorageSync('company_id'),
    ////
    their_entity_type: param.entity_code, //02表示工单，03表示订单
    their_associate_type: param.entity_type,
    their_associate_number: param.entity_number,
    their_associate_name: param.entity_name,
    rating_type: param.rating_type, //101表示点赞，102表示评论
    rating_name: param.rating_name,
    remark: param.remark
  };
  wxRequest(API_RATINGCRT, data, func);
}

// 点赞、评论记录查询******************************************
function ratingQuery(param, func) {
  var data = {
    user_id: wx.getStorageSync('user_id'),
    user_name: app.globalData.userInfo.nickName,
    role_type: wx.getStorageSync('role_type'),
    company_id: wx.getStorageSync('company_id'),
    ////
    their_entity_type: param.entity_code, //主体代码：02是工单，03是订单
    their_associate_type: param.entity_type, //订单或工单的类型编号
    their_associate_number: param.entity_number, //订单或工单的编号
  };
  wxRequest(API_RATINGQRY, data, func);
}

///////////////////////////////////////////////////////
// 全局data处理
///////////////////////////////////////////////////////

// 将行业类型的数组写入app.globalData----------------------------
function setIndustry(res) {
  app.globalData.industry = res.data
  console.log("setIndustry, industry = ", app.globalData.industry)
}

// 将订单类型的数据写入app.globalData------------------------------
function setRecptType(res) {
  app.globalData.receiptType = res.data
  console.log("setRecptType, receiptType = ", app.globalData.receiptType)
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
function convertType(str) {
  var recptType = app.globalData.receiptType,
    len = recptType.length;
  for (var i = 0; i < len; i++) {
    if (recptType[i].entity_type == str) {
      return recptType[i].type_name;
    }
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
  if (remark == 'null')
    return '';
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
      len++;
    }
  }
  return remark.slice(0, len) + "…"
}

//////////////////////////////////////////////////////////
// module API
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
  getRecptType: getRecptType,
  ratingCreate: ratingCreate,
  ratingQuery: ratingQuery,

  convertType: convertType,
  convertRecptNum: convertRecptNum,
  simplfStr: simplfStr,

  Img_Url: Img_Url,
  API_IMGUP: API_IMGUP,
  API_IMGDOWN: API_IMGDOWN,
  URL_BASE: URL_BASE,
}
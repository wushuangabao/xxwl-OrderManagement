// pages/market/content/list.js
const data = require('../../../utils/data.js');

Page({
  data: {
    contents: [{
        content_name: "",
        remark: "",
        img_path: ""
      },
      {
        content_name: "",
        remark: "",
        img_path: ""
      },
    ],
    menuObject: {},
  },

  //* 跳转到内容详情页面************************
  goToContent: function(e) {
    var index = e.currentTarget.dataset.id;
    this.goToContentById(index);
  },
  goToContentById: function(id) {
    var content = this.data.contents[id];
    wx.navigateTo({
      url: 'content?content_id=' + content.content_number + '&content_name=' + content.content_name + '&content_type=' + content.content_type + '&url=' + content.content_ip,
    });
  },

  //* 显示moreInfo menu************************
  showMoreInfo: function(e) {
    var that = this,
      url = "", index = e.currentTarget.dataset.id,
      content_type = this.data.contents[index].content_type;
    wx.showActionSheet({
      itemList: that.data.menuObject[content_type],
      success(res) {
        var value = that.data.menuObject[content_type][res.tapIndex];
        switch (value) {
          case "店铺":
            url = "/pages/market/shop/list";
            break;
          case "订单":
            url = "/pages/inquiry/inquiry";
            break;
          case "详情":
            that.goToContentById(index);
            return;
        }
        wx.navigateTo({
          url: url,
        });
      }
    })
  },

  // 设置内容列表----------------------------------
  setContents: function(res) {
    var data = res.data,
      len = data.length;
    console.log("setContent...res.data = ", data);
    for (var i = 0; i < len; i++) {
      // data[i].img_path = data[i].image_1;
      data[i].img_path = "/imgs/image.png";
      data[i].index = i;
    }
    this.setData({
      contents: data
    });
    this.setMenu();
  },
  // 设置内容列表并跳转到指定content_number的内容页面------
  setContentsAndGo: function(res) {
    var data = res.data,
      len = data.length,
      idToGo = -1;
    console.log("setContent...res.data = ", data);
    for (var i = 0; i < len; i++) {
      // data[i].img_path = data[i].image_1;
      data[i].img_path = "/imgs/image.png";
      data[i].index = i;
      if (data[i].content_number == this.data.content_number)
        idToGo = i;
    }
    this.setData({
      contents: data
    });
    this.setMenu();
    if (idToGo != -1)
      this.goToContentById(idToGo);
  },

  // 设置moreInfo菜单的内容--------------------------
  setMenu: function() {
    //遍历contents数组中的content_type属性，将它们添加到数组content_types中
    var contents = this.data.contents,
      len = contents.length;
    if (len == 0)
      return;
    var content_types = [contents[0].content_type];
    for (var i = 1; i < len; i++) {
      var n = content_types.length,
        type = contents[i].content_type,
        b = false;
      for (var j = 0; j < n; j++) {
        if (type === content_types[j]) {
          b = true;
          break;
        }
      }
      if (!b) {
        content_types.push(type);
      }
    }
    this.setData({
      content_types: content_types
    });
    //根据不同的content_types，查询若干个路由菜单列表，以content_type为key将这些列表放入menuObject
    len = content_types.length;
    for (var i = 0; i < len; i++) {
      this.setData({
        string: 'menuObject.' + content_types[i]
      })
      //first
      var param = {
        their_scene_code: "01",
        their_scene_type: wx.getStorageSync('role_type'),
        their_scene_name: "用户",
        their_associate_code: "07",
        their_associate_type: content_types[i],
        their_associate_name: "内容",
      };
      data.getParamsByEntity(param, this.setMenuObject);
      //second
      param.their_associate_type = "000";
      data.getParamsByEntity(param, this.setMenuObject);
      //third
      param.their_associate_type = content_types[i];
      param.their_scene_type = "000";
      data.getParamsByEntity(param, this.setMenuObject);
      //fourth
      param.their_associate_type = "000";
      data.getParamsByEntity(param, this.setMenuObject);
      //等待回调函数执行完再进入下一轮循环
    }
  },

  setMenuObject: function(res) {
    var data = res.data,
      l = data.length,
      array = new Array(l);
    console.log("setMenu...res.data = ", data);
    if (l > 0) {
      for (var j = 0; j < l; j++) {
        array[j] = data[j].other_associate_name;
      }
      var string = this.data.string;
      this.setData({
        [string]: array
      })
    }
  },

  //* 监听页面加载**********************************
  onLoad: function(options) {
    if (options.signal == "07") { //表示由转发的小程序进入本页（之前已经去过首页）
      var options = wx.getStorageSync('options'),
        their_associate_code = options.their_associate_code,
        their_associate_type = options.their_associate_type,
        their_associate_number = options.their_associate_number,
        their_associate_name = options.their_associate_name,
        other_associate_code = options.other_associate_code,
        other_associate_type = options.other_associate_type,
        other_associate_number = options.other_associate_number,
        other_associate_name = options.other_associate_name;
      // var url = options.url + '?their_associate_code=' + their_associate_code + '&their_associate_type=' + their_associate_type + '&their_associate_number=' + their_associate_number + '&their_associate_name=' + their_associate_name + '&other_associate_name=' + other_associate_name + '&other_associate_code=' + other_associate_code + '&other_associate_number=' + other_associate_number + '&other_associate_type=' + other_associate_type;
      this.setData({
        // url: url,
        content_number: other_associate_number
      });
      var entity1 = {
          code: their_associate_code,
          type: their_associate_type,
          number: their_associate_number,
          name: their_associate_name
        },
        entity2 = {
          code: other_associate_code,
          type: other_associate_type,
          number: other_associate_number,
          name: other_associate_name
        },
        that = this;
      data.createRelation(entity1, entity2, function(res) {
        console.log('根据内容分享建立关系...res.data = ', res.data);
        data.getContent({
          their_associate_type: wx.getStorageSync('role_type'),
          their_associate_number: wx.getStorageSync('user_id'),
          their_associate_name: getApp().globalData.userInfo.nickName,
        }, that.setContentsAndGo);
      });
    } else { //表示不是由别人的转发进入的
      data.getContent({
        their_associate_type: wx.getStorageSync('role_type'),
        their_associate_number: wx.getStorageSync('user_id'),
        their_associate_name: getApp().globalData.userInfo.nickName,
      }, this.setContents);
    }
  },

  //* 监听页面显示****************************
  onShow: function() {
    //设置tabBar
    var myTabBar = getApp().globalData.tabBar,
      len = myTabBar.list.length;
    for (var i = 0; i < len; i++) {
      if (myTabBar.list[i].text == "内容")
        myTabBar.list[i].active = true;
      else
        myTabBar.list[i].active = false;
    }
    this.setData({
      tabBar: myTabBar,
    })
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

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})
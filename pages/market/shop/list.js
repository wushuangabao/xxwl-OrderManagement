// pages/market/shop/list.js
const data = require('../../../utils/data.js'),
  app = getApp();

Page({
  data: {
    shopList: [],
    hasTabBar: true,
    isLoading: false,
  },

  //* 跳转到店铺详情页面************************
  goToShop: function(event) {
    var index = event.currentTarget.dataset.id;
    this.goToShopById(index);
  },
  //* 跳转到店铺详情页面（根据id）**************
  goToShopById: function(index) {
    var shop = this.data.shopList[index];
    wx.setStorageSync('imgUrl_1', shop.img_path);
    wx.setStorageSync('imgUrl_2', shop.image_2);
    wx.setStorageSync('imgUrl_3', shop.image_3);
    wx.setStorageSync('imgUrl_4', shop.image_4);
    wx.setStorageSync('product', [shop.product_1, shop.product_2, shop.product_3, shop.product_4])
    wx.navigateTo({
      url: 'shop?remark=' + shop.remark + '&shop_name=' + shop.shop_name + '&address=' + shop.shop_address + '&shop_type=' + shop.shop_type + '&shop_number=' + shop.shop_number
    });
  },

  // 设置shopList--------------------------------------------
  setShopList: function(res) {
    var data_ = res.data,
      len = data_.length;
    console.log("setShopList...res.data = ", data_);
    if (len > 0) {
      var shopList = this.data.shopList;
      for (var i = 0; i < len; i++) {
        data_[i].index = i;
        if (data_[i].image_1.length > 10)
          data_[i].img_path = data_[i].image_1;
        else
          data_[i].img_path = data.Img_Url + 'shop_img_' + i + '.png';
        shopList.push(data_[i]);
      }
      wx.setStorageSync('gmt_modify', data_[len - 1].gmt_modify);
      this.setData({
        shopList: shopList
      });
      this.setMenu();
      this.setLoading(false);
    } else {
      this.setLoading(false);
      wx.showToast({
        title: '没有更多的了',
        icon: 'none',
        duration: 1000
      });
    }
  },
  // 设置shopList，并根据指定的shop_number跳转-----------------
  setShopListAndGoToShop: function(res) {
    var data_ = res.data,
      len = data_.length,
      idToGo = -1;
    console.log("setShopListAndGoToShop...res.data = ", data_);
    for (var i = 0; i < len; i++) {
      data_[i].index = i;
      if (data_[i].image_1.length > 10)
        data_[i].img_path = data_[i].image_1;
      else
        data_[i].img_path = data.Img_Url + 'shop_img_' + i + '.png';
      if (data_[i].shop_number == this.data.shop_number)
        idToGo = i;
    }
    this.setData({
      shopList: data_
    });
    wx.setStorageSync('gmt_modify', data_[len - 1].gmt_modify);
    this.setLoading(false);
    this.setMenu();
    if (idToGo != -1)
      this.goToShopById(idToGo);
  },

  ///////////////////////////////////////////////////////
  // morInfo menu
  // 路由菜单
  ///////////////////////////////////////////////////////

  //* 显示moreInfo menu************************
  showMoreInfo: function(e) {
    var index = e.currentTarget.dataset.id,
      shop_type = this.data.shopList[index].shop_type,
      shop_number = this.data.shopList[index].shop_number;
    app.globalData.setTheirInfo("09", shop_type, shop_number);
    app.globalData.showMoreInfo(this, index, shop_type, this.goToShopById);
  },

  // 设置moreInfo菜单的内容--------------------------
  setMenu: function() {
    app.globalData.setMenu(this, this.data.shopList, "shop_type", "09");
  },

  ///////////////////////////////////////////////////////
  // 生命周期函数
  ///////////////////////////////////////////////////////

  //* 生命周期函数--监听页面加载***************************************
  onLoad: function(options) {
    var param, user_name;
    if (options.hasTabBar == "false") {
      this.setData({
        hasTabBar: false
      });
      param = app.globalData.param;
    } else param = {
      their_associate_code: "01", //主体。用户为“01”
      their_associate_type: "000",
      their_associate_number: wx.getStorageSync('user_id'),
      their_associate_name: user_name,
      other_associate_code: "09", //所选的主体。店铺为“09”
      other_associate_type: "000",
      other_associate_number: "00000",
      other_associate_name: "",
    };
    this.setLoading(true);
    wx.setStorageSync('gmt_modify', '');
    if (options.their_associate_code || options.signal) { //如果是他人分享的
      var options_ = options,
        options = null;
      if (options_.signal == "09") { //表示已经进入过本页面，是从首页回来的
        options = wx.getStorageSync('options');
        this.setData({
          shop_number: options.other_associate_number,
        });
      } else { //表示是点击分享小程序后首次进入本页
        wx.setStorageSync('options', options_);
        wx.redirectTo({
          url: "/pages/index/index?signal=09"
        })
        return;
      }
      // 建立关系----------------------------
      var entity1 = {
          code: options.their_associate_code,
          type: options.their_associate_type,
          number: options.their_associate_number,
          name: options.their_associate_name,
        },
        entity2 = {
          code: options.other_associate_code,
          type: options.other_associate_type,
          number: options.other_associate_number,
          name: options.other_associate_name,
        },
        that = this;
      data.createRelation(entity1, entity2, function(res) {
        console.log("基于店铺分享建立关系...res = ", res);
        data.getShopList(param, that.setShopListAndGoToShop);
      });
    } else //如果不是他人分享的
      data.getShopList(param, this.setShopList);
  },

  //* 生命周期函数--监听页面显示**********************************
  onShow: function() {
    //设置tabBar
    var myTabBar = app.globalData.tabBar,
      len = myTabBar.list.length;
    for (var i = 0; i < len; i++) {
      if (myTabBar.list[i].text == "店铺")
        myTabBar.list[i].active = true;
      else
        myTabBar.list[i].active = false;
    }
    this.setData({
      tabBar: myTabBar,
    });
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {},

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {},

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {},

  //* 页面上拉触底事件的处理函数***************************
  onReachBottom: function() {
    if (this.data.isLoading)
      return;
    var param = this.data.param;
    this.setLoading(true);
    data.getShopList(param, this.setShopList);
  },

  // 让用户进入、退出等待状态---------
  setLoading: function(b) {
    if (b) {
      wx.showLoading({
        title: '加载中',
      });
      this.setData({
        isLoading: true
      });
    } else {
      wx.hideLoading();
      this.setData({
        isLoading: false
      });
    }
  },

  //* 用户点击右上角分享***************************
  onShareAppMessage: function() {}
})
// pages/market/shop/list.js
const data = require('../../../utils/data.js')

Page({
  data: {
    shopList: [],
  },

  // 跳转到店铺详情页面************************
  goToShop: function(event) {
    var index = event.currentTarget.dataset.id,
      shop = this.data.shopList[index];
    wx.setStorageSync('imgUrl_1', shop.img_path);
    wx.setStorageSync('imgUrl_2', shop.image_2);
    wx.setStorageSync('imgUrl_3', shop.image_3);
    wx.setStorageSync('imgUrl_4', shop.image_4);
    wx.setStorageSync('product', [shop.product_1, shop.product_2, shop.product_3, shop.product_4])
    wx.navigateTo({
      url: 'shop?remark=' + shop.remark + '&name=' + shop.shop_name + '&address=' + shop.shop_address
    })
  },

  // 设置shopList--------------------------------------------
  setShopList: function(res) {
    var data_ = res.data,
      len = data_.length;
    console.log("setShopList...res.data = ", data_);
    for (var i = 0; i < len; i++) {
      data_[i].index = i;
      if (data_[i].image_1.length > 10)
        data_[i].img_path = data_[i].image_1;
      else
        data_[i].img_path = "/imgs/image.png";
    }
    this.setData({
      shopList: data_
    });
  },

  //* 生命周期函数--监听页面加载***************************************
  onLoad: function(options) {
    wx.setStorageSync('gmt_modify', '9999-08-25 20:44:28');
    var param = {
      their_associate_code: "01", //主体。用户为“01”
      their_associate_type: "000",
      their_associate_number: "",
      their_associate_name: "",
      other_associate_code: "09", //所选的主体。店铺为“08”
      other_associate_type: "000",
      other_associate_number: "00000",
      other_associate_name: "",
    };
    data.getShopList(param, this.setShopList);
  },

  //* 生命周期函数--监听页面显示**********************************
  onShow: function() {
    //设置tabBar
    var myTabBar = getApp().globalData.tabBar,
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

  //* 用户点击右上角分享***************************
  onShareAppMessage: function() {

  }
})
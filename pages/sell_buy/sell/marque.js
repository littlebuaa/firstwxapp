//contact.js
//获取应用实例
const app = getApp()

Page({
  data: {
    showView : {
      "lv": false,
      "hermes": false,
      "gucci": false,
      "others": false
    },
    marque : null,
    product: null
  },
  onLoad: function () {
  },
  onClicChangeStatus: function () {
    var that = this;
    var arg = arguments[0].currentTarget.id;
    var thisShowView = {
      "lv": false,
      "hermes": false,
      "gucci": false,
      "others": false
    };
    thisShowView[arg] = !that.data.showView[arg];
    that.setData({
      showView : thisShowView,
      marque : arg
    })
  },

  go_to_chuhuoka: function () {
    this.setData({
      product: arguments[0].currentTarget.id
    })
    wx.navigateTo({
      url: 'sell_card/sell_card',
    })
  },

  go_to_lv_chuhuoka: function () {
    this.setData({
      product: arguments[0].currentTarget.id
    })
    wx.navigateTo({
      url: 'sell_card_lv_baokuan/sell_card_lv_baokuan',
    })
  },

  go_to_hermes_chuhuoka: function () {
    this.setData({
      product: arguments[0].currentTarget.id
    })
    wx.navigateTo({
      url: 'sell_card_hermes_baokuan/sell_card_hermes_baokuan',
    })
  },

})
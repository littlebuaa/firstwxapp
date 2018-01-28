//contact.js
//获取应用实例
const app = getApp()

Page({
  data: {
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    productList : [],
    itemData: null,
    startX:null,
    showView: false,
  },

  onLoad: function () {
    var that = this
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse){
      wx.getUserInfo({
        success:function (res) {
          that.setData({
            hasUserInfo: true,
            userInfo: res.userInfo
          })
        }
      })
      that.update()
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }

    that.setData({
      productList: wx.getStorageSync('productList')
    });
    console.log(that.data.productList)
  },

  getMyProductList:function () {
    this.setData({
      productList : wx.getStorageSync('productList')
    });
  },

  onClicChangeStatus: function () {
    var that = this;
    //var arg = arguments[0].currentTarget.id;
    console.log("detect long tap.");
    that.setData({
      showView: !that.data.showView,
    })
    wx.navigateTo({
      url: '../sell_buy/sell/sell_card',
    })
  },

  removeThisProduct: function (e) {
    var that = this;
    var arg = e.currentTarget.dataset.index;
    //var productList = wx.getStorageSync('productList')
    var bumai = '确认不卖'
    var productListTmp = that.data.productList
    bumai += productListTmp[arg].marque + "的" + productListTmp[arg].name + "了吗？" ;
    wx.showModal({
      title: '不卖了',
      content: bumai,
      success: function (res) {
        if (res.confirm) {
          productListTmp.splice(arg, 1)
          wx.setStorageSync('productList', productListTmp);
          wx.reLaunch({
            url: "contact"
          })
        }
      }
    })

  },
})

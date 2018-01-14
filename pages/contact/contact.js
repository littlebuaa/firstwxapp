//contact.js
//获取应用实例
const app = getApp()

Page({
  data: {
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    productList : []
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
    console.log("in contact")
    console.log(that.data.productList)
  },

  getMyProductList:function () {
    this.setData({
      productList : wx.getStorageSync('productList')
    });
  }
})

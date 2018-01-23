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

  touchS: function (e) {  // touchstart
    let start_X = app.Touches.getClientX(e)
    start_X && this.setData({ startX :start_X })
    console.log(this.data)
    console.log("+++++++++++++++++++++++++")
  },
  touchM: function (e) {  // touchmove
    let itemData = app.Touches.touchM(e, this.data.productList, this.data.startX)
    itemData && this.setData({ productList:itemData })

  },
  touchE: function (e) {  // touchend
    const width = 150  // 定义操作列表宽度
    let itemData = app.Touches.touchE(e, this.data.productList, this.data.startX, width)
    itemData && this.setData({ productList: itemData })
  },

  itemDelete: function (e) {  // itemDelete
    let itemData = app.Touches.deleteItem(e, this.data.productList)
    itemData && this.setData({ productList: itemData })
  },

  getMyProductList:function () {
    this.setData({
      productList : wx.getStorageSync('productList')
    });
  }
})

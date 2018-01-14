//contact.js
//获取应用实例
const app = getApp()

Page({
  data: {
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    inputVal: '',
    savePath: '',
    imgData: [],
  },

  onLoad: function () {
    var that = this
    //getUserInfo
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse) {
        wx.getUserInfo({
          success: function (res) {
            that.setData({
              hasUserInfo: true,
              userInfo: res.userInfo
            })
          }
        })
        that.update()
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
    wx.setStorageSync('userInfo', that.data.userInfo);
  },

  go_sell : function() {
    wx.navigateTo({
      url: 'sell/marque',
    })
  },

  go_buy: function () {
    wx.navigateTo({
      url: 'buy/marque',
    })
  },

  
})

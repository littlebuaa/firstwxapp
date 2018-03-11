//contact.js
//获取应用实例
const app = getApp()
const AV = require('../../utils/av-weapp-min.js');

Page({
  data: {
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    productList : []
  },
  onLoad: function () {
    var that = this
    AV.User.loginWithWeapp().then(user => {
      this.globalData.user = user.toJSON();
    }).catch(console.error);

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
    
    // 假设已经通过 AV.User.loginWithWeapp() 登录
    // 获得当前登录用户
    const user = AV.User.current();
    // 调用小程序 API，得到用户信息
    wx.getUserInfo({
      success: ({ userInfo }) => {
        // 更新当前用户的信息
        user.set(userInfo).save().then(user => {
          // 成功，此时可在控制台中看到更新后的用户信息
          that.globalData.user = user.toJSON();
        }).catch(console.error);
      }
    });
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
    wx.setStorageSync('productList', this.data.productList);
  },

  getMyProductList:function () {
    this.setData({
      productList : wx.getStorageSync('productList')
    });
  }
})

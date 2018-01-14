//app.js
App({
  onLaunch: function () {
    //save list to check
    var my_list = wx.getStorageSync('my_list') || []
    if(my_list.length == 0) {
      my_list = {
        "M41346": "小水桶",
        "M41465": "新邮差",
        "M43125": "one handle",          
        "M41562": "小书包",
        "M47542": "洗漱袋",
        "M40780": "邮差",
        "M61276": "三合一",
        "M61252": "nano speedy"
        //"M44022": "粉桶"
      },
      wx.setStorageSync('my_list', my_list)
    }
    else {
      //console.log(my_list)
    }
    var sell_list = wx.getStorageSync('sell_list') || []

    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      }
    })
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo
              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
  },
  globalData: {
    userInfo: null,
    productList: []
  }
})
//contact.js
//获取应用实例
const app = getApp()
const AV = require('../../utils/av-weapp-min.js');

Page({
  data: {
    userInfo: {},
    userId:null,
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    productList : [],
    itemData: null,
    startX:null,
    showView: false,
  },

  onLoad: function () {
    var that = this
    AV.User.loginWithWeapp().then(user => {
      app.globalData.userInfo = user.toJSON();
      that.setData({
        userId: user.toJSON().authData.lc_weapp.openid
      })
      console.log(that.data.userId)
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
    //console.log(that.data.productList)
  },
  /*
  login: function () {
    return AV.Promise.resolve(AV.User.current()).then(user =>
      user ? (user.isAuthenticated().then(authed => authed ? user : null)) : null
    ).then(user => user ? user : AV.User.loginWithWeapp()).catch(error => consolo.error(error.message));
  },*/
  
  fetchProducts: function () {
    var that = this;
    //console.log(this.data.userId);
    var query = new AV.Query("product")
      .equalTo('userId', this.data.userId)
      .descending('createdAt');
    query.find().then(function(result) { 
      var productListTmp = {};
      for(var i=0; i<result.length; i++) {
          productListTmp[i] = (result[i].attributes)
      }
      wx.setStorageSync('productList', productListTmp);
      that.setData({
        productList: wx.getStorageSync('productList')
      });
      //console.log(that.data.productList)
      wx.reLaunch({
        url: "contact"
      })
    })
  },

  getMyProductList:function () {
    this.setData({
      productList : wx.getStorageSync('productList')
    });

  },
  onShow:function() {
    this.getMyProductList();
    /*
    var mquery = new AV.Query('product');
    //.descending('createdAt')
    mquery.get("5a5ccbb90b6160006f78a086").then(
      todos => that.setData({ productList: todos.get("name") })
    )
      .catch(console.error);*/
  },

  onClicChangeStatus: function () {
    var that = this;
    //var arg = arguments[0].currentTarget.id;
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
          delete productListTmp[arg]
          //productListTmp.splice(arg, 1)
          wx.setStorageSync('productList', productListTmp);
          //TODO 03/20/2018 remove also in database
          wx.reLaunch({
            url: "contact"
          })
        }
      }
    })
  },
})

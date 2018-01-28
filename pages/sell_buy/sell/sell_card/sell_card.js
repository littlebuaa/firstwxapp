//contact.js
//获取应用实例
const app = getApp();
const AV = require('../../../../utils/av-weapp-min.js');

Page({
  data: {
    whereStatus: {
      'EUROPE' : '欧洲' ,
      'zaiTu' : '国现在途',
      'guoXian': '国现' ,
      'others' : '其他' ,
    },
    marque: null,
    product: null,
    product_name: null,
    product_quan:null,
    product_posi:{'name' : "noPos", 'checked' : 'false'},
    product_dscr:null,
    user:null,
    productListTemp : [],
    imagePath_0 : null
  },
  radioChange: function (e) {
    console.log(e.detail.value)
    this.setData({
        product_posi: e.detail.value
    })
  },
  onLoad: function () {
    var that = this
    var pages = getCurrentPages();
    // load marque from previous page
    var marquePage = pages[pages.length - 2];
    console.log(marquePage.data)
    if(marquePage.data.marque) {
      that.setData({
        marque : marquePage.data.marque,
        product: marquePage.data.product,
        user: pages[pages.length - 3].data.userInfo,
      });
    }
    else {
      console.log(marquePage.data.productList[0].name)
      console.log(marquePage.data.productList[0].quan)
      console.log(marquePage.data.productList[0].posi)
      console.log(marquePage.data.productList[0].dscr)
      that.setData({
        product_name: marquePage.data.productList[0].name,
        product_quan: marquePage.data.productList[0].quan,
        product_posi: ({name: marquePage.data.productList[0].posi, checked: 'true'}),
        product_dscr: marquePage.data.productList[0].dscr,
      });

    }

    var mquery = new AV.Query('client');
    //.descending('createdAt')
    mquery.get("5a5ccbb90b6160006f78a086").then(
      todos => that.setData({ product_dscr: todos.get("name") })
    )
    .catch(console.error);
  },

  nameInput: function (e) {
    this.setData({
      product_name : e.detail.value
    })
  },
  quanInput: function (e) {
    this.setData({
      product_quan : e.detail.value
    })
  },
  dscrInput: function (e) {
    this.setData({
      product_dscr : e.detail.value
    })
  },

  draw_images: function () {
    const self = this;
    const ctx = wx.createCanvasContext('myCanvas');
    var new_index = 0;
    console.log("drawing images");
    var img_path = self.data.imgData;
    var imgDataSize = Object.keys(img_path).length;
    console.log(imgDataSize);
    for (var i = 0; i < imgDataSize; i++) {
      console.log(img_path[i]);
      ctx.drawImage(img_path[i], 0, new_index, 80, 80);
      new_index += 75;
    }
    ctx.draw();
    ctx.save();
    wx.canvasToTempFilePath({
      canvasId: 'myCanvas',
      success: function success(res) {
        wx.saveFile({
          tempFilePath: res.tempFilePath,
          success: function success(res) {
            self.setData({
              savePath: res.savedFilePath,
            });
          }
        });
      }
    });
  },

  /*
  share_images: function (event) {
    var img = this.data.savePath;
    wx.previewImage({
      current: img, // 当前显示图片的http链接
      urls: [img] // 需要预览的图片http链接列表
    })
  },*/

  add_image: function (event) {
    const self = this;
    var img_paths = self.data.imgData;
    const ctx = wx.createCanvasContext('myCanvas');
    wx.chooseImage({
      sizeType: 'compressed',
      success: function (res) {
        console.log(res.tempFilePaths[0]);
        console.log("added item.");
        ctx.drawImage(res.tempFilePaths[0], 0, 0, 80, 80,"aspectFill");
        ctx.draw();
        ctx.save();
        //new_index += 75;
        self.setData({
          imagePath_0 : res.tempFilePaths[0]
        })
      }
    })
  },

  onReady: function () {
    new AV.Query('client')
      //.descending('createdAt')
      .find()
      .then(todos => this.setData({ clientName: todos.name }))
      .catch(console.error);
  },

  onSubmit: function() {
    var that = this;
    that.setData({
      productListTemp : wx.getStorageSync('productList')
    });
    var oneProduct = {
      "marque": that.data.marque,
      "product": that.data.product,
      "name": that.data.product_name,
      "quan": that.data.product_quan,
      "posi": that.data.product_posi,
      "dscr": that.data.product_dscr,
      "imagePath_0" : that.data.imagePath_0,
      "status" : "正在审核"
    };
    var tmp = [];
    tmp.push(oneProduct);
    for(var p in that.data.productListTemp) {
      tmp.push(that.data.productListTemp[p])  
      console.log(that.data.productListTemp[p])
    }
    that.setData({
      productListTemp: tmp
    });
    console.log(that.data.productListTemp);

    wx.showModal({
      title: '恭喜，递交成功！',
      content: '小询会尽快审核，请在个人页面查看审核进度',
      success: function (res) {
        if (res.confirm) {
          wx.setStorageSync('productList', that.data.productListTemp);
          //app.globalData.productList = productListTemp;
          wx.switchTab({
            url: '../../../sell_buy/sell_buy',
          })
        }
      }
    })

  },
})
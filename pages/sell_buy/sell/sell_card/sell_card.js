//contact.js
//获取应用实例
const app = getApp()

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
    product_posi:null,
    product_dscr:null,
    user:null,
    productListTemp : []
  },
  radioChange: function (e) {
    //console.log('radio发生change事件，携带value值为：', e.detail.value)
    this.setData({
        product_posi : e.detail.value
    })
  },
  onLoad: function () {
    var that = this
    var pages = getCurrentPages();
    // load marque from previous page
    var marquePage = pages[pages.length - 2];
    that.setData({
      marque : marquePage.data.marque,
      product: marquePage.data.product,
      user: pages[pages.length - 3].data.userInfo
    })
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
      ctx.drawImage(img_path[i], 0, new_index, 50, 50);
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

  share_images: function (event) {
    var img = this.data.savePath;

    wx.previewImage({
      current: img, // 当前显示图片的http链接
      urls: [img] // 需要预览的图片http链接列表
    })
  },

  add_item: function (event) {
    const self = this;
    var img_paths = self.data.imgData;
    wx.chooseImage({
      sizeType: 'compressed',
      success: function (res) {
        console.log(res.tempFilePaths[0]);
        console.log("added item.");
        img_paths.push(res.tempFilePaths[0]);
        //ctx.drawImage(res.tempFilePaths[0], new_index, 0, 50, 50);
        //ctx.draw();
        //ctx.save();
        //new_index += 75;
        self.setData({
          imgData: img_paths
        })
      }
    })
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
      "status" : "正在审核"
    };
    var tmp = [];
    //tmp = that.data.productListTemp;
    tmp.push(oneProduct);
    for(var p in that.data.productListTemp) {
      tmp.push(that.data.productListTemp[p])  
      console.log(that.data.productListTemp[p])
    }
    that.setData({
      productListTemp: tmp
    });
    console.log(that.data.productListTemp);

    //check info complete
    /*
    wx.request({
    url:"https://docs.google.com/forms/u/1/d/e/1FAIpQLSefeta1osrEl5mbKMr5Bmc3k_ObsgSPnA2iWQvc2r3swiPGeQ/formRespon",
      method: "POST",
      data: {
        2125259858: that.data.user.nickName,
        797949404 : that.data.marque,
        1235897830 : that.data.product,
        1961996089: that.data.product_name,
        879913023:  that.data.product_quan,
        2051235908: that.data.product_posi,
        1824813838: that.data.product_dscr
      },
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        console.log(res);
      }
    });*/
    wx.showModal({
      title: '恭喜，递交成功！',
      content: '小询会尽快审核，请在个人页面查看审核进度',
      success: function (res) {
        if (res.confirm) {
          wx.switchTab({
            url: '../../../sell_buy/sell_buy',
          })
          wx.setStorageSync('productList', that.data.productListTemp)
          //app.globalData.productList = productListTemp;
          console.log('用户点击确定')
        } else {
          console.log('用户点击取消')
        }
      }
    })
  }
})
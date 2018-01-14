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
    imgData: []
  },

  onLoad: function () {
  },

  draw_images: function () {
    const self = this;
    const ctx = wx.createCanvasContext('myCanvas');
    var new_index = 0;
    console.log("drawing images");
    var img_path = self.data.imgData;
    var imgDataSize = Object.keys(img_path).length;
    console.log(imgDataSize);
    for (var i = 0; i < imgDataSize ; i++) {
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

  share_images : function (event) {
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
  }
})

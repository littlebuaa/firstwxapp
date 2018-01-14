//logs.js
//const util = require('../../check_stock/check_stock.js')

Page({
  data: {
    motto: 'test check stock.',
    trace_result : [],
    m_name : [],
    check_finish: false,
    new_m_name : {}
  },

  bagInput: function (e) {
    this.data.new_m_name = e.detail.value;
  },

  addBag: function (e) {
    const self = this;
    var m_name = self.data.m_name;
    var new_m_name = self.data.new_m_name;
    if (m_name.hasOwnProperty(new_m_name)) {
      console.log("already has this item")
    }
    else if ( (new_m_name[0] == "M" || new_m_name[0] == "m") && new_m_name.length == 6) {
      m_name[new_m_name] = new_m_name;
      console.log(m_name)
    }
    else {
      console.log("not valid name")
    }
  },

  onLoad: function () {
    this.setData({
      m_name: wx.getStorageSync('my_list')
    })
    const self = this;
    var m_name = self.data.m_name;
    var list_size = Object.keys(m_name).length;
    var res_list = [];
    for (var key in m_name) {
      var temp_bag = key;
      wx.request({
        url: "https://secure.louisvuitton.com/ajaxsecure/getStockLevel.jsp",
        method: "GET",
        data: {
          storeLang: 'fra-fr',
          pageType: 'product',
          skuIdList: key
        },
        header: {
          'content-type': 'application/json'
        },
        success: function (res) {
          //console.log(key);
          var result_stock = Object.keys(res.data)[1];
          var result_string = [];
          result_string[0] = m_name[result_stock];
          result_string[1] = res.data[result_stock].inStock;
          res_list.push(result_string);
          if (res_list.length == list_size) {
            self.setData({
              trace_result: res_list,
              check_finish: true
            })
          }
        }
      });
    }
    wx.setStorageSync('my_list', m_name);
  },
  refresh: function (event) {
      this.setData({
        check_finish : false
      })
      const self = this;
      var m_name = self.data.m_name;
      var list_size = Object.keys(m_name).length;
      var res_list = [];
      for (var key in m_name) {
        var temp_bag = key;
        wx.request({
          url: "https://secure.louisvuitton.com/ajaxsecure/getStockLevel.jsp",
          method: "GET",
          data: {
            storeLang: 'fra-fr',
            pageType: 'product',
            skuIdList: key
          },
          header: {
            'content-type': 'application/json'
          },
          success: function (res) {
            //console.log(key);
            var result_stock = Object.keys(res.data)[1];
            var result_string =[];
            result_string[0] = m_name[result_stock];
            result_string[1] = res.data[result_stock].inStock;
            res_list.push(result_string);
            console.log(res_list.length);
            console.log(list_size);
            if (res_list.length == list_size) {
              self.setData({
                trace_result: res_list,
                check_finish: true
              })
            }
          }
        });
      }
      wx.setStorageSync('my_list', m_name);
    }
})

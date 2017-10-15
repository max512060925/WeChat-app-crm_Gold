// location.js
let strDateToStr_Gold = (str) => {
  let tempStrs = str.split(' '),
    dateStrs = tempStrs[0].split('/'),
    year = parseInt(dateStrs[2]),
    month = parseInt(dateStrs[1]),
    day = parseInt(dateStrs[0]),
    reStr = year + '年' + month + '月' + day + '日';
  return reStr;
};
let money = (m) => {
  let mon = m.toString().split('').reverse().join('').replace(/(\d{3}(?=\d)(?!\d+\.|$))/g, '$1,').split('').reverse().join('');
  return mon;
};
Page({

  /**
   * 页面的初始数据
   */
  data: {
    date: '',
    gold: '',
    language: getApp().globalData.language,
    chsArr: ['中国内地每日金价', '每克', '卖出', '换金价'],
    chtArr: ['香港每日金價', '每兩', '賣出', '換貨', '買入'],
    tabBarChs: [{
      mod: 'gold',
      name: '每日金价'
     },
     {
      mod: 'location',
      name: '门店'
    },
    {
      mod: 'vip',
      name:  '会员'
    }],
    tabBarCht: [{
      mod: 'gold',
      name: '每日金價'
    },
    {
      mod: 'location',
      name: '門店'
    },
    {
      mod: 'vip',
      name: '會員'
    }],
    current: 0
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (this.data.language === 'chs') {

    }
    let that = this;
    wx.showLoading({ title: 'loading...' });
    wx.request({
      url: 'https://wechat.chowsangsang.com/api/gold-prices',
      header: {
        'content-type': 'application/json',
        'Cookie': this.data.language === 'chs' || 'lng="2|1:0|10:1507995817|3:lng|4:emh0|a37c9b4c43d95443672436f17368d9dc915d56c674502960f6f7189b14115c52"'
      },
      success: function (res) {
        wx.hideLoading()
        let goldObj = {
          1: [],
          2: [],
          3: [],
          4: []
        }
        let dataArr = res.data.goldRates;
        if (that.data.language === 'chs') {
          dataArr.forEach(function (v, i) {
            if (v.type === 'G_JW_SELL') {
              goldObj[1].push(v.ptRate)
            }
            if (v.type === 'G_JW_EXCH') {
              goldObj[1].push(v.ptRate)
            }
            if (v.type === 'PT950_JW_SELL') {
              goldObj[2].push(v.ptRate)
            }
            if (v.type === 'PT950_JW_EXCH') {
              goldObj[2].push(v.ptRate)
            }
            if (v.type === 'G_BAR_SELL') {
              goldObj[3].push(v.ptRate)
            }
            if (v.type === '006') {
              goldObj[4].push(v.ptRate)
            }
          })
          that.setData({
            gold: [{
              "type": "足金饰品", "sell": `¥${money(goldObj[1][0])}`, "exch": `¥${money(goldObj[1][1])}`
            },
            {
              "type": "950铂金饰品", "sell": `¥${money(goldObj[2][0])}`, "exch": `¥${money(goldObj[2][1])}`
            },
            {
              "type": "金片", "sell": `¥${money(goldObj[3][0])}`, "exch": "-"
            },
            {
              "type": "生生金宝", "sell": `¥${money(goldObj[4][0])}`, "exch": "-"
            }],
            date: strDateToStr_Gold(res.data.goldRates[0].entryDate)
          })
        } else {
          dataArr.forEach(function (v, i) {
            if (v.type === 'G_JW_SELL') {
              goldObj[1].push(v.ptRate)
            }
            if (v.type == 'G_JW_BUY') {
              goldObj[1].push(v.ptRate)
            }
            if (v.type === 'G_JW_EXCH') {
              goldObj[1].push(v.ptRate)
            }
            if (v.type === 'G_BAR_SELL') {
              goldObj[2].push(v.ptRate)
            }
            if (v.type === 'G_BAR_BUY') {
              goldObj[2].push(v.ptRate)
            }
            if (v.type === 'PT950_JW_SELL') {
              goldObj[3].push(v.ptRate)
            }
            if (v.type === 'PT950_JW_BUY') {
              goldObj[3].push(v.ptRate)
            }
            if (v.type === 'PT_JW_SELL') {
              goldObj[4].push(v.ptRate)
            }
            if (v.type === 'PT_JW_BUY') {
              goldObj[4].push(v.ptRate)
            }
          })
          that.setData({
            gold: [{
              "type": "足金飾品", "sell": money(goldObj[1][0]), "buy": money(goldObj[1][1]), "exch": money(goldObj[1][2])
            },
            {
              "type": "足金金條", "sell": money(goldObj[2][0]), "buy": money(goldObj[2][1]), "exch": "-"
            },
            {
              "type": "鉑金飾品", "sell": money(goldObj[3][0]), "buy": money(goldObj[3][1]), "exch": "-"
            },
            {
              "type": "足鉑金飾品", "sell": money(goldObj[4][0]), "buy": money(goldObj[4][1]), "exch": "-"
            }],
            date: strDateToStr_Gold(res.data.goldRates[0].entryDate)
          })
        }
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    let language = getApp().globalData.language
    this.setData({
      language: getApp().globalData.language
    })
    this.onLoad()
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },
  changeLanguage() {
    if (this.data.language === 'chs') {
      this.setData({
        language: 'cht'
      })
      getApp().globalData.language = 'cht'
      wx.setStorage({
        key: "language",
        data: "cht"
      })
      this.onLoad()
    } else {
      this.setData({
        language: 'chs'
      })
      getApp().globalData.language = 'chs'
      wx.setStorage({
        key: "language",
        data: "chs"
      })
      this.onLoad()
    }
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})

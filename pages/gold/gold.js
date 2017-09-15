// location.js
let strDateToStr_Gold = (str)=> {
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
  return '¥'+mon;
};
Page({

  /**
   * 页面的初始数据
   */
  data: {
    date: '',
    gold: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    wx.showLoading({ title: '加载中' });
    wx.request({
      url: 'https://wechat.chowsangsang.com/api/gold-prices',
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        wx.hideLoading();
        let goldObj={
          1:[],
          2:[],
          3:[],
          4:[]
        }
        let dataArr=res.data.goldRates;
        dataArr.forEach(function(v,i){
          if(v.type === 'G_JW_SELL'){
            goldObj[1].push(v.ptRate)
          }
          if(v.type === 'G_JW_EXCH'){
            goldObj[1].push(v.ptRate)
          }
          if(v.type === 'PT950_JW_SELL'){
            goldObj[2].push(v.ptRate)
          }
          if(v.type === 'PT950_JW_EXCH'){
            goldObj[2].push(v.ptRate)
          }
          if(v.type === 'G_BAR_SELL'){
            goldObj[3].push(v.ptRate)
          }
          if(v.type === '006'){
            goldObj[4].push(v.ptRate)
          }
        })
        that.setData({
          gold: [{
            "type": "足金饰品", "sell": money(goldObj[1][0]), "exch": money(goldObj[1][1])
          },
          {
            "type": "950铂金饰品", "sell": money(goldObj[2][0]), "exch": money(goldObj[2][1])
          },
          {
            "type": "金片", "sell": money(goldObj[3][0]), "exch": "-"
          },
          {
            "type": "生生金宝", "sell": money(goldObj[4][0]), "exch": "-"
          }],
          date: strDateToStr_Gold(res.data.goldRates[0].entryDate)
        })
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

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})

//app.js
App({
  onLaunch: function() {
    if (wx.getStorageSync('language')){
      this.globalData.language = wx.getStorageSync('language')
    }else{
      wx.setStorage({
        key: "language",
        data: "chs"
      })
      this.globalData.language = 'chs'
    }
  },
  globalData: {
    language: 'chs'
  }
})

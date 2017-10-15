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
    language: 'chs',
    current: 0
  },
  currentPage(i){
    if (i !== this.globalData.current){
      this.globalData.current = i;
      switch (i) {
        case 0:
          wx.navigateTo({
            url: 'gold/gold'
          });
          break;
        case 1:
          wx.navigateTo({
            url: 'location/location'
          });
          break;
        case 2:
          wx.navigateTo({
            url: 'vip/vip'
          });
          break;
        default:
          break;
      }
    }
  }
})

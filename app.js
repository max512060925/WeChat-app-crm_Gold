//app.js
App({
  onLaunch: function() {
    // wx.login({
    //   success: function (res) {
    //     console.log(res)
    //     if (res.code) {
    //       //发起网络请求
    //       wx.request({
    //         url: 'https://api.weixin.qq.com/sns/jscode2session?appid=wxe76bd265a7345e89&secret=cd371ac240e5af9492cb0295954fcae9&js_code='+res.code+'&grant_type=authorization_code',
    //         data: {
    //           code: res.code
    //         }
    //       })
    //     } else {
    //       console.log('获取用户登录态失败！' + res.errMsg)
    //     }
    //   }
    // });
  },
  globalData: {
    userInfo: null
  }
})

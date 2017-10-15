// //index.js
//获取应用实例
const app = getApp();
import QQMapWX from '../../libs/qqmap-wx-jssdk.min.js';
import QR from '../../libs/qrcode.js';
let qqmapsdk;
let strToM= (s)=> {
  let str
  if (s >= 1000) {
    return str = Math.round((s / 1000) * 100) / 100 + 'km';
  } else if (s < 1000) {
    return str = Math.round(s * 100) / 100 + 'm';
  } else {
    return str = '>10km';
  }
}
Page({
  data: {
    language: getApp().globalData.language,
    chsArr: ['门店列表', '距离我', '確定', '关注分店微信号，即时在线咨询。','电话'],
    chtArr: ['門店列表', '距離我', '確定', '關註分店微信號，即時在線咨詢。', '電話'],
    animationData: {},
    citys: [],
    conts: [''],
    city: [''],
    cityO: '',
    cont: '',
    picker: true,
    val: '',
    locData: {},
    location: {
      latitude: '',
      longitude: ''
    },
    qrContainer: false,
    cityShow: [],
    qrName: '',
    qrTel: '',
    cover: true,
    shopImg: '',
    overflow: 'scroll'
  },
  onLoad: function () {
    wx.showLoading({ title: 'loading...' });
    let cityObj = '';
    let that = this;
    qqmapsdk = new QQMapWX({
      key: 'XSOBZ-NDQW4-ZSJUS-DMAHL-5SYTS-XZBRH'
    });
    wx.request({
      url: 'https://cssminabackend.oookini.com/v1/district',
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        let citysArr = [''];
        cityObj = res.data.data
        for (let k in res.data.data) {
          citysArr.push(k)
        };
        that.setData({
          citys: citysArr,
          cityO: cityObj
        });
        wx.getLocation({
          type: 'wgs84',
          success: function (res) {
            that.setData({
              location: {
                latitude: res.latitude,
                longitude: res.longitude
              }
            });
            qqmapsdk.reverseGeocoder({
              location: that.data.location,
              success: function (r) {
                for (let k in cityObj) {
                  for (let j in cityObj[k]) {
                    if (cityObj[k][j] === r.result.address_component.city) {
                      wx.request({
                        url: 'https://cssminabackend.oookini.com/v1/' + j + '/stores',
                        header: {
                          'content-type': 'application/json'
                        },
                        data: {
                          latitude: that.data.location.latitude,
                          longitude: that.data.location.longitude
                        },
                        success: function (resp) {
                          let resArr = resp.data.data;
                          console.log(resArr)
                          resArr.map(function (v, i) {
                            v.distance = strToM(v.distance)
                          })
                          console.log(resArr)
                          that.setData({
                            cont: r.result.address_component.city,
                            cityShow: resp.data.data
                          });
                          wx.hideLoading();
                        }
                      })
                      return;
                    }
                  }
                };
              }
            });
          },
          fail: function () {
            wx.request({
              url: 'https://cssminabackend.oookini.com/v1/35/stores',
              header: {
                'content-type': 'application/json'
              },
              success: function (resp) {
                var locM = [];
                console.log(resp)
                resp.data.data.map(function (v, i) {
                  v.distance = strToM(v.distance)
                })
                that.setData({
                  cont: '上海市',
                  cityShow: resp.data.data,
                });
                wx.hideLoading();
              }
            })
            wx.hideLoading();
          }
        });
      }
    })


  },
  onShow: function () {
    let language=getApp().globalData.language
    this.setData({
      language: getApp().globalData.language
    })
    this.onLoad()
  },
  bindChange: function (e) {
    const val = e.detail.value;
    this.data.val = e.detail.value;
    var contsArr = [];
    for (let k in this.data.cityO[this.data.citys[val[0]]]) {
      contsArr.push(this.data.cityO[this.data.citys[val[0]]][k])
    }
    this.setData({
      city: this.data.cityO[this.data.citys[val[1]]],
      conts: contsArr
    });
  },
  tap: function (e) {
    wx.showLoading({ title: 'loading...' });
    let animation = wx.createAnimation({
      duration: 1000,
      timingFunction: 'ease',
    })
    this.animation = animation
    animation.bottom(0).step()
    this.setData({
      animationData: animation.export(),
      cover: false,
      overflow: 'hidden'
    });
    wx.hideLoading();
  },
  cancle: function (e) {
    let animation = wx.createAnimation({
      duration: 1000,
      timingFunction: 'ease',
    })
    this.animation = animation
    animation.bottom('-40vh').step()
    this.setData({
      animationData: animation.export(),
      cover: true,
      overflow: 'scroll'
    })
  },
  confirm: function (e) {
    let animation = wx.createAnimation({
      duration: 1000,
      timingFunction: 'ease',
    })
    let that = this;
    this.animation = animation;
    animation.bottom('-40vh').step();
    this.setData({
      animationData: animation.export(),
      cont: this.data.conts[this.data.val[1]],
      cover: true,
      overflow: 'scroll'
    })
    let c = this.data.conts[this.data.val[1]];
    for (let k in this.data.cityO[this.data.citys[this.data.val[0]]]) {
      if (c === this.data.cityO[this.data.citys[this.data.val[0]]][k]) {
        wx.request({
          url: 'https://cssminabackend.oookini.com/v1/' + k + '/stores',
          header: {
            'content-type': 'application/json'
          },
          data: {
            latitude: that.data.location.latitude,
            longitude: that.data.location.longitude
          },
          success: function (resp) {
            let resArr = resp.data.data;
            resArr.map(function (v, i) {
              v.distance = strToM(v.distance)
            })
            that.setData({
              cityShow: resp.data.data
            });
            wx.hideLoading();
          }
        })
        return;
      }
    }
  },
  cityShowTap: function (e) {
    wx.showLoading({ title: 'loading...' });
    this.setData({
      qrContainer: true,
      qrName: e.currentTarget.dataset.name,
      qrTel: e.currentTarget.dataset.tel,
      shopImg: e.currentTarget.dataset.qr,
      overflow: 'hidden'
    });
  },
  imgLoad: function (e) {
    wx.hideLoading();
  },
  imgLoadErr: function (e) {
    // wx.hideLoading();
    this.setData({
      shopImg: '../../img/qrcode.jpg'
    });
  },
  closeTap: function (e) {
    this.setData({
      qrContainer: false,
      overflow: 'scroll'
    })
  },
  phoneCall: function (e) {
    wx.makePhoneCall({
      phoneNumber: e.currentTarget.dataset.phonecall.replace(/\-/gi, "")
    })
  }
})

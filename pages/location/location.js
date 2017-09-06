// //index.js
//获取应用实例
const app = getApp();
const QQMapWX = require('../../libs/qqmap-wx-jssdk.min.js');
const QR = require('../../libs/qrcode.js');
var qqmapsdk;
var qqmapsdk1;
var qqmapsdk2;
var qqmapsdk3;
var qqmapsdk4;
function strToM(s){
  let str
  if (s>=1000){
    str = Math.round((s / 1000)*100)/100+ 'km';
  }else{
    str = Math.round(s*100)/100+ 'm';
  }
  return str
}
Page({
  data: {
    animationData: {},
    citys: [],
    conts: [''],
    city: [''],
    cityO:'',
    cont: '',
    picker: true,
    val: '',
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
    overflow:'scroll'
  },
  onLoad: function () {
    wx.showLoading({ title: '加载中' });
    let cityObj='';
    var that=this;
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
      }
    })
    qqmapsdk = new QQMapWX({
      key: 'XSOBZ-NDQW4-ZSJUS-DMAHL-5SYTS-XZBRH'
    });
    qqmapsdk1 = new QQMapWX({
      key: 'V6QBZ-2EXW4-REOUZ-DYGQQ-K2R7T-NHF6C'
    });
    qqmapsdk2 = new QQMapWX({
      key: '5MOBZ-QV7WF-GWWJX-NIN4Y-GZQIO-N7FCF'
    });
    qqmapsdk3 = new QQMapWX({
      key: 'EEYBZ-QI3K4-OUGUX-X5W7Y-ZS7H7-DBFJ4'
    });
    qqmapsdk4 = new QQMapWX({
      key: 'JQYBZ-4S4K3-MSG36-3TKLE-7UAEE-RJFOS'
    });
    var that = this;
    let locationArr = {};
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
            let id=''
            for (let k in cityObj) {
              for (let j in cityObj[k]){
                if (cityObj[k][j] === r.result.address_component.city) {
                  id=j
                }
              }
            };
            
            wx.request({
              url: 'https://cssminabackend.oookini.com/v1/' + id+'/stores',
              header: {
                'content-type': 'application/json'
              },
              success: function (resp) {             
                for (let i = 0; i < resp.data.data.length;i++){
                  if(i%5==1){
                    qqmapsdk.calculateDistance({
                      to: resp.data.data[i].latitude + ',' + resp.data.data[i].longitude,
                      success: function (p) {
                        let k = i + 1
                        locationArr[k] = p.result.elements[0].distance, p
                      }
                    })
                  } else if (i % 5 == 2){
                    qqmapsdk1.calculateDistance({
                      to: resp.data.data[i].latitude + ',' + resp.data.data[i].longitude,
                      success: function (p) {
                        let k = i + 1
                        locationArr[k] = p.result.elements[0].distance, p
                      }
                    })
                  } else if (i % 5 == 3) {
                    qqmapsdk2.calculateDistance({
                      to: resp.data.data[i].latitude + ',' + resp.data.data[i].longitude + ';',
                      success: function (p) {
                        let k = i + 1
                        locationArr[k] = p.result.elements[0].distance, p
                      }
                    })
                  } else if (i % 5 == 4) {
                    qqmapsdk3.calculateDistance({
                      to: resp.data.data[i].latitude + ',' + resp.data.data[i].longitude + ';',
                      success: function (p) {
                        let k = i + 1
                        locationArr[k] = p.result.elements[0].distance, p
                      }
                    })
                  } else if (i % 5 == 0) {
                    qqmapsdk4.calculateDistance({
                      to: resp.data.data[i].latitude + ',' + resp.data.data[i].longitude + ';',
                      success: function (p) {
                        let k = i + 1
                        locationArr[k] = p.result.elements[0].distance, p
                      }
                    })
                  }
                  console.log(locationArr)
                }
                console.log(resp.data.data, locationArr)
                let newCityObj = resp.data.data;
                let O={};
                console.log(locationArr['2'])

                for (let m in locationArr){
                  console.log(1)
                  // for (let h in newCityObj){
                  //   console.log(k,h)
                  //   // if(k==h){
                  //   //   newCityObj[h]['range'] = locationArr[k]
                  //   // }
                  // }
                }
                console.log(newCityObj)
                function sortNumber(a, b) {
                  return a['range'] - b['range']
                }
                newCityObj=newCityObj.sort(sortNumber)
                console.log(newCityObj)
                that.setData({
                  cont: r.result.address_component.city,
                  cityShow: newCityObj
                });
              }
            })
            wx.hideLoading();
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
            console.log(resp.data)
            that.setData({
              cont: '上海市',
              cityShow: resp.data.data
            });
          }
        })
        wx.hideLoading();
      }
    });
    



  },
  onShow: function () {
    var that = this;
    // 调用接口

  },
  bindChange: function (e) {
    const val = e.detail.value;
    this.data.val = e.detail.value;
    var contsArr = [];
    for (let k in this.data.cityO[this.data.citys[val[0]]]) {
      console.log(this.data.cityO[this.data.citys[val[0]]][k])
      contsArr.push(this.data.cityO[this.data.citys[val[0]]][k])
      console.log(contsArr)
    }
    this.setData({
      city: this.data.cityO[this.data.citys[val[0]]],
      conts: contsArr
    });
  },
  tap: function (e) {
    wx.showLoading({ title: '加载中' });
    var animation = wx.createAnimation({
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
    var animation = wx.createAnimation({
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
    var animation = wx.createAnimation({
      duration: 1000,
      timingFunction: 'ease',
    })
    this.animation = animation;
    animation.bottom('-40vh').step();
    let c = this.data.conts[this.data.val[1]];
    let id='';
    console.log(c, this.data.cityO[this.data.citys[this.data.val[0]]])
    for (let k in this.data.cityO[this.data.citys[this.data.val[0]]]){
      if (c === this.data.cityO[this.data.citys[this.data.val[0]]][k]){
        id=k
      }
    }
    this.setData({
      animationData: animation.export(),
      cont: this.data.conts[this.data.val[1]],
      cover: true,
      overflow: 'scroll'
    })
    var that=this;
    wx.request({
      url: 'https://cssminabackend.oookini.com/v1/' + id + '/stores',
      header: {
        'content-type': 'application/json'
      },
      success: function (resp) {
        that.setData({
          cityShow: resp.data.data
        });
        let locationArr = [];
        let str = ''
        for (let i = 0; i < resp.data.data.length; i++) {
          console.log(i);
          qqmapsdk.calculateDistance({
            to: that.data.cityShow[i].latitude + ',' + that.data.cityShow[i].longitude + ';',
            success: function (p) {
              console.log(p)
            }
          })
        }
      }
    })
  },
  cityShowTap: function (e) {
    wx.showLoading({ title: '加载中' });
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
  imgLoadErr:function(e){
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

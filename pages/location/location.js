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
var by = function (name) {
  return function(o,p) {
    var a, b;
    if(typeof o === "object" && typeof p === "object" && o && p) {
      a= o[name];
      b= p[name];
      console.log(a,b)
      if(a === b) {
        return 0;
      }
      if(typeof a === typeof b) {
        return a < b ? -1 : 1;
      }
      return typeof a < typeof b ? -1 : 1;
    }else {
      throw ("error");
    }
  }
}
function strToM(s){
  let str
  if (s>=1000){
    str = Math.round((s / 1000)*100)/100+ 'km';
  }else if(s<1000){
    str = Math.round(s*100)/100+ 'm';
  }else{
    str='>10km';
  }
  return str
}
var newCityObj = {};
var s1;
var s2;
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
    locData:{},
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
    console.log(this,)
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
                var id = '';
                for (let k in cityObj) {
                  for (let j in cityObj[k]) {
                    if (cityObj[k][j] === r.result.address_component.city) {
                      id = j;
                    }
                  }
                };
                console.log(id);
                wx.request({
                  url: 'https://cssminabackend.oookini.com/v1/' + id + '/stores',
                  header: {
                    'content-type': 'application/json'
                  },
                  success: function (resp) {
                    console.log(resp)
                    newCityObj = {};
                    newCityObj = resp.data.data;
                    let j=-1;
                    s1=setInterval(function(){
                      j++;
                      if (j >resp.data.data.length) {
                        clearInterval(s1)
                      }else{
                        qqmapsdk.calculateDistance({
                          to: resp.data.data[j].latitude + ',' + resp.data.data[j].longitude,
                          success: function (p) {
                            console.log(p,j)
                            if (p.result.elements[0].distance) {
                              newCityObj[j]['locM'] = strToM(p.result.elements[0].distance)
                            } else {
                              newCityObj[j]['locM'] = '>10km';
                            }
                            // newCityObj.sort(by('locM'))
                            that.setData({
                              cont: r.result.address_component.city,
                              cityShow: newCityObj
                            });
                            wx.hideLoading();
                          },
                          fail:function(){
                            newCityObj[j]['locM'] = '>10km';
                            // newCityObj.sort(by('locM'))
                            that.setData({
                              cont: r.result.address_component.city,
                              cityShow: newCityObj
                            });
                          }
                        })
                      }
                    },350)
                  }
                })

                
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
      }
    })
    
    
    
    



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
      city: this.data.cityO[this.data.citys[val[1]]],
      conts: contsArr
    });
  },
  tap: function (e) {
    wx.showLoading({ title: '加载中' });
    clearInterval(s1);
    clearInterval(s2);
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
    var id2='';
    console.log(c, this.data.cityO[this.data.citys[this.data.val[0]]])
    for (let k in this.data.cityO[this.data.citys[this.data.val[0]]]){
      if (c === this.data.cityO[this.data.citys[this.data.val[0]]][k]){
        id2=k
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
      url: 'https://cssminabackend.oookini.com/v1/' + id2 + '/stores',
      header: {
        'content-type': 'application/json'
      },
      success: function (resp) {
        console.log(resp)
        newCityObj = {};
        newCityObj = resp.data.data;
        let j = -1;
        s2 = setInterval(function () {
          j++;
          if (j > resp.data.data.length) {
            clearInterval(s2)
          } else {
            qqmapsdk.calculateDistance({
              to: resp.data.data[j].latitude + ',' + resp.data.data[j].longitude,
              success: function (p) {
                console.log(p, j)
                if (p.result.elements[0].distance) {
                  newCityObj[j]['locM'] = strToM(p.result.elements[0].distance)
                } else {
                  newCityObj[j]['locM'] = '>10km';
                }
                // newCityObj.sort(by('locM'))
                that.setData({
                  cityShow: newCityObj
                });
                wx.hideLoading();
              },
              fail: function () {
                newCityObj[j]['locM'] = '>10km';
                // newCityObj.sort(by('locM'))
                that.setData({
                  cityShow: newCityObj
                });
              }
            })
          }
        }, 350)
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

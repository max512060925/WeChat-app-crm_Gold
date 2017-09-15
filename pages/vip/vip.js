// vip.js
import QR from '../../libs/qrcode.js';
let s;
let nimaTW = (a, b)=> {
  if (a == '+886') {
    if (b.length == 9) {
      return true;
    } else if (b.length == 10) {
      if (/^0\d{9}$/.test(b)) {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  } else {
    return true;
  }
};
let money = (m)=> {
  let mon = m.toString().split('').reverse().join('').replace(/(\d{3}(?=\d)(?!\d+\.|$))/g, '$1,').split('').reverse().join('');
  return mon;
};
let strDateToStr = (str)=> {
  let tempStrs = str.split(' '),
    dateStrs = tempStrs[0].split('-'),
    year = parseInt(dateStrs[0]),
    month = parseInt(dateStrs[1]),
    day = parseInt(dateStrs[2]),
    reStr = year + '年' + month + '月' + day + '日';
  return reStr;
};
let round =(val, that)=> {
  let animation = wx.createAnimation({
    timingFunction: 'linear'
  });
  let r = (val / 10000), b = 357.8;
  let deg = r * b;
  that.animation = animation;
  if (r > 0.5) {
    animation.rotate(180).step({ transformOrigin: '100% 50%', duration: (180 * (2000 / deg)) });
    that.setData({
      animationData: animation.export(),
      r1: 3,
      r2: 1,
      r3: 4,
      r4: 2
    });
    setTimeout(function () {
      animation.rotate(deg).step({ transformOrigin: '100% 50%', duration: ((deg - 180) * (2000 / deg)) });
      that.setData({
        animationData: animation.export(),
        r1: 4,
        r2: 2,
        r3: 3,
        r4: 0
      });
    }.bind(this), (180 * (2000 / deg)));
  } else {
    animation.rotate(deg + 1.1).step({ transformOrigin: '100% 50%', duration: (2000) });
    that.setData({
      animationData: animation.export(),
      r1: 3,
      r2: 1,
      r3: 4,
      r4: 2
    });
  }
}
Page({
  data: {
    animationData: {},
    r1: 0,
    r2: 0,
    r3: 1,
    r4: 1,
    change: "邮箱登录",
    telArr: ['+86', '+852', '+853', '+886', '+1', '+7', '+20', '+27', '+30', '+31', '+32', '+33', '+34', '+36', '+39', '+40', '+41', '+43', '+44', '+45', '+46', '+47', '+48', '+49', '+51', '+52', '+53', '+54', '+55', '+56', '+57', '+58', '+60', '+61', '+62', '+63', '+64', '+65', '+66', '+81', '+82', '+84', '+86', '+90', '+91', '+92', '+93', '+94', '+95', '+98', '+212', '+213', '+216', '+218', '+220', '+221', '+223', '+224', '+225', '+226', '+227', '+228', '+229', '+230', '+231', '+232', '+233', '+234', '+235', '+236', '+237', '+239', '+241', '+242', '+243', '+244', '+247', '+248', '+249', '+250', '+251', '+252', '+253', '+254', '+255', '+256', '+257', '+258', '+260', '+261', '+262', '+263', '+264', '+265', '+266', '+267', '+268', '+269', '+331', '+350', '+351', '+352', '+353', '+354', '+355', '+356', '+357', '+358', '+359', '+370', '+371', '+372', '+373', '+374', '+375', '+376', '+377', '+378', '+380', '+381', '+386', '+420', '+421', '+423', '+501', '+502', '+503', '+504', '+505', '+506', '+507', '+509', '+591', '+592', '+593', '+594', '+595', '+596', '+597', '+598', '+599', '+673', '+674', '+675', '+676', '+677', '+678', '+679', '+682', '+684', '+685', '+689', '+850', '+855', '+856', '+880', '+960', '+961', '+962', '+963', '+964', '+965', '+966', '+967', '+968', '+971', '+972', '+973', '+974', '+976', '+977', '+992', '+993', '+994', '+995', '+1242', '+1246', '+1264', '+1268', '+1345', '+1441', '+1664', '+1670', '+1671', '+1758', '+1784', '+1787', '+1809', '+1876', '+1890'],
    index: 0,
    mail: false,
    phone: true,
    phoneVal: '',
    mailVal: '',
    passVal: '',
    telAdd: '+86',
    msg: '',
    login: true,
    user: false,
    name: '',
    lv: '',
    vipNum: '',
    vipDate: '',
    money: '',
    c_t_1: '',
    c_t_2: '',
    c_t_3: '',
    src: '',
    qrContainer: false,
    minutes: '',
    seconds: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {


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
    var that = this;
    wx.getUserInfo({
      success: function (re) {
        that.setData({
          src: re.userInfo.avatarUrl
        })
      }
    });
    var that = this;
    if (wx.getStorageSync('cookie')) {
      this.setData({
        login: false,
        user: true
      });
      wx.showLoading({ title: '加载中' });
      wx.request({
        url: 'https://wechat.chowsangsang.com/api/customers', //仅为示例，并非真实的接口地址
        method: 'get',
        header: {
          'content-type': 'application/json',
          'cookie': wx.getStorageSync('cookie')
        },
        success: function (r) {
          that.setData({
            name: r.data.familyName + (/^[a-zA-Z]/.test(r.data.firstName) ? ' ' + r.data.firstName : r.data.firstName),
            vipNum: r.data.id,
            vipDate: r.data.expiredDate ? strDateToStr(r.data.expiredDate) : '-',
            msg: '',
            login: false,
            user: true
          });
          wx.request({
            url: 'https://wechat.chowsangsang.com/api/customers/stardollar-balances', //仅为示例，并非真实的接口地址
            method: 'get',
            header: {
              'content-type': 'application/json',
              'cookie': wx.getStorageSync('cookie')
            },
            success: function (d) {
              wx.hideLoading();
              if (typeof d.data[0].usableStarDollarAmount == "undefined") {
                  that.setData({
                    money: '0'
                  })
                } else {
                  that.setData({
                    money: money(d.data[0].usableStarDollarAmount)
                  })
                }
              if ((r.data.memberClass == 'A8') || (r.data.memberClass == '01') || (r.data.memberClass == 'A1')) {
                round(10000, that);
                that.setData({
                  lv: '尊尚会员',
                  c_t_1: '我的悦享钱',
                  c_t_2: that.data.money,
                  c_t_3: ''
                })
              }
              else if (r.data.memberClass == 'AA') {
                wx.showLoading({ title: '加载中' });
                wx.request({
                  url: 'https://wechat.chowsangsang.com/api/customers/nextClassRemainAmounts', //仅为示例，并非真实的接口地址
                  method: 'get',
                  header: {
                    'content-type': 'application/json',
                    'cookie': wx.getStorageSync('cookie')
                  },
                  success: function (dd) {
                    wx.hideLoading();
                    round((10000 - dd.data.amount), that);
                    that.setData({
                      lv: '高级会员',
                      c_t_1: '只需消费',
                      c_t_2: money(dd.data.amount),
                      c_t_3: '下一等级:尊尚会员'
                    })
                  }
                })



              }
              else if (r.data.memberClass == 'FS') {
                round(0, that);
                that.setData({
                  lv: '普通会员',
                  c_t_1: '只需消费',
                  c_t_2: '1次',
                  c_t_3: '下一等级:高级会员'
                })
              }
            }
          })

        }
      })
    }
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    var animation = wx.createAnimation({
      duration: 0
    });
    animation.rotate(0).step({ transformOrigin: '100% 50%' });
    this.setData({
      animationData: animation.export(),
      r1: 0,
      r2: 0,
      r3: 1,
      r4: 1
    })
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

  },
  bindPickerChange: function (e) {
    this.setData({
      telAdd: this.data.telArr[e.detail.value],
      index: e.detail.value
    })
  },
  changeTap: function (e) {
    var that = this;
    if (this.data.change == '手机号登录') {
      this.setData({
        change: '邮箱登录',
        mail: false,
        phone: true,
        passVal: '',
        mailVal: '',
        phoneVal: '',
        msg: ''
      })
    } else {
      this.setData({
        change: '手机号登录',
        mail: true,
        phone: false,
        passVal: '',
        mailVal: '',
        phoneVal: '',
        msg: ''
      })
    }
  },
  bindPassInput: function (e) {
    this.setData({
      passVal: e.detail.value
    })
  },
  bindPhoneInput: function (e) {
    this.setData({
      phoneVal: e.detail.value
    })
  },
  bindMailInput: function (e) {
    this.setData({
      mailVal: e.detail.value
    })
  },
  confirm: function (e) {
    var that = this;
    if (this.data.change == "手机号登录") {
      if (!/^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/.test(this.data.mailVal) || !this.data.passVal) {
        this.setData({
          msg: '请输入正确的邮箱或密码'
        })
      } else {
        wx.showLoading({ title: '加载中' });
        wx.request({
          url: 'https://wechat.chowsangsang.com/api/v2/login', //仅为示例，并非真实的接口地址
          method: 'post',
          data: {
            username: username, password: this.data.passVal
          },
          header: {
            'content-type': 'application/x-www-form-urlencoded'
          },
          success: function (res) {
            wx.hideLoading();
            var cookie = res.header['Set-Cookie'];
            if (res.data.serviceResponse) {

              wx.showLoading({ title: '加载中' });
              wx.setStorage({
                key: 'cookie',
                data: res.header['Set-Cookie']
              })
              wx.request({
                url: 'https://wechat.chowsangsang.com/api/customers', //仅为示例，并非真实的接口地址
                method: 'get',
                header: {
                  'content-type': 'application/json',
                  'cookie': cookie
                },
                success: function (r) {
                  console.log(r)
                  that.setData({
                    name: r.data.familyName + (/^[a-zA-Z]/.test(r.data.firstName) ? ' ' + r.data.firstName : r.data.firstName),
                    vipNum: r.data.id,
                    vipDate: r.data.expiredDate ? strDateToStr(r.data.expiredDate) : '-',
                    msg: '',
                    login: false,
                    user: true
                  });
                  wx.request({
                    url: 'https://wechat.chowsangsang.com/api/customers/stardollar-balances', //仅为示例，并非真实的接口地址
                    method: 'get',
                    header: {
                      'content-type': 'application/json',
                      'cookie': cookie
                    },
                    success: function (d) {
                      wx.hideLoading();
                      console.log(d)
                      if (typeof d.data[0].usableStarDollarAmount == "undefined") {
                        that.setData({
                          money: '0'
                        })
                      } else {
                        that.setData({
                          money: money(d.data[0].usableStarDollarAmount)
                        })
                      }
                      if ((r.data.memberClass == 'A8') || (r.data.memberClass == '01') || (r.data.memberClass == 'A1')) {
                        round(10000, that);
                        that.setData({
                          lv: '尊尚会员',
                          c_t_1: '我的悦享钱',
                          c_t_2: that.data.money,
                          c_t_3: ''
                        })
                      }
                      else if (r.data.memberClass == 'AA') {
                        wx.showLoading({ title: '加载中' });
                        wx.request({
                          url: 'https://wechat.chowsangsang.com/api/customers/nextClassRemainAmounts', //仅为示例，并非真实的接口地址
                          method: 'get',
                          header: {
                            'content-type': 'application/json',
                            'cookie': cookie
                          },
                          success: function (dd) {
                            wx.hideLoading();
                            round((10000 - dd.data.amount), that);
                            that.setData({
                              lv: '高级会员',
                              c_t_1: '只需消费',
                              c_t_2: money(dd.data.amount),
                              c_t_3: '下一等级:尊尚会员'
                            })
                          }
                        })
                      }
                      else if (r.data.memberClass == 'FS') {
                        round(0, that);
                        that.setData({
                          lv: '普通会员',
                          c_t_1: '只需消费',
                          c_t_2: '1次',
                          c_t_3: '下一等级:高级会员'
                        })
                      }
                    }
                  })

                }
              })
            } else {
              switch (res.data.authentication_exceptions[0]) {
                case 'AccountNotFoundException':
                  that.setData({
                    msg: '您输入的手机号不存在，请重新输入。'
                  })
                  break;
                case 'FailedLoginException':
                  that.setData({
                    msg: '您输入的账号或密码有误，请重新输入。'
                  })
                  break;
                default:
                  that.setData({
                    msg: res.data.authentication_exceptions[0]
                  })
                  break;
              }
            }

          }
        });
      }
    } else {
      if ((this.data.telAdd == '+86' && !/^1[3|4|5|8|7]\d{9}$/.test(this.data.phoneVal)) || !nimaTW(this.data.telAdd, this.data.phoneVal) || ((this.data.telAdd == '+852' || this.data.telAdd == '+853') && this.data.phoneVal.length !== 8) || !this.data.passVal) {
        this.setData({
          msg: '请输入正确的手机号或密码'
        })
      } else {
        wx.showLoading({ title: '加载中' });
        var username;
        if (this.data.telAdd == '+886' && this.data.phoneVal.length == 10) {
          username = this.data.telAdd.replace('+', '') + this.data.phoneVal.substr(1);
        } else {
          username = this.data.telAdd.replace('+', '') + this.data.phoneVal;
        };
        wx.request({
          url: 'https://wechat.chowsangsang.com/api/v2/login', //仅为示例，并非真实的接口地址
          method: 'post',
          data: {
            username: username, password: this.data.passVal
          },
          header: {
            'content-type': 'application/x-www-form-urlencoded'
          },
          success: function (res) {
            wx.hideLoading();
            var cookie = res.header['Set-Cookie'];
            if (res.data.serviceResponse) {

              wx.showLoading({ title: '加载中' });
              wx.setStorage({
                key: 'cookie',
                data: res.header['Set-Cookie']
              })
              wx.request({
                url: 'https://wechat.chowsangsang.com/api/customers', //仅为示例，并非真实的接口地址
                method: 'get',
                header: {
                  'content-type': 'application/json',
                  'cookie': cookie
                },
                success: function (r) {
                  that.setData({
                    name: r.data.familyName + (/^[a-zA-Z]/.test(r.data.firstName) ? ' ' + r.data.firstName : r.data.firstName),
                    vipNum: r.data.id,
                    vipDate: r.data.expiredDate ? strDateToStr(r.data.expiredDate) : '-',
                    msg: '',
                    login: false,
                    user: true
                  });
                  wx.request({
                    url: 'https://wechat.chowsangsang.com/api/customers/stardollar-balances', //仅为示例，并非真实的接口地址
                    method: 'get',
                    header: {
                      'content-type': 'application/json',
                      'cookie': cookie
                    },
                    success: function (d) {
                      wx.hideLoading();
                      if (typeof d.data[0].usableStarDollarAmount == "undefined") {
                        that.setData({
                          money: '0'
                        })
                      } else {
                        that.setData({
                          money: money(d.data[0].usableStarDollarAmount)
                        })
                      }
                      if ((r.data.memberClass == 'A8') || (r.data.memberClass == '01') || (r.data.memberClass == 'A1')) {
                        round(10000, that);
                        that.setData({
                          lv: '尊尚会员',
                          c_t_1: '我的悦享钱',
                          c_t_2: that.data.money,
                          c_t_3: ''
                        })
                      }
                      else if (r.data.memberClass == 'AA') {
                        wx.showLoading({ title: '加载中' });
                        wx.request({
                          url: 'https://wechat.chowsangsang.com/api/customers/nextClassRemainAmounts', //仅为示例，并非真实的接口地址
                          method: 'get',
                          header: {
                            'content-type': 'application/json',
                            'cookie': cookie
                          },
                          success: function (dd) {
                            wx.hideLoading();
                            round((10000 - dd.data.amount), that);
                            that.setData({
                              lv: '高级会员',
                              c_t_1: '只需消费',
                              c_t_2: money(dd.data.amount),
                              c_t_3: '下一等级:尊尚会员'
                            })
                          }
                        })



                      }
                      else if (r.data.memberClass == 'FS') {
                        round(0, that);
                        that.setData({
                          lv: '普通会员',
                          c_t_1: '只需消费',
                          c_t_2: '1次',
                          c_t_3: '下一等级:高级会员'
                        })
                      }
                    }
                  })

                }
              })
            } else {
              switch (res.data.authentication_exceptions[0]) {
                case 'AccountNotFoundException':
                  that.setData({
                    msg: '您输入的手机号不存在，请重新输入。'
                  })
                  break;
                case 'FailedLoginException':
                  that.setData({
                    msg: '您输入的账号或密码有误，请重新输入。'
                  })
                  break;
                default:
                  that.setData({
                    msg: res.data.authentication_exceptions[0]
                  })
                  break;
              }
            }

          }
        });
      }
    }
  },
  qrTap: function (e) {
    var that = this;
    var size = {};
    this.setData({
      qrContainer: true,
      minutes: '5',
      seconds: '00'
    });
    try {
      var res = wx.getSystemInfoSync();
      var scale = 187.5 / 122.7;//不同屏幕下canvas的适配比例；设计稿是750宽
      var width = res.windowWidth / scale;
      var height = width;//canvas画布为正方形
      size.w = width;
      size.h = height;
    } catch (e) {
      // Do something when catch error
    }
    var cookie = wx.getStorageSync('cookie');
    wx.request({
      url: 'https://wechat.chowsangsang.com/api/customers', //仅为示例，并非真实的接口地址
      method: 'get',
      header: {
        'content-type': 'application/json',
        'cookie': cookie
      },
      success: function (res) {
        QR.qrApi.draw(res.data.encryptedId, 'mycanvas', size.w, size.h);
      }
    })
    var timer = 300;
    s = setInterval(function () {
      if (timer != 0) {
        timer--;
        var minutes = Math.floor(timer / 60);
        var seconds = timer % 60;
        that.setData({
          minutes: minutes,
          seconds: seconds
        })
      } else {
        timer = 300;
        wx.request({
          url: 'https://wechat.chowsangsang.com/api/customers', //仅为示例，并非真实的接口地址
          method: 'get',
          header: {
            'content-type': 'application/json',
            'cookie': cookie
          },
          success: function (res) {
            QR.qrApi.draw(res.data.encryptedId, 'mycanvas', size.w, size.h);
          }
        })
      }
    }, 1000);
  },
  closeTap: function (e) {
    clearInterval(s);
    this.setData({
      qrContainer: false
    })
  },
  signOut: function (e) {
    var that = this;
    wx.showModal({
      title: '提示',
      content: '是否注销当前账号？',
      success: function (res) {
        if (res.confirm) {
          wx.clearStorage();
          that.setData({
            msg: '',
            passVal: '',
            login: true,
            user: false
          });
          var animation = wx.createAnimation({
            duration: 0
          });
          animation.rotate(0).step({ transformOrigin: '100% 50%' });
          that.setData({
            animationData: animation.export(),
            r1: 0,
            r2: 0,
            r3: 1,
            r4: 1
          });
        } else if (res.cancel) {
        }
      }
    })
  }
})

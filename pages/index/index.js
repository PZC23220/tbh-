//index.js
//获取应用实例
const util = require("../../utils/util.js");
const QQMapWX = require("../../utils/qqmap-wx-jssdk.min.js");
const province = require("../../utils/js/province.js");
const city = require("../../utils/js/city.js");
const county = require("../../utils/js/area.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},
    loginInfo: {
      snsId: '',
      name: '',
      school: '',
      gender: 'M',
      grade: 1,
      clazz: 1,
      avatar: ''
    },
    gender: 0,
    grade: 0,
    clazz: 0,
    province: 0,
    city: 0,
    county: 0,
    hasUserInfo: false,
    genderArray: ['男', '女'],
    gradeArray: ['一年级', '二年级', '三年级', '四年级', '五年级', '六年级'],
    clazzArray: [1, 2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30],
    isLogin: false,
    snsId: '',
    userId: '',
    friendsMoments: [],
    diamonds: 0,
    gradeName:'年级',
    chuName: '初',
    gaoName: '高',
    areaArr:['北京市','北京市','东城区']
  },
  bindPickerChangeSex: function (e) {
    if (e.detail.value == 0) {
      this.setData({
        gender: e.detail.value,
        'loginInfo.gender': 'M'
      })
    } else {
      this.setData({
        gender: e.detail.value,
        'loginInfo.gender': 'F'
      })
    }
  },
  bindPickerChangeGrade: function (e) {
    console.log(e.detail.value)
    this.setData({
      grade: e.detail.value,
      'loginInfo.grade': parseInt(e.detail.value)+1
    })
  },
  bindPickerChangeClazz: function (e) {
    this.setData({
      clazz: e.detail.value,
      'loginInfo.clazz': this.data.clazzArray[e.detail.value]
    })
  },
  bindPickerChangeProvince: function (e) {
    this.setData({
      'loginInfo.province': e.detail.value[0],
      'loginInfo.city': e.detail.value[1],
      'loginInfo.county': e.detail.value[2]
    })
  },
  bindKeyInputName: function (e) {
    this.setData({
      'loginInfo.name': e.detail.value
    })
  },
  bindKeyInputSchool: function (e) {
    console.log(this.data.grade)
    this.setData({
      'loginInfo.school': e.detail.value
    })
    if (new RegExp('中学').test(e.detail.value)) {
      this.setData({
        gradeArray: ['初一', '初二', '初三', '高一', '高二', '高三'],
        zhong: true
      })
    } else if (new RegExp('大学').test(e.detail.value)) {
      this.setData({
        gradeArray: ['大一', '大二', '大三', '大四'],
        zhong: true
      })
    } else {
      this.setData({
        gradeArray: ['一年级', '二年级', '三年级', '四年级', '五年级', '六年级'],
        zhong: false
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var self = this;
    wx.showLoading({
      title: '数据加载中...',
      mask: true
    })
    // 登录
    wx.login({
      success: res => {
        // openid
        util.request('/wx/session?code=' + res.code, function (logininfo) {
          self.setData({
            snsId: logininfo.openid,
            'loginInfo.snsId': logininfo.openid
          })
          // 微信登录tbh
          util.request('/users/login?snsId=' + logininfo.openid, function (userinfo) {
            if (userinfo.user || self.data.userId) {
              self.setData({
                isLogin: false,
                userInfo: userinfo.user,
                loginInfo: userinfo.user,
                userId: userinfo.user.id,
                diamonds: userinfo.diamondCount
              })
              if (new RegExp('中学').test(self.data.loginInfo.school)) {
                self.setData({
                  gradeArray: ['初一', '初二', '初三', '高一', '高二', '高三'],
                  zhong: true
                })
              } else if (new RegExp('大学').test(self.data.loginInfo.school)) {
                self.setData({
                  gradeArray: ['大一', '大二', '大三', '大四'],
                  zhong: true
                })
              } else {
                self.setData({
                  gradeArray: ['一年级', '二年级', '三年级', '四年级', '五年级', '六年级'],
                  zhong: false
                })
              }
              self.getDynamic();
              wx.hideLoading()
            } else {
              wx.setNavigationBarColor({
                frontColor: '#ffffff',
                backgroundColor: '#269fff',
                navigationBarBackgroundColor: "#269fff",
                animation: {
                  duration: 0,
                  timingFunc: 'easeIn'
                }
              })
              var qqmapsdk = new QQMapWX({
                key: '3LIBZ-D4DWW-T4SRG-OX2OP-YXNI2-SQFLX' // 必填
              });
              wx.getLocation({
                type: 'wgs84',
                success: function (res) {
                  console.log(res)
                  //2、根据坐标获取当前位置名称，显示在顶部:腾讯地图逆地址解析
                  qqmapsdk.reverseGeocoder({
                    location: {
                      latitude: res.latitude,
                      longitude: res.longitude
                    },
                    success: function (addressRes) {
                      var address = addressRes.result.address_component;
                      self.setData({
                        'loginInfo.province': address.province,
                        'loginInfo.city': address.city,
                        'loginInfo.county': address.district,
                        areaArr: [address.province, address.city, address.district]
                      })
                    }
                  })
                }
              })
              wx.getSetting({
                success: res => {
                  // 已经授权但未注册tbh，可以直接调用 getUserInfo 获取头像昵称，不会弹框
                  wx.getUserInfo({
                    success: res => {
                      self.setData({
                        isLogin: true,
                        userInfo: res.userInfo,
                        'loginInfo.avatar': res.userInfo.avatarUrl,
                        'loginInfo.name':res.userInfo.name
                      })
                      wx.hideLoading()
                    }
                  })
                }
              })
            }
          });
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
  onShcountyppMessage: function (res) {
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
    }
    return {
      title: '哇哦！朋友们竟然对我的评价是这样的！',
      path: '/pages/index/index',
      imageUrl: 'http://photodebug.oss-cn-hongkong.aliyuncs.com/tbh/tbh_share.png',
      success: function (res) {
        // 转发成功
        console.log(res);
        util.showSuccess('分享成功！')
      },
      fail: function (res) {
        // 转发失败
        console.log(res);
      }
    }
  },
  login: function (e) {
    var self = this;
    if (this.data.loginInfo.name && this.data.loginInfo.school) {
      wx.showLoading({
        title: '骚等一下...',
        mask: true
      })
      console.log(this.data.loginInfo)
      util.request('/users', function (res) {
        wx.hideLoading()
        if(res.id) {
          util.showSuccess('哇哦！注册成功了！')
          wx.setNavigationBarColor({
            frontColor: '#ffffff',
            backgroundColor: '#A341D3',
            navigationBarBackgroundColor: "#A341D3",
            animation: {
              duration: 10,
              timingFunc: 'easeIn'
            }
          })
          self.setData({
            isLogin: false,
            userInfo: res,
            userId: res.id
          })
        }else {
          wx.showToast({
            title: '注册失败',
            image: '../../image/icon_error_1 .png'
          });
        }
          
      }, 'POST', JSON.stringify(self.data.loginInfo));
    } else {
      wx.showToast({
        title: '请完善信息',
        image: '../../image/icon_alert .png',
        duration: 2000
      });
    }

  },
  editInfo: function (e) {
    wx.setNavigationBarColor({
      frontColor: '#ffffff',
      backgroundColor: '#269fff',
      navigationBarBackgroundColor: "#269fff",
      animation: {
        duration: 0,
        timingFunc: 'easeIn'
      }
    })
    this.setData({
      isLogin: true
    })
  },
  getDynamic() {
    let self = this;
    util.request(`/users/home?userId=${self.data.userId}`,function (res) {
      if (res.friendsMoments) {
        self.setData({
          friendsMoments: res.friendsMoments
        })
      }
      setTimeout(function () {
        self.getDynamic();
      }, 30000);
    })
  },
})
// pages/login/login.js
const util = require("../../utils/util.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},
    loginInfo: {
      name: '',
      school: '',
      sex: 'M',
      grade: 1,
      class: 1,
      province: '北京',
      city: '北京',
      area: '东城区',
      avatar: ''
    },
    sex: 0,
    grade: 0,
    class: 0,
    province: 0,
    city: 0,
    area: 0,
    hasUserInfo: false,
    sexArray: ['男', '女'],
    gradeArray: [1, 2, 3],
    classArray: [1, 2],
    provinceArray: ['北京', '广东'],
    cityArray: ['北京', '广州'],
    areaArray: ['东城区', '天河区']
  },
  bindPickerChangeSex: function (e) {
    if (e.detail.value == 0) {
      this.setData({
        sex: e.detail.value,
        'loginInfo.sex': 'M'
      })
    }else {
      this.setData({
        sex: e.detail.value,
        'loginInfo.sex': 'F'
      })
    }
  },
  bindPickerChangeGrade: function (e) {
    this.setData({
      grade: e.detail.value,
      'loginInfo.grade': this.data.gradeArray[e.detail.value]
    })
  },
  bindPickerChangeClass: function (e) {
    this.setData({
      class: e.detail.value,
      'loginInfo.class': this.data.classArray[e.detail.value]
    })
  },
  bindPickerChangeProvince: function (e) {
    this.setData({
      province: e.detail.value,
      'loginInfo.province': this.data.provinceArray[e.detail.value]
    })
  },
  bindPickerChangeCity: function (e) {
    this.setData({
      city: e.detail.value,
      'loginInfo.city': this.data.cityArray[e.detail.value]
    })
  },
  bindPickerChangeArea: function (e) {
    this.setData({
      area: e.detail.value,
      'loginInfo.area': this.data.areaArray[e.detail.value]
    })
  },
  bindKeyInputName: function (e) {
    this.setData({
      name: e.detail.value
    })
  },
  bindKeyInputSchool: function (e) {
    this.setData({
      school: e.detail.value
    })
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
  onShareAppMessage: function (res) {
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
    if (this.data.name && this.data.school) {
      var gender = this.data.sexArray[this.data.sex] == '男' ? 'M':'F';
      var newData = {
        name: this.data.name,
        school: this.data.school,
        gender: gender,
        grade: this.data.gradeArray[this.data.grade],
        clazz: this.data.classArray[this.data.class],
        avatar: this.data.userInfo.avatarUrl,
        province: this.data.provinceArray[this.data.province],
        city: this.data.cityArray[this.data.city],
        county: this.data.areaArray[this.data.area]
      }
      util.request('/users?d=d',function(res){
        console.log(res);
        // wx.navigateTo({
        //   url: '../index/index',
        // })
      }, 'POST', JSON.stringify(newData));
    } else {
      wx.showToast({
        title: '请完善信息！',
        image: 'http://photodebug.oss-cn-hongkong.aliyuncs.com/h5_groupy/close/close.png',
        duration: 2000
      });
    }

  }
})
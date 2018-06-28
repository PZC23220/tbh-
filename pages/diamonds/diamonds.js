// pages/diamonds/diamonds.js
const util = require("../../utils/util.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    blueDiamonds: 0,
    redDiamonds: 0,
    snsId: '',
    userId: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showLoading({
      title: '数据加载中...',
      mask: true
    })
    this.setData({
      snsId: options.snsId,
      userId: options.userId
    })
    this.getDiamonds();
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
      title: '哇哦！我竟然获得了那么多💎！！！',
      path: '/pages/index/index',
      imageUrl: 'http://photoh5-cn.oss-cn-shenzhen.aliyuncs.com/xigua/font/%E5%85%B0%E4%BA%AD%E9%BB%91%E7%AE%80/1151520592125_.pic.jpg',
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
  getDiamonds() {
    let self = this;
    util.request(`/users/me?userId=${self.data.userId}`,function (res) {
      wx.hideLoading()
      if (res.blueDiamonds) {
        self.setData({
          blueDiamonds: res.blueDiamonds
        })
      }
      if (res.redDiamonds) {
        self.setData({
          redDiamonds: res.redDiamonds
        })
      }

    })
  }
})
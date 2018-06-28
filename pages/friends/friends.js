// pages/friends/friends.js
const util = require("../../utils/util.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},
    friendsList: [],
    hasFriend: false,
    following: [],
    others: [],
    displayNone: true,
    keyword:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var self = this;
    self.setData({
      snsId: options.snsId,
      userId: options.userId
    })
    self.getFriends();
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
  // 获取好友列表
  getFriends: function() {
    var self = this;
    util.request(`/users/friends?userId=${self.data.userId}`, function (res) {
      if(res.length > 0) {
        self.setData({
          friendsList: res,
          hasFriend: true
        })
      }
    })
  },
  //搜索
  bindSearch: function(e) {
    var self = this;
    if(e) {
      self.setData({
        keyword: e.detail.value
      })
    }
    if (self.data.keyword) {
      util.request(`/users/search?userId=${self.data.userId}&keyword=${self.data.keyword}`, function (res) {
        console.log(res);
        if (res.following) {
          self.setData({
            following: res.following,
            hasFriend: true,
            displayNone: false
          })
        }else {
          self.setData({
            following: []
          })
        }
        if (res.others) {
          self.setData({
            others: res.others,
            hasFriend: true,
            displayNone: false
          })
        }else {
          self.setData({
            others: []
          })
        }
      })
    }else {
      if (self.data.friendsList.length > 0) {
        self.setData({
          following: [],
          others: [],
          hasFriend: true,
          displayNone: true
        })
      }else {
        self.setData({
          following: [],
          others: [],
          hasFriend: false,
          displayNone: true
        })
      }
    }
    
  },
  //添加删除好友
  bindFollow: function(e) {
    var self = this;
    var newdata = {
      followedId: e.currentTarget.dataset.ids,
      followingId: self.data.userId
    }
    util.request(`/users/follow`,function(res){
      if(res.id) {
        if (res.following){
          util.showSuccess('好友已添加！')
        }else {
          util.showSuccess('好友已删除！')
        }
        self.bindSearch();
        self.getFriends();
      }
    },'POST',JSON.stringify(newdata))
  }
})
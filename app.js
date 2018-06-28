//app.js
const util = require("/utils/util.js");
App({
  onLaunch: function () {

    // 打开调试
    // wx.setEnableDebug({
    //   enableDebug: true
    // })
    
    wx.showShareMenu({
      withShareTicket: true
    })
    wx.getShareInfo()
  },
  globalData: {
    userInfo: null,
    loginInfo: null
  }
})
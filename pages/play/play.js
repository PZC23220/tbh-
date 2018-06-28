// pages/play/play.js
const util = require("../../utils/util.js");
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},
    currentAnswer: 4,
    totalTopic: 1,
    answerComplete: false,
    CompleteSuccess: true,
    currentTopic: 1,
    question: {},
    answerList: [],
    questionsList: [],
    bgColor: [' #008AD0', '#F6A322', '#07B3AB','#D73884'],
    activeColor: '#008AD0',
    colorIdx: 0,
    snsId: '',
    userId: '',
    answerTap: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var self = this;
    wx.showLoading({
      title: '题目更新中...',
      mask: true
    })
    self.setData({
      snsId: options.snsId,
      userId: options.userId
    })
    wx.getStorage({
      key: 'guide',
      fail: function(res) {
        wx.setStorage({
          key: "guide",
          data: "guide"
        })
        wx.redirectTo({
          url: `../guide/guide?snsId=${options.snsId}&userId=${options.userId}`,
        })
      }
    });
    util.request('/questions?userId=' + options.userId, function (res) {
      wx.hideLoading();
      if (res[0].question) {
        self.setData({
          questionsList: res,
          question: res[0].question,
          totalTopic: res.length,
          answerList: res[0].answers,
          currentTopic: 1
        })
      }else {
        self.setData({
          answerComplete: true,
          CompleteSuccess: false
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
  onShareAppMessage: function (res) {
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
    }
    return {
      title: '你的朋友在tbh向你提了一个问题',
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
  //点击答案
  bindAnswer: function (e) {
    var self = this;
    if(self.data.answerTap) {
      self.setData({
        answerTap: false,
        currentAnswer: e.currentTarget.dataset.idx
      });
      var newdata = {
        questionId: self.data.question.id,
        answerId: e.currentTarget.dataset.ids,
        replierId: self.data.userId
      }
      util.request('/answers', function (res) {
        if (!res) {
          if (self.data.currentTopic == self.data.totalTopic) {
            self.setData({
              answerTap: true,
              currentAnswer: 4,
              answerComplete: true,
              CompleteSuccess: true
            });
            wx.setNavigationBarColor({
              frontColor: '#ffffff',
              backgroundColor: '#A341D3',
              navigationBarBackgroundColor: '#A341D3',
              animation: {
                duration: 0,
                timingFunc: 'easeIn'
              }
            })
          } else {
            var questionsList_ = self.data.questionsList[self.data.currentTopic];
            self.setData({
              answerTap: true,
              currentAnswer: 4,
              currentTopic: ++(self.data.currentTopic),
              question: questionsList_.question,
              answerList: questionsList_.answers,
              colorIdx: ++(self.data.colorIdx),
              activeColor: self.data.bgColor[self.data.colorIdx]
            });
            if (self.data.colorIdx == 4) {
              self.setData({
                colorIdx: 0
              })
            }
            wx.setNavigationBarColor({
              frontColor: '#ffffff',
              backgroundColor: self.data.activeColor,
              navigationBarBackgroundColor: self.data.activeColor,
              animation: {
                duration: 0,
                timingFunc: 'easeIn'
              }
            })
          }
        } else {
          self.setData({
            answerTap: true,
            answerComplete: true,
            CompleteSuccess: false
          });
          wx.setNavigationBarColor({
            frontColor: '#ffffff',
            backgroundColor: '#A341D3',
            navigationBarBackgroundColor: '#A341D3',
            animation: {
              duration: 0,
              timingFunc: 'easeIn'
            }
          })
        }
      }, 'POST', JSON.stringify(newdata));
    }   
  },
  // 刷新列表
  bindRefresh: function(e) {
    var self = this;
    util.request('/questions?userId=' + self.data.userId, function (res) {
      if (res[0].question) {
        self.setData({
          answerTap: true,
          currentAnswer: 4,
          questionsList: res,
          question: res[0].question,
          totalTopic: res.length,
          answerList: res[0].answers,
          currentTopic: 1
        })
      } else {
        self.setData({
          answerComplete: true,
          CompleteSuccess: false
        })
        wx.setNavigationBarColor({
          frontColor: '#ffffff',
          backgroundColor: '#A341D3',
          navigationBarBackgroundColor: '#A341D3',
          animation: {
            duration: 0,
            timingFunc: 'easeIn'
          }
        })
      }
    })
  },
  // 跳过题目
  bindFilter: function(e) {
    var self = this;
    if (self.data.currentTopic == self.data.totalTopic) {
      self.setData({
        answerTap: true,
        currentAnswer: 4,
        answerComplete: true,
        CompleteSuccess: true
      });
      wx.setNavigationBarColor({
        frontColor: '#ffffff',
        backgroundColor: '#A341D3',
        navigationBarBackgroundColor: '#A341D3',
        animation: {
          duration: 0,
          timingFunc: 'easeIn'
        }
      })
    } else {
      var questionsList_ = self.data.questionsList[self.data.currentTopic]
      self.setData({
        answerTap: true,
        currentAnswer: 4,
        currentTopic: ++(self.data.currentTopic),
        question: questionsList_.question,
        answerList: questionsList_.answers,
        colorIdx: ++(self.data.colorIdx),
        activeColor: self.data.bgColor[self.data.colorIdx]
      });
      if (self.data.colorIdx == 4) {
        self.setData({
          colorIdx: 0
        })
      }
      wx.setNavigationBarColor({
        frontColor: '#ffffff',
        backgroundColor: self.data.activeColor,
        navigationBarBackgroundColor: self.data.activeColor,
        animation: {
          duration: 0,
          timingFunc: 'easeIn'
        }
      })
    }
  },
  // 切换答案
  bindSwitch: function(e) {
    var self = this;
    util.request(`/questions/answers?userId=${self.data.userId}&questionId=${self.data.question.id}`,function(res){
      if(res.length > 0) {
        self.setData({
          answerList: res
        });
      }
      
    });
  }
})
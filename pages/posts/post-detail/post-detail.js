var postsData = require('../../../data/posts-data.js')
var app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    isPlayingMusic: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (option) {
    var that = this;
    var postId = option.id;
    this.data.currentPostId = postId;
    var postData = postsData.postList[postId];
    this.setData({
      postsData: postData
    })

    var postsCollected = wx.getStorageSync('posts_collected')
    if (postsCollected) {
      var postCollected = postsCollected[postId]
      this.setData({
        collected: postCollected
      })
    } else {
      var postsCollected = {};
      postsCollected[postId] = false;
      wx.setStorageSync('posts_collected', postsCollected);
    }

    // 监听音乐是否处于播放状态
    this.playingState()

    // 歌曲是否处于播放状态，且 id是否是当前页面id
    if (app.globalData.g_isplayingMusic && app.blobalData.g_currentMusicPostId === postId ) {
      this.setData({
        isPlayingMusic: true
      })
    }

  },

  onCollectionTap: function (event) {
    var postsCollected = wx.getStorageSync('posts_collected');
    var postCollected = postsCollected[this.data.currentPostId];
    // 改变收藏状态  
    postCollected = !postCollected;
    postsCollected[this.data.currentPostId] = postCollected

    // console.log(postCollected)
    this.showToast(postsCollected, postCollected);
  },

  // 分享
  onShareTap: function (event) {
    var itemList = ["分享给微信好友", "分享到朋友圈", "分享到QQ", "分享到微博"]
    wx.showActionSheet({
      itemList: itemList,
      itemColor: '#405f80',
      success: function (res) {
        // res.cancel
        // res.tapIndex
        wx.showModal({
          title: '用户' + itemList[res.tapIndex],
          content: '无法实现分享',
        })
      }
    })
  },

  showToast: function (postsCollected, postCollected) {
    // 更新收藏状态
    wx.setStorageSync('posts_collected', postsCollected)
    this.setData({
      collected: postCollected
    })
    wx.showToast({
      title: postCollected ? '收藏成功' : '取消收藏',
      duration: 1000,
      icon: "success"
    })
  },

  // 播放音乐
  onMusicTap: function (event) {

    this.isPlayingMusic = this.data.isPlayingMusic
    var currentPostId = this.data.currentPostId
    var postData = postsData.postList[currentPostId]

    // 是否处于播放状态
    if (this.isPlayingMusic) {
      wx.pauseBackgroundAudio()
      this.setData({
        isPlayingMusic: false
      })
    } else {
      wx.playBackgroundAudio({
        dataUrl: postData.music.url,
        title: postData.music.title,
        coverImgUrl: postData.music.coverImg
      })
      this.setData({
        isPlayingMusic: true
      })
    }

    this.playingState()

  },

  // 监听播放状态
  playingState: function () {
    var that = this
    wx.onBackgroundAudioPlay(function () {
      that.setData({
        isPlayingMusic: true
      })
      // 全部变量-保存播放状态
      app.globalData.g_isplayingMusic = true  
      // 记录当前播放id
      app.blobalData.g_currentMusicPostId = this.data.currentPostId
    })
    wx.onBackgroundAudioPause(function () {
      that.setData({
        isPlayingMusic: false
      })
      app.globalData.g_isplayingMusic = false
      app.blobalData.g_currentMusicPostId = null
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
    app.globalData.g_isplayingMusic = false
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

  }
})
Page({
  data: {
    mySampleList: [],
    showSearchAcount: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    var that = this
    var userName = getApp().globalData.UserInfo.TrueName
    wx.showLoading({
      title: '查询中...',
      mask: true
    })
    //调用搜索请求，获取用户样品
    wx.request({
      url: getApp().globalData.host + '/searchSample',
      method: "POST",
      header: {
        'content-type': 'application/json'
      },
      data: {
        access_token: getApp().globalData.token,
        searchOption: 'owner',
        search_word: userName
      },
      success: function (res) {
        wx.hideLoading()
        that.setData({
          mySampleList: res.data.ret,
          showSearchAcount: true,
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
  onShareAppMessage: function () {
  
  }
})
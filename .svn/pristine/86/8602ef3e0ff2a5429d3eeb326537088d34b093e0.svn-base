const util = require('../../utils/util.js')

Page({
  data: {
    userAvatarUrl :"",
    nickName:'',
    EID:'',
    department:'',
    originPW:'',
    newPW:'',
    confirmNewPW:'',
    modalMessage: '',
    question:'',
    hiddenModalMessage:true,
    hiddenAbout:true,
    hiddenContactUs:true,
    hiddenChangePassword:true
  },
  about111:function(){
    wx.request({
      url: getApp().globalData.host + '/mailtest',
      method: "POST",
      header: {
        'content-type': 'application/json'
      },
      data: {
        content: 'mail test for python send',
      },
      success: function (res) {
        console.log(res)
      }
    })
  },
  
  about:function(){
    this.setData({
      hiddenAbout: false
    })
  },
  contactUs:function(){
    this.setData({
      hiddenContactUs: false
    })
  },
  //问题反馈发送邮件
  sendQuestion:function(){
    var that = this
    wx.showLoading({
      title: 'Sending...',
      mask: true
    })
    console.log(this.data.question)
    wx.request({
      url: getApp().globalData.host + '/wxsendMail' ,
      method:"POST",
      header: {
        'content-type': 'application/json'
      },
      data:{
        question: this.data.question,
      },
      success:function(res){
        wx.hideLoading()
        that.sendSuccessHint()
      }
    })
  },
  //SendMail 成功
  sendSuccessHint:function(){
    this.setData({
      hiddenContactUs:true
    })
    wx.showToast({
      title: '成功',
      icon: 'success',
      duration: 2000
    })
  },
  questionInput:function(e){
    this.setData({
      question: e.detail.value
    })
  },
  changePassword:function(){
    this.emptyPWInput()
    this.setData({
      hiddenChangePassword: false
    })
  },
  logout:function(){
    getApp().globalData.token = '';
    wx.redirectTo({
      url: '../login/login'
    })
  },
  //取消/隐藏模态框
  hideModal:function(){
    this.setData({
      hiddenAbout:true,
      hiddenContactUs:true,
      hiddenChangePassword:true,
    })
  },
  hidePopUp:function(){
    this.setData({
      hiddenModalMessage: true
    })
  },
  //更改密码
  changePWD:function(){
    var that = this
    if (util.trim(this.data.originPW).length == 0){
      this.showTheModal('原密码不能为空！')
      return false
    }
    if (util.trim(this.data.newPW).length == 0) {
      this.showTheModal('新密码不能为空！')
      return false
    }
    if (util.trim(this.data.newPW) != util.trim(this.data.confirmNewPW)) {
      this.showTheModal('两次密码输入不一致！')
      return false
    }
    wx.showLoading({
      title: 'Loading...',
      mask: true
    })
    wx.request({
      url: getApp().globalData.host + '/changePwd',
      method: "POST",
      header: {
        'content-type': 'application/json'
      },
      data: {
        access_token: getApp().globalData.token,
        oldPWD: util.trim(this.data.originPW),
        newPWD: util.trim(this.data.newPW)
      },
      success: function (res) {
        wx.hideLoading()
        that.changePWDResult(res.data.ret)
      }
    })
  },
  //navigate to mySample page
  mySample:function(){
    wx.navigateTo({
      url: 'mySample'
    })
  },
  //绑定微信功能
  bindingWX:function(){
    wx.showLoading({
      title: 'Loading...',
      mask: true
    })
    wx.request({
      url: getApp().globalData.host + '/bindingWXaccount',
      method: "POST",
      header: {
        'content-type': 'application/json'
      },
      data: {
        username: this.data.EID,
        openID: getApp().globalData.openID,
      },
      success: res => {
        wx.hideLoading()
        //string 0：已经绑定；1：成功；2：绑定了别人；-1：异常
        this.bingingWXResult(res.data.ret)
      }
    })
  },
  bingingWXResult:function(resultCode){
    if (resultCode[0] == '0'){
      this.showTheModal('此EID和微信已经绑定过了！')
    } else if (resultCode[0] == '1'){
      this.showTheModal('绑定成功！您现在可以使用微信号登录了！')
    } else if (resultCode[0] == '2'){
      this.showTheModal('此微信已经绑定了用户 ' + resultCode[1] + '\n请联系管理员！')
    }else{
      this.showTheModal('未知错误，请联系管理员！')
    }
  },
  changePWDResult:function(ret){
    if (ret == 'pwd error'){
      this.showTheModal('原密码不对！')
    } else if (ret == 'success'){
      wx.showToast({
        title: '更改成功',
        icon: 'success',
        duration: 2000
      })
      setTimeout(function () {
        wx.redirectTo({
          url: '../login/login'
        })
      }, 2100)
      
    }
  },
  //input box get value
  originPWInput:function(e){
    this.setData({
      originPW: e.detail.value
    })
  },
  newPWInput: function (e) {
    this.setData({
      newPW: e.detail.value
    })
  },
  confirmNewPWInput: function (e) {
    this.setData({
      confirmNewPW: e.detail.value
    })
  },
  emptyPWInput:function(){
    this.setData({
      originPW: '',
      newPW: '',
      confirmNewPW: ''
    })
  },
  //根据变量弹出提示框
  showTheModal: function (title) {
    this.setData({
      modalMessage: title,
      hiddenModalMessage: false,
    })
  },
  
  //页面加载函数
  onLoad: function () {
    var that = this
    var UserInfo = getApp().globalData.UserInfo
    var wxuserInfo = getApp().globalData.userInfo
    this.setData({
      userAvatarUrl: wxuserInfo.avatarUrl,
      nickName: UserInfo.TrueName,
      EID: UserInfo.UserName,
      department: UserInfo.Department
    })
  },
  //生命周期函数--监听页面显示
  onShow:function(){
    console.log(getApp().globalData.userInfo)
    console.log(getApp().globalData.openID)
  }
})

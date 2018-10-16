// pages/deviceManager/deviceManager.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    searchInput:'',
    table:[],
    rowDetail:[],
    addRowDetail: new Object(),
    // tableLen:0,
    switchValue:'切换到仪器设备',
    deviceType:'pcType',
    hiddenPCdetail:true,
    hiddenEquipDetail:true,
    hiddenDeleteComfirm:true,
    hiddenAddPC:true,
    hiddenAddEquip:true,
    startX: 0, //开始坐标
    startY: 0
  },
  
  searchDev:function(){
    wx.request({
      url: getApp().globalData.host + '/searchDev',
      method: "POST",
      header: {
        'content-type': 'application/json'
      },
      data: {
        "access_token": getApp().globalData.token,
        'DevType': this.data.deviceType,
        'search_word': this.data.searchInput
      },
      success: res=>{
        this.setValueForTable(res.data.ret)
      }
    })
  },

  switchType:function(){
    if (this.data.deviceType == 'pcType'){
      this.setData({
        switchValue: '切换到电脑设备',
        deviceType: 'equipmentType',
      })
    }else{
      this.setData({
        switchValue: '切换到仪器设备',
        deviceType: 'pcType',
      })
    }
    this.getDeviceList();
  },

  //获取设备列表
  getDeviceList:function(){
    wx.showLoading({
      title: 'Loading...',
      mask: true
    })
    wx.request({
      url: getApp().globalData.host + '/getDevlist',
      method: "POST",
      header: {
        'content-type': 'application/json'
      },
      data: {
        'DevType': this.data.deviceType
      },
      success: res=> {
        wx.hideLoading()
        this.setValueForTable(res.data.ret)
      }
    })
  },
  //给table赋值
  setValueForTable:function(data){
    for (var i = 0; i < data.length;i++){
      data[i].showTouchDel = false;
    }
    this.setData({
      table: data
    })
  },
  
  //获取设备详情
  viewDetail:function(e){
    if (this.data.deviceType == 'pcType') {
      this.setData({
        hiddenPCdetail: false,
      })
    }else{
      this.setData({
        hiddenEquipDetail: false,
      })
    }
    
  },
  //保存修改
  saveDetail:function(){
    //移除showTouchDel属性
    this.data.rowDetail.showTouchDel = ''
    wx.request({
      url: getApp().globalData.host + '/editDevice',
      method: "POST",
      header: {
        'content-type': 'application/json'
      },
      data: {
        "access_token": getApp().globalData.token,
        'rowInfo': this.data.rowDetail,
        'DevType': this.data.deviceType
      },
      success: res => {
        if (res.data.ret == 'success'){
          this.saveSuccessAction();
        }else{
          wx.showModal({
            title: '错误',
            content: '修改失败,请重试!',
            showCancel:false
          })
        }
      }
    })
  },
  saveSuccessAction:function(){
    wx.showToast({
      title: '修改成功',
      icon: 'success',
      duration: 2000
    })
    this.hideModal();
    var that = this
    setTimeout(function () {
      that.getDeviceList();
    }, 2100)
  },
  
  showAddModal:function(){
    if (this.data.deviceType == 'pcType') {
      this.setData({
        addRowDetail: new Object(),
        hiddenAddPC: false,
      })
    }else{
      this.setData({
        addRowDetail: new Object(),
        hiddenAddEquip: false,
      })
    }
  },
  showDeleteConfirm:function(e){
    console.log('GID::', this.data.rowDetail.GID)
    this.setData({
      hiddenDeleteComfirm: false,
    })
  },
  //确认删除
  confirmDelete:function(){
    wx.request({
      url: getApp().globalData.host + '/deleteDevice',
      method: "POST",
      header: {
        'content-type': 'application/json'
      },
      data: {
        "access_token": getApp().globalData.token,
        'GID': this.data.rowDetail.GID,
        'DevType': this.data.deviceType
      },
      success: res=>{
        this.hideModal();
        if (res.data.ret == 'success') {
          wx.showToast({
            title: '删除成功',
            icon: 'success',
            duration: 2000
          })
          var that = this
          setTimeout(function () {
            that.getDeviceList();
          }, 2100)
        } else {
          wx.showModal({
            title: '错误',
            content: '删除失败,请重试!',
            showCancel: false
          })
        }
      }
    })
  },
  addDevice:function(){
    if (this.data.deviceType == 'pcType') {
      this.addPCCheck()//PC判断是否有未填写数值
    }else{
      this.addEquipCheck()//Equip判断是否有未填写数值,且填充其他字段一起发送到服务器
    }
    wx.request({
      url: getApp().globalData.host + '/addDevice',
      method: "POST",
      header: {
        'content-type': 'application/json'
      },
      data: {
        "access_token": getApp().globalData.token,
        'addRowInfo': this.data.addRowDetail,
        'DevType': this.data.deviceType
      },
      success: res=>{
        this.hideModal();
        if (res.data.ret == 'success') {
          wx.showToast({
            title: '添加成功',
            icon: 'success',
            duration: 2000
          })
          var that = this
          setTimeout(function () {
            that.getDeviceList();
          }, 2100)
        } else {
          wx.showModal({
            title: '错误',
            content: '添加失败,请重试!',
            showCancel: false
          })
        }
      }
    })
  },
  addPCCheck:function(){
    if (!this.data.addRowDetail.DeviceNo){
      this.data.addRowDetail.DeviceNo=''
    }
    if (!this.data.addRowDetail.DeviceName) {
      this.data.addRowDetail.DeviceName = ''
    }
    if (!this.data.addRowDetail.ValidDate) {
      this.data.addRowDetail.ValidDate = ''
    }
    if (!this.data.addRowDetail.Status) {
      this.data.addRowDetail.Status = ''
    }
    if (!this.data.addRowDetail.BrandNo) {
      this.data.addRowDetail.BrandNo = ''
    }
    if (!this.data.addRowDetail.Owner) {
      this.data.addRowDetail.Owner = ''
    }
    if (!this.data.addRowDetail.Location) {
      this.data.addRowDetail.Location = ''
    }
    if (!this.data.addRowDetail.FinancialCode) {
      this.data.addRowDetail.FinancialCode = ''
    }
  },
  //如果是equip类型设备新增的时候需要添加字段
  addEquipCheck: function () {
    if (!this.data.addRowDetail.DevName) {
      this.data.addRowDetail.DevName = ''
    }
    if (!this.data.addRowDetail.DevID) {
      this.data.addRowDetail.DevID = ''
    }
    if (!this.data.addRowDetail.DevModel) {
      this.data.addRowDetail.DevModel = ''
    }
    if (!this.data.addRowDetail.SerialNo) {
      this.data.addRowDetail.SerialNo = ''
    }
    if (!this.data.addRowDetail.Location) {
      this.data.addRowDetail.Location = ''
    }
    if (!this.data.addRowDetail.DevStatus) {
      this.data.addRowDetail.DevStatus = ''
    }
    if (!this.data.addRowDetail.ValidDate) {
      this.data.addRowDetail.ValidDate = ''
    }
    if (!this.data.addRowDetail.Remark) {
      this.data.addRowDetail.Remark = ''
    }
    //填入其他字段
    this.data.addRowDetail.ManuName = ''
    this.data.addRowDetail.DevNo = ''
    this.data.addRowDetail.CD = ''
    this.data.addRowDetail.Accessories = ''
    this.data.addRowDetail.Certificate = ''
    this.data.addRowDetail.MeasurementRecord = ''
    this.data.addRowDetail.AuditRecord = ''
    this.data.addRowDetail.MaintainRecord = ''
    this.data.addRowDetail.Sum = ''
  },

  //说明书拍照
  takeManualPhoto:function(){
    var that = this
    wx.chooseImage({
      count: 1,
      success: function(res) {
        var tempFilePaths = res.tempFilePaths
        var fileName = new Date().getTime() + '.' + tempFilePaths[0].split('.').pop()
        //上传照片
        wx.uploadFile({
          url: getApp().globalData.host + '/uploaded_file',
          filePath: tempFilePaths[0],
          name: 'file',
          formData:{
            'name': fileName,
            'upType':'manulUpFile',
            "GID": that.data.rowDetail.GID
          },
          success: res=>{
            console.log(res.data)
            if (res.data == 'success'){
              wx.showToast({
                title: '添加成功',
                icon: 'success',
                duration: 1000
              })
            }else{
              wx.showModal({
                title: '错误',
                content: '添加失败,请重试!',
                showCancel: false
              })
            }
          }
        })
      },
    })
  },
  //校验报告拍照
  takeVerificationPhoto: function () {
    var that = this
    wx.chooseImage({
      count: 1,
      success: function (res) {
        var tempFilePaths = res.tempFilePaths
        var fileName = new Date().getTime() + '.' + tempFilePaths[0].split('.').pop()
        //上传照片
        wx.uploadFile({
          url: getApp().globalData.host + '/uploaded_file',
          filePath: tempFilePaths[0],
          name: 'file',
          formData: {
            'name': fileName,
            'upType': 'VerificationUpFile',
            "GID": that.data.rowDetail.GID
          },
          success: res => {
            console.log(res.data)
            if (res.data == 'success') {
              wx.showToast({
                title: '添加成功',
                icon: 'success',
                duration: 1000
              })
            } else {
              wx.showModal({
                title: '错误',
                content: '添加失败,请重试!',
                showCancel: false
              })
            }
          }
        })
      },
    })
  },
  
  hideModal:function(){
    this.setData({
      hiddenPCdetail:true,
      hiddenDeleteComfirm:true,
      hiddenAddPC: true,
      hiddenAddEquip:true,
      hiddenEquipDetail:true,
    })
  },

  //输入框实时赋值
  searchBindInput:function(e){
    this.data.searchInput = e.detail.value
  },
  DeviceNoInput:function(e){
    this.data.rowDetail.DeviceNo=e.detail.value
  },
  DeviceNameInput: function (e) {
    this.data.rowDetail.DeviceName = e.detail.value
  },
  ValidDateInput: function (e) {
    this.data.rowDetail.ValidDate = e.detail.value
  },
  StatusInput: function (e) {
    this.data.rowDetail.Status = e.detail.value
  },
  BrandNoInput: function (e) {
    this.data.rowDetail.BrandNo = e.detail.value
  },
  OwnerInput: function (e) {
    this.data.rowDetail.Owner = e.detail.value
  },
  LocationInput: function (e) {
    this.data.rowDetail.Location = e.detail.value
  },
  FinancialCodeInput: function (e) {
    this.data.rowDetail.FinancialCode = e.detail.value
  },
  DevNameInput: function (e) {
    this.data.rowDetail.DevName = e.detail.value
  },
  DevIDInput: function (e) {
    this.data.rowDetail.DevID = e.detail.value
  },
  DevModelInput: function (e) {
    this.data.rowDetail.DevModel = e.detail.value
  },
  SerialNoInput: function (e) {
    this.data.rowDetail.SerialNo = e.detail.value
  },
  LocationInput: function (e) {
    this.data.rowDetail.Location = e.detail.value
  },
  DevStatusInput: function (e) {
    this.data.rowDetail.DevStatus = e.detail.value
  },
  RemarkInput: function (e) {
    this.data.rowDetail.Remark = e.detail.value
  },
  //add input
  addDeviceNoInput: function (e) {
    this.data.addRowDetail.DeviceNo = e.detail.value
  },
  addDeviceNameInput: function (e) {
    this.data.addRowDetail.DeviceName = e.detail.value
  },
  addValidDateInput: function (e) {
    this.data.addRowDetail.ValidDate = e.detail.value
  },
  addStatusInput: function (e) {
    this.data.addRowDetail.Status = e.detail.value
  },
  addBrandNoInput: function (e) {
    this.data.addRowDetail.BrandNo = e.detail.value
  },
  addOwnerInput: function (e) {
    this.data.addRowDetail.Owner = e.detail.value
  },
  addLocationInput: function (e) {
    this.data.addRowDetail.Location = e.detail.value
  },
  addFinancialCode: function (e) {
    this.data.addRowDetail.FinancialCode = e.detail.value
  },
  addDevNameInput: function (e) {
    this.data.addRowDetail.DevName = e.detail.value
  },
  addDevIDInput: function (e) {
    this.data.addRowDetail.DevID = e.detail.value
  },
  addDevModelInput: function (e) {
    this.data.addRowDetail.DevModel = e.detail.value
  },
  addSerialNoInput: function (e) {
    this.data.addRowDetail.SerialNo = e.detail.value
  },
  addLocationInput: function (e) {
    this.data.addRowDetail.Location = e.detail.value
  },
  addDevStatusInput: function (e) {
    this.data.addRowDetail.DevStatus = e.detail.value
  },
  addRemarkInput: function (e) {
    this.data.addRowDetail.Remark = e.detail.value
  },

  //手指触摸动作开始 记录起点X坐标
  touchstart: function (e) {
    //开始触摸时 重置所有删除
    this.data.table.forEach(function (v, i) {
      if (v.showTouchDel)//只操作为true的
        v.showTouchDel = false;
    })
    this.setData({
      startX: e.changedTouches[0].clientX,
      startY: e.changedTouches[0].clientY,
      table: this.data.table,
      rowDetail: this.data.table[e.currentTarget.dataset.index]
    })
  },
  //滑动事件处理
  touchmove: function (e) {
    var that = this,
    index = e.currentTarget.dataset.index,//当前索引
    startX = that.data.startX,//开始X坐标
    startY = that.data.startY,//开始Y坐标
    touchMoveX = e.changedTouches[0].clientX,//滑动变化坐标
    touchMoveY = e.changedTouches[0].clientY,//滑动变化坐标
    //获取滑动角度
    angle = that.angle({ X: startX, Y: startY }, { X: touchMoveX, Y: touchMoveY });
    that.data.table.forEach(function (v, i) {
    //滑动超过30度角 return
    if (angle > 30) return false;
    if (i == index) {
      if (startX - touchMoveX > 20) //左滑
        v.showTouchDel = true
      else //右滑
        v.showTouchDel = false
    }
    })
    //更新数据
    that.setData({
      table: that.data.table
    })
  },
  /**
  * 计算滑动角度
  * @param {Object} start 起点坐标
  * @param {Object} end 终点坐标
  */
  angle: function (start, end) {
    var _X = end.X - start.X,
      _Y = end.Y - start.Y
    //返回角度 /Math.atan()返回数字的反正切值
    return 360 * Math.atan(_Y / _X) / (2 * Math.PI);
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      deviceType: 'pcType'
    })
    this.getDeviceList();
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
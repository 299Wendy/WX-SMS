var app = getApp()
var that = this;
Page({
  
  data:{
    todolist: [],    
    completedList: [],
    procID:1,
    pagename:'',
    ProcInfo:[],
    show: 'todolist',
    inImg: '../../images/in1.png',
    outImg: "../../images/out1.png",
    quickImg:"../../images/in-out1.png"    
  },
  onPullDownRefresh: function () {
    wx.stopPullDownRefresh()
    that.onShow()
  },
  onShow: function () {
    var page = this;
    wx.showLoading({
      title: '加载中...',
      mask: true
    })
    wx.request({
      url: getApp().globalData.host +"/getProclist",
      data: {
        access_token: getApp().globalData.token
      },
      method: "POST",
      header: {
        'content-type': 'application/json; charset=utf-8"'
      },
      success: function (res) {
        var list = res.data.ret;   
        wx.hideLoading()
        page.setData({
          completedList: list.completedList,
          todolist: list.procList
        })    
      }
    })
},

  changeViewType: function(e) {
    var data = e.currentTarget.dataset
    this.setData({
      show: data.type
    })    
  },
  //////左滑删除
  touchS: function (e) {  // touchstart
    let startX = App.Touches.getClientX(e)
    startX && this.setData({ startX })
  },
  touchM: function (e) {  // touchmove
    let itemData = App.Touches.touchM(e, this.data.itemData, this.data.startX)
    itemData && this.setData({ itemData })

  },
  touchE: function (e) {  // touchend
    const width = 150  // 定义操作列表宽度
    let itemData = App.Touches.touchE(e, this.data.itemData, this.data.startX, width)
    itemData && this.setData({ itemData })
  },//////
//////删除/////
  itemDelete:function(e){
  var that = this
  var i = e.currentTarget.dataset.index  
  var processID = that.data.todolist[i].ProcessID
  that.setData({ procID: processID })
  that.getProcInfoByProcId(processID)
  console.log(that.data.procID)
  console.log(that.data.ProcInfo)
  wx.showActionSheet({
     itemList: ['删除'],
     success: function (res) {
       
       setTimeout(function () {
         that.confirmDelete()        
       }, 2500)    
       
     }  
   })
 
 },
  ///确认删除
  confirmDelete: function () {  // itemDelete
    console.log(1)
    var that = this;
    wx.showLoading({
      
      mask: true
    })

    for (var i = 0; i < that.data.ProcInfo.length; i++) {
      that.data.ProcInfo[i].processstatus = '完成'
    }
    that.setData({
      ProcInfo: that.data.ProcInfo
    })
    
    wx.request({
      url: getApp().globalData.host + "/deleteProc",
      data: {
        mydata:
        {
          "ProcId": that.data.procID,
          "ProcInfo": that.data.ProcInfo,
        },
        access_token: getApp().globalData.token
      },

      method: "POST",
      header: {
        'content-type': 'application/json; charset=utf-8"'
      },
      success: function (res) {
        wx.hideLoading()
        that.isSuccess()
        that.onShow()
      }
    })   
   
  },


  getProcInfoByProcId: function (ProcId) {
    var page = this
     wx.request({
      url: getApp().globalData.host + "/getProcInfo",
      data: {
        ProcId: ProcId,
        PageName: this.data.pagename,
        access_token: getApp().globalData.token,
      },
      method: "POST",
      header: {
        'content-type': 'application/json; charset=utf-8"'
      },
      success: function (res) {
        var list = res.data.ret;
        page.setData({
          ProcInfo: list.ProcInfo
        })
      }
    
    })
      },

  isSuccess: function () {
    var that = this;
    that.setData({

    })
    wx.showToast({
      title: '成功',
      icon: 'success',
      duration: 900
    })
    setTimeout(function () {
      
      }, 800)


  },


  
})
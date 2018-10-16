const util = require('../../utils/util.js')
var app = getApp()
var sendercode; // 用于存储发送码
Page({
  data: {
    pagename:'待办事宜',
    buttonVisible: true,    
    ProcessID:1,
    ProcessStatus:'',
    ProcessType:"",
    Applyer:'',
    Imgflg:false,
    location:'',
    index:0,    
    ProcInfo:[],  
    hiddenEditbuttom:true,
    hidden_rejectComfirm: true,
    hidden_approveComfirm:true,
    hidden_editApply:true,
    editImg: "../../images/editbutton.png",
    sampleimg: '../../images/camera.jpg',
    view_sampleInfo: false,
    sampleInfo:
    {
      index: 0,
      displayname: '',
      productcategory: '',
      owner: '',
      location: '',
      status: '',
      samplesource: '',
      sampleDest: '',
      sampleUseage: '',
      barcode: '',
      register: '',
      updatetime: '',
      registtime: ''
    },

  },
  //首次渲染页面，获取procInfo

  onLoad: function (option) {
    this.setData({
      ProcessID: option.ProcessID,
      ProcessStatus: option.ProcessStatus,
      ProcessType : option.ProcessType,
      Applyer: option.Applyer
    })
    wx.showLoading({
      title: '加载中...',
      mask: true
    })
    this.showFlag()
    var page = this;
    wx.request({
      url: getApp().globalData.host + "/getProcInfo",
      data: {        
        ProcId: this.data.ProcessID,
        PageName: this.data.pagename,
        access_token: getApp().globalData.token,
      },
      method: "POST",
      header: {
        'content-type': 'application/json; charset=utf-8"'
      },
      success: function (res) {
        var list = res.data.ret;
        
        wx.hideLoading()
        page.setData({
          ProcInfo: list.ProcInfo,
          sampleUseage: list.sampleUseage,
          sampleDest: list.sampleDest
        })
      }
    
    })

 
  },
  showFlag:function()
  {
    if ((this.data.ProcessType == "入库") && (app.globalData.UserInfo.Role == "Admin")) {
      this.setData({
        Imgflg: true
      })
    }
    else {
      this.setData({
        Imgflg: false
      })
    }
    if (this.data.ProcessStatus == "完成") {
      this.setData({
        pagename: "已完成出入库"
      })
    }
    else {
      this.setData({
        pagename: ""
      })
    }

    if ((this.data.ProcessStatus == "完成") || (app.globalData.UserInfo.Role == "QAPL")) {
      this.setData({
        buttonVisible: false
      })
    }
    else if ((this.data.ProcessType == "入库") && (app.globalData.UserInfo.Role == "TL")) {
      this.setData({
        buttonVisible: false
      })
    }
    else if ((this.data.ProcessStatus == "出库申请") && (app.globalData.UserInfo.Role == "Admin")) {
      this.setData({
        buttonVisible: false
      })
    }

    else if ((this.data.ProcessStatus == "申请已批准") && (app.globalData.UserInfo.Role == "TL")) {
      this.setData({
        buttonVisible: false
      })
    }
    else if (this.data.ProcessStatus == "申请未批准") {
      this.setData({
        buttonVisible: false
      })
    }
    else {
      this.setData({
        buttonVisible: true
      })

    }
  },
  edit: function (e) {
    this.setData({
      hiddenEditbuttom: false,
      index: e.currentTarget.dataset.index,
	    location:'',
    })
    
  },
  //取消/隐藏模态框
  hideModal: function () {
    this.setData({
      hiddenEditbuttom: true,
      hidden_approveComfirm: true,
      hidden_rejectComfirm: true,
      hidden_editApply:true,
      view_sampleInfo: false
      })
  },

  approve: function( ){
    this.setData({
      hidden_approveComfirm: false,     
    })    
  },

  locationInput:function(e){   
    this.setData({
      location: e.detail.value,
    
    })  
  
   },

  reject: function(){
    this.setData({  
      hidden_rejectComfirm: false,
    })  
  },
 
  //确认提交
  editSubmit: function () {
    var that = this
    var i = that.data.index
    if (that.data.location.trim() == "") {
      wx.showModal({
        title: '请输入位置',
        showCancel: false
      })
      return false
    }
    that.data.ProcInfo[i].location = that.data.location
    that.setData({
      ProcInfo: that.data.ProcInfo,
      hidden_editApply:false,
      hiddenEditbuttom: true,
    })
   
  },
  //
  editApply:function(){
    var that = this
    var i = that.data.index
    for (var j = i; j < that.data.ProcInfo.length; j++) {
      that.data.ProcInfo[j].location = that.data.location
    }
    that.setData({
      ProcInfo: that.data.ProcInfo,
    })
    wx.showToast({
      title: '成功',
      icon: 'success',
      duration: 800
    })
    setTimeout(function () {
      that.hideModal();
    }, 500)

  },
  // 

  isSuccess:function(){
    var that = this;
    that.setData({
     
      })
    wx.showToast({
      title: '成功',
      icon: 'success',
      duration: 900
    })
    setTimeout(function () {
      that.hideModal();
      wx.switchTab({
        url: '../../pages/notice/notice',
      })  
    }, 800)

    
  },
//approve流程
  requestApprove: function () {
    wx.showLoading({
      mask: true
    })
   var that = this 
 // that.data.ProcInfo.forEach(function (v, i) {
   //  v.editflg = "1";
   //})
   if (that.data.ProcInfo.length < 1) {
     wx.showModal({
       title: '无法处理空流程',
       showCancel: false
     })
     wx.hideLoading()
     that.setData({
       hidden_approveComfirm:true
     })
     return;
  
   }

   if (app.globalData.UserInfo.Role == "TL") {
     this.TLApprove();
   }
   else {
     this.AdminApprove();
   }  
   
  },
  TLApprove:function()
  {
    var that = this;
    for (var i = 0; i < that.data.ProcInfo.length;i++)
    {
       that.data.ProcInfo[i].processstatus='申请已批准'
    }
    that.setData({
      ProcInfo: that.data.ProcInfo
    })
    wx.request({
      url: getApp().globalData.host+"/TLapproveProc",
      data: {
        mydata:
        {
          "ProcId": that.data.ProcessID,
          "ProcInfo":that.data.ProcInfo,
        },
        access_token: getApp().globalData.token
      },
      
      method: "POST",
      header: {
        'content-type': 'application/json; charset=utf-8"'
      },
      success:function(res) {
        that.hideModal();
        that.setData({
          buttonVisible:false
        }) 
        that.isSuccess()
      }
    })   
  },
  AdminApprove: function ()
   {
    var that = this
    if (that.data.ProcessType == '入库') {
      for (var i = 0; i < that.data.ProcInfo.length; i++) {
        if ((that.data.ProcInfo[i].location == '') || (that.data.ProcInfo[i].location == null) || (that.data.ProcInfo[i].location == 'None')) {
          wx.showModal({
            title: '请编辑货架信息再入库',
            showCancel: false
          })
          wx.hideLoading();
          that.hideModal();
          return;
        }
      }
      for (var i = 0; i < that.data.ProcInfo.length; i++) {
        that.data.ProcInfo[i].processstatus = '完成';
        that.data.ProcInfo[i].status = '已入库';
      }
    }
    else {   
      for (var i = 0; i < that.data.ProcInfo.length; i++) {
        that.data.ProcInfo[i].location = '';
        that.data.ProcInfo[i].processstatus = '完成';
        that.data.ProcInfo[i].status = '已出库'
      }
    }
 
  that.setData({
   ProcInfo: that.data.ProcInfo
    })

  wx.request({
    url: getApp().globalData.host + "/approveProc",
    data: {
      mydata:
      {
        "ProcId": that.data.ProcessID,
        "ProcInfo": that.data.ProcInfo,
        "ProcType": that.data.ProcessType
      },
      access_token: getApp().globalData.token
    },

    method: "POST",
    header: {
      'content-type': 'application/json; charset=utf-8"'
    },
    success: function (res) {
      that.hideModal();
      that.setData({        
        buttonVisible: false
      }) 
      that.isSuccess()

      }
  }) },
  requestReject: function () {
    var that = this
    wx.showLoading({
      mask: true
    })

    for (var i = 0; i < that.data.ProcInfo.length; i++) {
      that.data.ProcInfo[i].processstatus = '申请未批准';
    }
    that.setData({
      ProcInfo: that.data.ProcInfo
    })
  //  console.log(that.data.ProcInfo)
    wx.request({
      url: getApp().globalData.host + "/rejectProc",
      data: {
        mydata:
        {
          "ProcId": that.data.ProcessID,
          "ProcInfo": that.data.ProcInfo        
        },
        access_token: getApp().globalData.token
      },

      method: "POST",
      header: {
        'content-type': 'application/json; charset=utf-8"'
      },
      success: function (res) {
        wx.hideLoading()
        that.setData({
          buttonVisible: false
        })
        wx.showToast({
          title: '驳回成功',          
          duration: 900
        })
        setTimeout(function () {
          that.hideModal();
          wx.switchTab({
            url: '../../pages/notice/notice',
          })
        }, 800)
      }
    }
    
    )

  },
  getSample(e) {
   // console.log(e)
   // console.log(this.data.sampleInfo)
    var val = e.currentTarget.dataset.value
    this.data.sampleInfo.productcategory = val.productcategory
    this.data.sampleInfo.displayname = val.displayname
    this.data.sampleInfo.location = val.location
    this.data.sampleInfo.owner = val.owner
    this.data.sampleInfo.register = val.register
    this.data.sampleInfo.sampleDest = val.sampleDest
    this.data.sampleInfo.sampleUseage = val.sampleUseage
    this.data.sampleInfo.barcode = val.barcode
    this.data.sampleInfo.status = val.status
   // console.log(this.data.sampleInfo)
    this.getImg(val.barcode)
    this.getSampletimeinfo(val.barcode);
    this.setData({
      view_sampleInfo: true,
      sampleInfo: this.data.sampleInfo
    })

  },
  //获取样品图片
  getImg: function (barcode) {
    var obj = this;
    wx.request({
      url: getApp().globalData.host + "/getImg",
      method: "POST",
      header: {
        'content-type': 'application/json'
      },
      data: {
        "barcode": barcode
      },
      success: res => {
      //  console.log(res.data.ret)
        var imgurl = res.data.ret
        if (res.data.ret != -1) {
          obj.setData({
            sampleimg: imgurl
          })

        }
        else {
          obj.setData({
            sampleimg: '../../images/camera.jpg'
          })
        }

      }
    })
  },


  getSampletimeinfo: function (barcode) {
    var obj = this;
    wx.request({
      url: getApp().globalData.host + "/getSampletimeinfo",
      method: "POST",
      header: {
        'content-type': 'application/json'
      },
      data: {
        "barcode": barcode
      },
      success: res => {
       
        var data = res.data.ret
     //   console.log(data)
        if (data == -1) {
          obj.data.sampleInfo.updatetime = 'none';
          obj.data.sampleInfo.registtime = 'none';
          
           obj.setData({
             sampleInfo: obj.data.sampleInfo
           })
           
        }
        else {
          obj.data.sampleInfo.registtime = data[0]
          if (data[1] != '') {
            obj.data.sampleInfo.updatetime = data[1]
          }
          else {
            obj.data.sampleInfo.updatetime = '未在该系统办理出入库'
          }
          
          obj.setData({
            sampleInfo: obj.data.sampleInfo
          })
        }

      }

    })

  },
///////////////////////////////
  addTrolley:function()
  {
    if (this.data.ProcessType == '入库') {
      wx.redirectTo({
        url: '../checkin/checkin?ProcInfo=' + this.data.ProcInfo

      })
          }
     
    else {
      wx.redirectTo({
        url: '../checkout/checkout?ProcInfo=' + this.data.ProcInfo

      })
     
    }

  },
})
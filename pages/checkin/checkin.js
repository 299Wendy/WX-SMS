const util = require('../../utils/util.js')

Page({
  data: {
    searchPickArray: ["产品名称", "产品类别", "库存状态", "代管人", "登记人", "Barcode"],
    searchValue: ['name', 'category', 'status', 'owner', 'register', 'barcode'],
    checkinTrolleyList: [],
    pickIndex: 0,
    searchInput:'',
    saerchAmout: '',
    TrolleyNumber:'',
    sampleUseage: '',
    sampleDest: '',
    modalMessage:'',
    popupMessage:'',
    scanImage: "../../images/add.png",
    addToTrolley: "../../images/addmini.png",
    checkedMark: "../../images/checkedMark.png",
    deleteFromTrolley: "../../images/delete_64_64.png",
    trolleyImage: "../../images/trolley_add.png",
    showSearchResult:false,
    showSearchAmount:false,
    twoNum: false,
    fixHeight:false,
    showTrolley: false,
    searchList:[],
    hiddenSampleUsage: true,
    hiddenCheckInComfirm:true,
    hiddenFinalComfirm: true,
    hiddenModalMessage:true,
    hiddenpopupMessage:true
  },
  //picker的变动函数 
  searchOptionChangeEvent: function (e) {
    this.setData({
      pickIndex: e.detail.value
    })
  },
  
  search1:function(){
    this.setData({
      showSearchResult: true,
      showSearchAmount: true,
      saerchAmout: this.data.searchList.length,
    })
  },
  //样品列表后面点击添加函数
  changeButtonImage: function (e) {
    var tempsearchList = this.data.searchList
    //删除购物车
    if (this.data.searchList[e.target.dataset.index].ImgFlag) {
      var index = this.getIndexFromTrolleyByBarcode(this.data.searchList[e.target.dataset.index].barcode)
      this.data.checkinTrolleyList.splice(index, 1)
      tempsearchList[e.target.dataset.index].ImgFlag = false
      this.setData({
        searchList: tempsearchList,
        checkinTrolleyList: this.data.checkinTrolleyList
      })
    } else { //加入购物车
      this.data.checkinTrolleyList.push(this.data.searchList[e.target.dataset.index])
      tempsearchList[e.target.dataset.index].ImgFlag = "true"
      this.setData({
        searchList: tempsearchList,
        checkinTrolleyList: this.data.checkinTrolleyList
      })
    }
    this.setTrolleyNum();
    this.judgeTrolleyNumber();
  },
  //入库车中删除样品函数
  deleteSample: function (e) {
    var tempCheckinList = this.data.searchList
    this.data.checkinTrolleyList.splice(e.target.dataset.index, 1)
    for (var i = 0; i < tempCheckinList.length; i++) {
      if (tempCheckinList[i].barcode == e.target.dataset.barcode) {
        tempCheckinList[i].ImgFlag = false
      }
    }
    this.setData({
      searchList: tempCheckinList,
      checkinTrolleyList: this.data.checkinTrolleyList
    })
    this.setTrolleyNum();
    this.judgeTrolleyNumber();
  },
  //输入框实时赋值
  searchBindInput: function (e) {
    this.setData({
      searchInput: e.detail.value
    })
  },
  sampleUseageBindInput:function(e){
    this.setData({
      sampleUseage: e.detail.value
    })
  },
  sampleDestBindInput:function(e){
    this.setData({
      sampleDest: e.detail.value
    })
  },
  //清空购物车
  clearTrolley: function () {
    var tempCheckinList = this.data.searchList
    for (var i = 0; i < tempCheckinList.length; i++) {
      tempCheckinList[i].ImgFlag = false
    }
    this.setData({
      searchList: tempCheckinList,
      checkinTrolleyList: []
    })
    this.setTrolleyNum();
    this.judgeTrolleyNumber();
  },
  //点击申请入库
  checkIn: function () {
  if (this.data.checkinTrolleyList.length < 1) {
    this.showTheModal("购物车无样品，请添加！")
    return false
   }
  else{
    this.setData({
    hiddenCheckInComfirm: false
  })
  }
  },
  //点击快速出入库
  fastApply: function () {
  if (this.data.checkinTrolleyList.length < 1) {
    this.showTheModal("购物车无样品，请添加！")
    return false
  }
  else {
  this.setData({
    hiddenSampleUsage: false
  })}
  },
  //取消/隐藏模态框
  hideModal: function () {
    this.setData({
      hiddenSampleUsage: true,
      hiddenFinalComfirm: true,
      hiddenCheckInComfirm:true
    })
  },
  hidePopUp: function () {
    this.setData({
      hiddenModalMessage: true
    })
  },
  PopUp: function () {
    this.setData({
      hiddenSampleUsage: false,
      hiddenpopupMessage: true
    })
  },
  //确定入库（提交请求到server）
  confirmCheckIn:function(){
    var that = this
    this.data.checkinTrolleyList = this.emptyTouchDel(this.data.checkinTrolleyList)
    wx.showLoading({
      title: 'Loading...',
      mask: true
    })
    wx.request({
      url: getApp().globalData.host + '/createProc',
      method: "POST",
      header: {
        'content-type': 'application/json'
      },
      data: {
        access_token: getApp().globalData.token,
        mydata: {
          TrolleyList: this.data.checkinTrolleyList,
          ProcType: "入库",
          sampleUseage: '',
          sampleDest: ''
        }
      },
      success: function (res) {
        wx.hideLoading()
        that.submitSuccessAction()
      }
    })
  },
  //提交快速出入库
  submitFastApply:function(){
    var that = this
    if (this.data.sampleUseage.trim() == "") {
      this.showTheText('请输入样品用途!')
      return false
    }
    if (this.data.sampleDest.trim() == "") {
      this.showTheText('请输入样品去处!')
      return false
    }
    this.setData({
      hiddenSampleUsage: true,
      hiddenFinalComfirm: false
    })
  },
  //确定快速出入库（提交请求到server）
  confimFastApply:function(){
    this.data.checkinTrolleyList = this.emptyTouchDel(this.data.checkinTrolleyList)
    var that = this
    wx.showLoading({
      title: 'Loading...',
      mask: true
    })
    wx.request({
      url: getApp().globalData.host + '/createProc',
      method: "POST",
      header: {
        'content-type': 'application/json'
      },
      data: {
        access_token: getApp().globalData.token,
        mydata: {
          TrolleyList: this.data.checkinTrolleyList,
          ProcType: "快速出入库",
          sampleUseage: this.data.sampleUseage,
          sampleDest: this.data.sampleDest
        }
      },
      success: function (res) {
        wx.hideLoading()
        that.submitSuccessAction()
      }
    })
  },
  //提交请求完成后的函数
  submitSuccessAction:function(){
    //2个输入框清空,搜索结果和购物车
    this.setData({
      sampleUseage: '',
      sampleDest: '',
      searchList: [],
      checkinTrolleyList: [],
      showTrolley: false,
      showSearchAmount: false,
      showSearchResult:false
    })
    this.setTrolleyNum();
    this.judgeTrolleyNumber();
    wx.showToast({
      title: '成功',
      icon: 'success',
      duration: 2000
    })
    this.hideModal();
  },
  //根据变量弹出提示框
  showTheModal: function (title) {
    this.setData({
      modalMessage: title,
      hiddenModalMessage: false,
    })
  },
  showTheText: function (title) {
    this.setData({
      popupMessage: title,
      hiddenSampleUsage: true,
      hiddenpopupMessage: false
    })
  },

  //搜索入库样品函数
  search: function () {
    var that = this
    var searchOption = this.data.searchValue[this.data.pickIndex];
    var searchWord = util.trim(this.data.searchInput)
    if (searchWord.length == 0) {
      this.showTheModal("搜索内容不能为空！")
      return false;
    }
    wx.showLoading({
      title: '搜索中...',
      mask:true
    })
    wx.request({
      url: getApp().globalData.host + '/searchSample',
      method: "POST",
      header: {
        'content-type': 'application/json'
      },
      data: {
        access_token: getApp().globalData.token,
        searchOption: searchOption,
        search_word: searchWord
      },
      success: function (res) {
        wx.hideLoading()
        that.setValueForSearchList(res.data.ret)
      }
    })
  },

  //动态显示checkinTrolleyList的长度
  setTrolleyNum: function () {
    this.setData({
      TrolleyNumber: this.data.checkinTrolleyList.length
    })
  },
  //根据barcode返回购物车的INDEX
  getIndexFromTrolleyByBarcode: function (barcode) {
    for (var i = 0; i < this.data.checkinTrolleyList.length; i++) {
      if (this.data.checkinTrolleyList[i].barcode == barcode) {
        return i;
        break;
      }
    }
  },
  //判断购物车数字，用来调整位置
  judgeTrolleyNumber: function () {
    if (this.data.TrolleyNumber < 10) {
      this.setData({
        twoNum: false
      })
    } else {
      this.setData({
        twoNum: true
      })
    }
    if (this.data.TrolleyNumber > 4) {
      this.setData({
        fixHeight: true
      })
    } else {
      this.setData({
        fixHeight: false
      })
    }
  },
  //点击购物车
  showTrolleyList: function () {
    this.setData({
      showTrolley: !this.data.showTrolley
    })
  },
  hideTrolley: function () {
    this.setData({
      showTrolley: false
    })
  },
  //把DB返回的数据赋值 给searchlist数组
  setValueForSearchList: function (data) {
    var tempList = [];
    var showNotice = false;
    for (var i = 0; i < data.length; i++) {
      if ((data[i].status != "已入库") && (data[i].processstatus == '完成')) {
        tempList.push(data[i]);
      }
    }
    var resultLength = tempList.length;
    if (resultLength > 200) {
      tempList = tempList.slice(0, 200)
      showNotice = true;
    }
    for (var i = 0; i < tempList.length; i++) {
      tempList[i].ImgFlag = false;
      tempList[i].showTouchDel = false;
      for (var j = 0; j < this.data.checkinTrolleyList.length;j++){
        if (tempList[i].barcode == this.data.checkinTrolleyList[j].barcode){
          tempList[i].ImgFlag = true;
          break;
        }
      }
    }
    this.setData({
      searchList: tempList,
      saerchAmout: tempList.length,
      showSearchAmount: true,
      showSearchResult:true
    })
    if (showNotice) {
      this.showTheModal("查询总数:" + resultLength + "条,只显示前200条数据！")
    }
  },
  //根据barcode在后台搜索并且加入购物车
  addToTrolleyByBarcode:function(barcode){
    var that = this
    var tempTrolley = this.data.checkinTrolleyList
    wx.showLoading({
      title: 'Loading...',
      mask: true
    })
    wx.request({
      url: getApp().globalData.host + '/addSample',
      method: "POST",
      header: {
        'content-type': 'application/json'
      },
      data: {
        barcode: barcode,
      },
      success: function (res) {
        wx.hideLoading()
        if (res.data.ret.length != 0){
          res.data.ret[0].showTouchDel = false;
          if (res.data.ret[0].processstatus != '完成'){
            that.showTheModal('该样品流程未结束，不能申请入库！')
            return false
          }
          if (res.data.ret[0].status == '已入库'){
            that.showTheModal('该样品已在库中，不能申请入库！')
            return false
          }
          for (var i = 0; i < that.data.checkinTrolleyList.length; i++) {
            if (res.data.ret[0].barcode == that.data.checkinTrolleyList[i].barcode) {
              that.showTheModal('该样品已经在入库购物车中！')
              return false
            }
          }
          tempTrolley.push(res.data.ret[0])
          that.setData({
            checkinTrolleyList: tempTrolley
          })
          that.setTrolleyNum();
          that.judgeTrolleyNumber();
          wx.showToast({
            title: '成功加入购物车',
            icon: 'success',
            duration: 2000
          })
        }else{
          that.showTheModal('无法匹配该barcode，请联系管理员！')
        }
      }
    })

  },
takePhoto: function () {
  wx.scanCode({
    success: (res) => {
      var str = res.result.split('\r\n');
      console.log(str);
      for(var i = 0;i < str.length;i++)
      {
        if (str[i].length == 9)
        {
          this.addToTrolleyByBarcode(str[i]);
          break;
        } 
      }
      console.log('codeScan:',res.result);
    }
  })
},
//手指触摸动作开始 记录起点X坐标
touchstart: function (e) {
  //开始触摸时 重置所有删除
  this.data.checkinTrolleyList.forEach(function (v, i) {
    if (v.showTouchDel)//只操作为true的
      v.showTouchDel = false;
  })
  this.setData({
    startX: e.changedTouches[0].clientX,
    startY: e.changedTouches[0].clientY,
    checkinTrolleyList: this.data.checkinTrolleyList
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
  that.data.checkinTrolleyList.forEach(function (v, i) {
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
    checkinTrolleyList: that.data.checkinTrolleyList
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
emptyTouchDel: function (list) {
  list.forEach(function (v, i) {
    v.showTouchDel = "";
  })
  return list
},
/**
   * 生命周期函数--页面加载函数
   */
onLoad: function () {
  this.setTrolleyNum();
  this.judgeTrolleyNumber();
  //清空输入框,重置下标
  this.setData({
    pickIndex: 0,
    searchInput: '',
    showSearchAmount: false,
    sampleUseage: '',
    sampleDest: '',
  })
},
//生命周期函数--监听页面显示
  onShow: function () {
  
  }
})
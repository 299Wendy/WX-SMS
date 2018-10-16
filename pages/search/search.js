
Page({
  data:{
    searchType: ["产品名称", "产品类别", "库存状态", "代管人", "登记人", "Barcode"],
    searchValue:['name', 'category', 'status', 'owner', 'register', 'barcode'],
    searchOption:'',
    index: 0,
    showSearchAmount:false,
    hiddenModalMessage:true,
    searchList:[],
    searchInput:'',
    modalMessage: '',
    sampleimg:'../../images/camera.jpg',
    readSample: "../../images/read.png",
    isFromSearch: true,   // 用于判断searchList数组是不是空数组，默认true，空的数组  
    view_sampleInfo:false,
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
  //picker的变动函数 
  searchOptionChangeEvent: function (e) {
    this.setData({
      index: e.detail.value
    })
  }, 
  searchBindInput: function (e) {  
    this.setData({
      searchInput: e.detail.value
    })   
  },
  //搜
  search: function () {
    var that = this;
    var sList=[];//查询结果缓存
    var sLength = 0;
    that.setData({
      searchList: []
    })
    var searchOption = this.data.searchValue[this.data.index];
    var searchWord = this.trim(this.data.searchInput)
    if (searchWord.length == 0) {
      this.showTheModal("搜索内容不能为空！")
      return false;
    }
    wx.showLoading({
      title: '搜索中...',
      mask: true
    })
    wx.request({
      url: getApp().globalData.host +"/searchSample",
      method: "POST",
      header: {
        'content-type': 'application/json'
      },
      data: {
        access_token: getApp().globalData.token,
        searchOption: searchOption,
        search_word: searchWord
      },
      success: res => {
        wx.hideLoading();
        this.setValueForSearchList(res.data.ret)
      }
    })
  },
  setValueForSearchList: function(data){
    var tempList = [];
    var showNotice = false;
    var resultLength = data.length;
    if (resultLength > 200){
      tempList = data.slice(0, 200)
      showNotice = true;
    }else{
      tempList = data
    }
    this.setData({
      searchList: tempList,
      showSearchAmount: true
    })
    if (showNotice) {
      this.showTheModal("查询总数:" + resultLength + "条,只显示前200条数据！")
    }
  },
  //取消/隐藏模态框
  hideModal: function () {
    this.setData({
      hiddenModalMessage: true,
      view_sampleInfo:false
    })
  },
  //根据变量弹出提示框
  showTheModal: function (title) {
    this.setData({
      modalMessage: title,
      hiddenModalMessage: false,
    })
  },
  // 去前后空格  
  trim:function(str) {
    return str.replace(/(^\s*)|(\s*$)/g, "");
  },
  getSample(e){
  //  console.log(e)
    //console.log(this.data.sampleInfo)
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
      view_sampleInfo:true,
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
        //console.log(res.data.ret)
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
       // console.log(res.data.ret)
        var data = res.data.ret  
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

})
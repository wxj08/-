const util = require("../../utils/util");
const app = getApp()

Page({
  data:{
    choose:true
  },
  choose(){
    this.setData({
      choose:!this.data.choose
    })
  },
  onShow(){
    this.getTopBanner(); //请求顶部轮播图
    this.getZixun()//获取资讯
    setTimeout(() => {
      this.getLoveDetail()//获取表白消息
      this.getLoseDetail()//获取失物招领消息
    }, 2000);
  },
  //获取首页顶部轮播图
  getTopBanner() {
    wx.cloud.database().collection("school_zixun").where({
      isTop:true
    }).get().then(res => {
        console.log("首页banner成功", res.data)
        if (res.data && res.data.length > 0) {
          this.setData({
            banner: res.data
          })
        }
      }).catch(res => {
        console.log("首页banner失败", res)
      })
  },
   //获取资讯
   getZixun() {
    wx.cloud.database().collection("school_zixun").where({
      isTop:false
    }).get().then(res => {
        console.log("首页banner成功", res.data)
        if (res.data && res.data.length > 0) {
          this.setData({
            zixunList: res.data
          })
        }
      }).catch(res => {
        console.log("首页banner失败", res)
      })
  },
  toBannerDetail(e){
    wx.navigateTo({
      url: '/pages/index/bannerdetail/bannerdetail?id=' + e.currentTarget.dataset.id,
    })
  },
  getLoseDetail(){
    if(!app.globalData.userInfo){
      return
    }
    var that = this;
    wx.cloud.database().collection('school_loses').where({
      _openid:app.globalData.userInfo._openid
    }).get({
      success(res){

        console.log(res)
        var action = res.data
        action.time = util.formatTime(new Date(action.time))

        for(var l in action.prizeList){
          if(action.prizeList[l].openid = app.globalData.openid){
            action.isPrized = true
          }
        }

        for(var l in action.commentList){
          action.commentList[l].time = util.formatTime(new Date(action.commentList[l].time))
        }

        that.setData({
          loseAction: res.data
        })

      }
    })
  },
  getLoveDetail(){
    if(!app.globalData.userInfo){
      return
    }
    var that = this;
    wx.cloud.database().collection('school_loves').where({
      _openid:app.globalData.userInfo._openid
    }).get({
      success(res){

        console.log(res)
        var action = res.data
        action.time = util.formatTime(new Date(action.time))

        for(var l in action.prizeList){
          if(action.prizeList[l].openid = app.globalData.openid){
            action.isPrized = true
          }
        }

        for(var l in action.commentList){
          action.commentList[l].time = util.formatTime(new Date(action.commentList[l].time))
        }

        that.setData({
          loveAction: res.data
        })

      }
    })
  },
  toLoveDetail(event){

    console.log(event.currentTarget.dataset.id)

    wx.navigateTo({
      url: '/pages/detail/detail?id=' + event.currentTarget.dataset.id,
    })

  },
  toLoseDetail(event){

    console.log(event.currentTarget.dataset.id)

    wx.navigateTo({
      url: '/pages/detail2/detail2?id=' + event.currentTarget.dataset.id,
    })

  },
  toPaotui(){
    wx.navigateTo({
      url: '/pages/paotui/paotui',
    })
  }
})

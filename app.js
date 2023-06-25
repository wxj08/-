// app.js
App({
  onLaunch() {
    wx.cloud.init({
      env:'bcbdy-3gj5jsx126e4beb4', //这里替换成你自己的云开发环境id
      traceUser: true,
    })

    var that = this;
    wx.cloud.callFunction({
      name:'getOpenid',
      success(res){
        console.log(res)
        that.globalData.openid = res.result.openid
      }
    })


    if(wx.getStorageSync('userInfo')){
      this.globalData.userInfo = wx.getStorageSync('userInfo')
      this.getUserinfo()
    }
    
  },
  getUserinfo(){
    //获取用户的openid
    var that = this;
    wx.cloud.callFunction({
      name:'getOpenid',
      success(res){
        console.log(res)
        that.globalData.openid = res.result.openid

        //查找数据库用户表里面是否有这个用户记录
        wx.cloud.database().collection('school_users').where({
          _openid: res.result.openid
        }).get({
          success(result){

            console.log(result)
            that.globalData.userInfo = result.data[0]
            wx.setStorageSync('userInfo', result.data[0])
          }
        })

      }
    })
  },
  globalData: {
    userInfo: null,
    openid:null
  }
})


// 合并一个页面 然后加个搜索


// {
//   "selectedIconPath": "image/like_yes.png",
//   "iconPath": "image/like_no.png",
//   "pagePath": "pages/like/like",
//   "text": "表白墙"
// },
// {
//   "selectedIconPath": "image/lose_yes.png",
//   "iconPath": "image/lose_no.png",
//   "pagePath": "pages/lose/lose",
//   "text": "失物招领"
// },
// {
//   "selectedIconPath": "image/ershou_yes.png",
//   "iconPath": "image/ershou_no.png",
//   "pagePath": "pages/ershou/ershou",
//   "text": "二手闲置"
// },
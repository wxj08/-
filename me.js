var util = require("../../utils/util.js")
const app = getApp()
Page({


  data: {

  },
  
  onLoad: function (options) {
    
  },
  previewImg: function (e) {
    
    wx.previewImage({
      current: this.data.userInfo.avatarUrl,    //当前图片地址  
      //所有要预览的图片的地址集合 数组形式
      urls: [this.data.userInfo.avatarUrl],

    })
  },
  onShow(){
    setTimeout(() => {
      this.setData({
        userInfo:app.globalData.userInfo
      })
    }, 2000);
  },
  getUserProfile(e) {

    var that = this;

    wx.getUserProfile({
      desc: '用于完善用户信息', 
      success: (res) => {
        console.log(res)

        //查找数据库用户表里面是否有这个用户记录
        wx.cloud.database().collection('school_users').where({
          _openid: app.globalData.openid
        }).get({
          success(result){
            console.log(result)
            if(result.data.length!=0){
              app.globalData.userInfo = result.data[0]
              wx.setStorageSync('userInfo', result.data[0])
              that.setData({
                userInfo: result.data[0],
              })
              wx.showToast({
                icon:'none',
                title: '登录成功，请选择学校',
              })
            }else{
              wx.cloud.database().collection('school_users').add({
                data: {
                  avatarUrl:res.userInfo.avatarUrl,
                  nickName:res.userInfo.nickName,
                  time: util.formatTime(new Date())
                },
                success(res){
          
                  console.log(res)
                  wx.showToast({
                    icon:'none',
                    title: '登录成功，请选择学校',
                  })
                  //查找数据库用户表里用户记录
                  wx.cloud.database().collection('school_users').where({
                    _openid: app.globalData.openid
                  }).get({
                    success(result){
                      console.log(result)
                      app.globalData.userInfo = result.data[0]
                      wx.setStorageSync('userInfo', result.data[0])
                      that.setData({
                        userInfo: result.data[0],
                      })
                    }
                  })
                  
                }
          
              })
            }
           

          }
        })


        


      }
    })
  },
  loginOut(){
    app.globalData.userInfo = null
    this.setData({
      userInfo:null
    })
    wx.removeStorageSync('userInfo')
  },

  tobiaobai(){
    wx.navigateTo({
      url: '/pages/me/biaobai/biaobai',
    })
  }, 
  toshiwu(){
    wx.navigateTo({
      url: '/pages/me/shiwu/shiwu',
    })
  },
  toershou(){
    wx.navigateTo({
      url: '/pages/me/ershou/ershou',
    })
  },
  toChooseSchool(){
    wx.navigateTo({
      url: '/pages/me/chooseSchool/chooseSchool',
    })
  },
  toPao(){
    wx.navigateTo({
      url: '/pages/me/pao/pao',
    })
  }


})
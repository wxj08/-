const app = getApp()
Page({
  data:{
    schoolName:'',
    chooseIndex:0
  },
  chooseSchool(event){
    console.log(event.currentTarget.dataset.index)
    this.setData({
      chooseIndex:event.currentTarget.dataset.index,
      schoolName:this.data.schoolList[event.currentTarget.dataset.index].name
    })

  },
  onLoad(){
    this.setData({
      userInfo:app.globalData.userInfo
    })

    wx.cloud.database().collection('school_schools')
    .get()
    .then(res=>{

      console.log(res)
      this.setData({
        schoolList: res.data
      })
    })

  },
  getValue(e){

    console.log(e.detail.value)
    
    this.setData({
      schoolName:e.detail.value
    })


  },
  submit(){
    var that = this;
    console.log(app.globalData.userInfo._id)
    wx.cloud.database().collection('school_users').doc(app.globalData.userInfo._id).update({
      data:{
        school:that.data.schoolName
      },
      success(res){
        console.log(res)
        wx.navigateBack({
          delta: 0,
          success(res){
            wx.showToast({
              title: '提交成功！',
            })
            app.getUserinfo()
          }
        })
      }
    })
  }
})

Page({

  data: {

  },

  onLoad: function (options) {
    console.log(options.id)
    this.getBannerDetail(options.id)
  },

  getBannerDetail(bannerId){
    var that = this;

    wx.cloud.database().collection('school_zixun').doc(bannerId).get({
      success(res){
        console.log(res)
  
          that.setData({
            banner: res.data
          })

      }
    })
  },

})
const util = require("../../utils/util")

const app = getApp()

Page({
  data: {
    collectionName:'school_loves',
    type:1
  },
  chooseTab(event){
    console.log(event.currentTarget.dataset.type)
    let type = event.currentTarget.dataset.type
    if(type == 1){
      this.setData({
        type:1,
        collectionName:'school_loves'
      })
    }
    if(type == 2){
      this.setData({
        type:2,
        collectionName:'school_loses'
      })
    }
    if(type == 3){
      this.setData({
        type:3,
        collectionName:'school_ershou'
      })
    }
    if(type == 4){
      this.setData({
        type:4,
        collectionName:'school_paos'
      })
    }
    this.getActionsList()
  },


  getInputValue(e){
    console.log(e.detail.value)
    this.setData({
      inputValue:e.detail.value
    })
  },

  search(){
    var that = this // desc asc
    // 模糊搜索的话加上这个
    // .where({
    //   text: wx.cloud.database().RegExp({
    //     regexp: that.data.keyValue
    //   })
    // })
    wx.cloud.database().collection(that.data.collectionName)
    .where({
      text:wx.cloud.database().RegExp({
        regexp:that.data.inputValue,
        options:'i'
      })
    })
    .orderBy('time','desc')
    .get({
      success(res){
        console.log(res)

        //格式化时间
        var list = res.data
        for(var l in list){
          list[l].time = util.formatTime(new Date(list[l].time))
        }

        for(var l in list){
          for(var j in list[l].prizeList){

            if(list[l].prizeList[j].openid == app.globalData.openid){
              list[l].isPrized = true
            }

          }
        }



          // for(var l in list){
          //   if(list[l].commentList.length != 0){

          //     for(var j in list[l].commentList){
          //       list[l].commentList[l].time = util.formatTime(new Date(list[l].commentList[l].time))
          //     }

          //   }
          // }
        

        that.setData({
          actionsList :list
        })

      }
    })
  },






  toUserDetail(e){
    console.log(e.currentTarget.dataset.openid)
    wx.navigateTo({
      url: '/pages/zhuye/zhuye?openid=' + e.currentTarget.dataset.openid,
    })
  },
  previewImg(event){
    var that = this;
    console.log(event)
    
    wx.previewImage({
      current: event.currentTarget.dataset.src,//当前显示图片的路径
      urls: that.data.actionsList[event.currentTarget.dataset.index].images,
    })


  },
  onShow: function () {

    console.log(app.globalData.userInfo)

    var that = this;
    setTimeout(function(){
      console.log(app.globalData.openid)
      that.setData({
        myOpenid: app.globalData.openid
      })
    },2000)

    this.getActionsList()


  },
  getActionsList(){
    var that = this // desc asc
    // 模糊搜索的话加上这个
    // .where({
    //   text: wx.cloud.database().RegExp({
    //     regexp: that.data.keyValue
    //   })
    // })
    wx.cloud.database().collection(that.data.collectionName).orderBy('time','desc').get({
      success(res){
        console.log(res)

        //格式化时间
        var list = res.data
        for(var l in list){
          list[l].time = util.formatTime(new Date(list[l].time))
        }

        for(var l in list){
          for(var j in list[l].prizeList){

            if(list[l].prizeList[j].openid == app.globalData.openid){
              list[l].isPrized = true
            }

          }
        }



          // for(var l in list){
          //   if(list[l].commentList.length != 0){

          //     for(var j in list[l].commentList){
          //       list[l].commentList[l].time = util.formatTime(new Date(list[l].commentList[l].time))
          //     }

          //   }
          // }
        

        that.setData({
          actionsList :list
        })

      }
    })
  },
  toPublish(){
    if(app.globalData.userInfo == null){
      wx.showToast({
        icon:'none',
        title: '请登录',
      })
    }else {
      if(this.data.type == 1){
        wx.navigateTo({
          url: '/pages/like/publish/publish',
        })
      }
      if(this.data.type == 2){
        wx.navigateTo({
          url: '/pages/lose/publish/publish',
        })
      }
      if(this.data.type == 3){
        wx.navigateTo({
          url: '/pages/ershou/publish/publish',
        })
      }
      if(this.data.type == 4){
        wx.navigateTo({
          url: '/pages/paotui/publish/publish',
        })
      }
    }
    
  },
  toDetail(event){

    console.log(event.currentTarget.dataset.id)

    if(this.data.type == 1){
      wx.navigateTo({
        url: '/pages/detail/detail?id=' + event.currentTarget.dataset.id,
      })
    }
    if(this.data.type == 2){
      wx.navigateTo({
        url: '/pages/detail2/detail2?id=' + event.currentTarget.dataset.id,
      })
    }
    if(this.data.type == 3){
      wx.navigateTo({
        url: '/pages/detail3/detail3?id=' + event.currentTarget.dataset.id,
      })
    }
    if(this.data.type == 4){
      wx.navigateTo({
        url: '/pages/detail4/detail4?id=' + event.currentTarget.dataset.id,
      })
    }

  },

  deleteAction(event){

    if(!app.globalData.userInfo){
      wx.showToast({
        icon:'none',
        title: '请登录',
      })
      return
    }
    console.log(event.currentTarget.dataset.id)

    var that = this;
    wx.cloud.database().collection(that.data.collectionName).doc(event.currentTarget.dataset.id).remove({
      success(res){
        console.log(res)
        wx.showToast({
          title: '删除成功！',
        })
        that.getActionsList()
      }
    })

  },

  onPullDownRefresh(){

    this.getActionsList()

  },

  pirzeAction(event){
    if(app.globalData.userInfo == null){
      wx.showToast({
        icon:'none',
        title: '请登录',
      })
    }else {
      console.log(event.currentTarget.dataset.id)
      var that = this;
      wx.cloud.database().collection(that.data.collectionName).doc(event.currentTarget.dataset.id).get({
        success(res){

          console.log(res)
          var action = res.data
          var tag = false
          var index 
          for(var l in action.prizeList){
            if(action.prizeList[l].openid == app.globalData.openid){
              tag = true
              index = l
              break
            }
          }
          if(tag){
            //之前点赞过 删除点赞记录
            action.prizeList.splice(index,1)
            console.log(action)
            wx.cloud.database().collection(that.data.collectionName).doc(event.currentTarget.dataset.id).update({
              data: {
                prizeList: action.prizeList
              },
              success(res){

                console.log(res)
                that.getActionsList()

              }
            })
          }else{
            //之前未点赞  添加点赞记录
            var user = {}
            user.nickName = app.globalData.userInfo.nickName
            user.faceImg = app.globalData.userInfo.avatarUrl
            user.openid = app.globalData.openid
            action.prizeList.push(user)

            console.log(action.prizeList)
            wx.cloud.database().collection(that.data.collectionName).doc(event.currentTarget.dataset.id).update({
              data: {
                prizeList: action.prizeList
              },
              success(res){
                console.log(res)
                wx.showToast({
                  title: '点赞成功！',
                })
                that.getActionsList()
              }
            })
          }

        }
      })

    }
    

    

  },
  delteComment(event){
    var that = this;
    console.log(event.currentTarget.dataset.id)
    console.log(event.currentTarget.dataset.index)

    wx.showModal({
      title:'提示',
      content:'确定要删除此评论吗？',
      success(res){
        if(res.confirm){
          var index = event.currentTarget.dataset.index
          wx.cloud.database().collection(that.data.collectionName).doc(event.currentTarget.dataset.id).get({
            success(res){
              console.log(res)
              var action = res.data

              action.commentList.splice(index,1)
              wx.cloud.database().collection(that.data.collectionName).doc(event.currentTarget.dataset.id).update({
                data: {
                  commentList: action.commentList
                },
                success(res){
                  console.log(res)
                  wx.showToast({
                    title: '删除成功',
                  })
                  that.getActionsList()
                }
              })
            }
          })
        }else if(res.cancel){

        }
      }
    })
    



  },

  onShareAppMessage(event){

    if(event.from == 'button'){
      console.log(event.target.dataset.index)
      var index = event.target.dataset.index

      return {
        title: this.data.actionsList[index].text,
        imageUrl: this.data.actionsList[index].images[0],
        path:'pages/detail/detail?id=' + this.data.actionsList[index]._id
      }
    }
    if(event.from == 'menu'){
      return {
        title: '欢迎进入朋友圈列表',
        imageUrl: '',
        path:'pages/index/index'
      }
    }
    

  }

})

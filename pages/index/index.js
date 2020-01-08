//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    account:"G1U1",
    password:"12345678"
  },
  onLoad: function () {
 
  },
  accountFn(e){
    this.setData({ account: e.detail.value})
  },
  passwordFn(e){
    this.setData({ password: e.detail.value })
  },
  submitFu(){
    if (this.data.account === ""){
      wx.showToast({
        title: '账号不能为空',
        duration: 2000,
        icon: "none",
        mask:true
      })
      return
    }
    if (this.data.password === "") {
      wx.showToast({
        title: '密码不能为空',
        duration: 2000,
        icon:"none"
      })
      return
    }
    wx.cloud.callFunction({
      // 要调用的云函数名称
      name: 'add',
      // 传递给云函数的参数
      data: {
        password: this.data.password
      }
    }).then(res => {
      wx.clearStorageSync();
      this.setData({ encryption: res.result.getPassword})
      app.globalData.ajax("/userLogin","post",{
        userName: this.data.account,
        password:res.result.getPassword 
      },function success(res){
        if (res.code){
          wx.switchTab({
            url: '/pages/equipmentManage/equipmentManage'
          })
          wx.setStorageSync("name", res.result.user)
          wx.setStorageSync("userId", res.result.id)
          wx.setStorageSync("user",1)
          wx.setStorageSync("company", res.result.companyName)
          wx.setStorageSync("companyId", res.result.companyId)
        }else{
          wx.showToast({
            title: res.result.msg,
            duration: 2000,
            icon: "none",
            mask: true
          })
        }
      },function fail(err){
            
      })
    }).catch(err => {
      // console.log(err)
      // handle error
    })
    
    // app.globalData.ajax()
  }
})

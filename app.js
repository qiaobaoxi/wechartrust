//app.js
import './vendor/weapp-cookie/dist/weapp-cookie'
App({
  onLaunch: function () {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
    wx.cloud.init({
      traceUser: true,
    })
    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      }
    })
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
  },
  globalData: {
    userInfo: null,
    ajax(api, method,data, doSuccess, doFail){
      let companyId = wx.getStorageSync("companyId") ? wx.getStorageSync("companyId") : ""
      let name = wx.getStorageSync("name") ? wx.getStorageSync("name") : ""
      wx.request({
        url: "https://wechart.njylong.com" + api + "?sign=1" + "&companyId=" + companyId + "&name=" + name +"&wxSign=wx", //仅为示例，并非真实的接口地址
        data: data,
        header: {
          'content-type': 'application/json'
        },
        method: method,
        success(res) {
          doSuccess(res.data)
          // if (res.data.msg==2000){
          //   wx.showToast({
          //     title:  "请重新登录",
          //     duration: 2000,
          //     icon: "none",
          //     mask: true
          //   })
          //   setTimeout(()=>{
          //     wx.redirectTo({
          //       url: '/pages/index/index'
          //     })
          //   },2000)
          // }else{
          //   doSuccess(res.data)
          // }
        },
        fail: function (err) {
          doFail(err);
        }
      })
    }
  }
})
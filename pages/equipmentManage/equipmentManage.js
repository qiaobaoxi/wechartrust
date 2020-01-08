// pages/equipmentManage/equipmentManage.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    nowPage: 1,
    tableData: [],
    total: 0,
    slideButtons:[
      {
        text: '选择菜单',
        src:  '/img/select.png',
      }
    ],
    second_height:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    let This=this;
    wx.getSystemInfo({
      success: function (res) {
        console.log(res);
        // 可使用窗口宽度、高度
        console.log('height=' + res.windowHeight);
        console.log('width=' + res.windowWidth);
        // 计算主体部分高度,单位为px
        This.setData({
          // second部分高度 = 利用窗口可使用高度 - first部分高度（这里的高度单位为px，所有利用比例将300rpx转换为px）
          second_height: res.windowHeight - res.windowWidth / 750 * 80
        })
      }
    })
    this.getAllMenu();
  },
  
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  getAllMenu(){
      let This = this;
    app.globalData.ajax("/wxGetAllMenuByPage", "get", {
        nowPage: this.data.nowPage,
        userId: wx.getStorageSync("userId")
      }, function success(res) {
        if (res.code === 1) {
          This.data.tableData.push(...res.result.result)
          console.log(This.data.tableData)
          This.setData({ tableData: This.data.tableData, total: res.result.count });
        } else {
          console.log(res.result)
          wx.showToast({
            title: res.result,
            duration: 2000,
            icon: "none",
            mask: true
          })
        }
      }, function fail(err) {

      })
  },
  slideButtonTap(e){
     console.log(1111)
  },
  scroll(e){
    if (this.data.nowPage < Math.ceil(this.data.total/10)){
      this.setData({ nowPage: this.data.nowPage+1})
      this.getAllTwoLevelMenu();
    }
  },
  munuInfo(e){
    let n=0;
    for (let item of this.data.tableData){
      if (item.id === e.currentTarget.dataset.id){
        wx.navigateTo({
          url: '/pages/teoLevelMenuInfo/teoLevelMenuInfo?id='+item.id,
        })
        n=1;
        break;
      }
    }
    if(n===0){
      wx.showToast({
        title: "该数据不存在，可能已删除",
        duration: 2000,
        icon: "none",
        mask: true
      })
    }
  }
})
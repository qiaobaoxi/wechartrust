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
    isShow:"none",
    border:"ulBorder",
    isOp:1,
    turn:"turndown",
    second_height: 0,
    title:"",
    selectEquipments:new Array(),
    saveSelectEquipments: new Array(),
    selectListShow:"none",
    optionValue:"请选择（可多选）",
    selectOptionVale:[],
    id:0,
    menuId:0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (e) {
    let This = this;
    wx.getSystemInfo({
      success: function (res) {
        console.log(res);
        // 可使用窗口宽度、高度
        console.log('height=' + res.windowHeight);
        console.log('width=' + res.windowWidth);
        // 计算主体部分高度,单位为px
        This.setData({
          // second部分高度 = 利用窗口可使用高度 - first部分高度（这里的高度单位为px，所有利用比例将300rpx转换为px）
          second_height: "100vh"
        })
      }
    })
    app.globalData.ajax("/getAllTwoLevelMenu", "get", {
      nowPage: this.data.nowPage,
      menuId: e.id
    }, function success(res) {
      if (res.code === 1) {
        This.setData({ tableData: res.result.result, total: res.result.count, menuId: e.id})
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
 
  slideButtonTap(e) {
    console.log(1111)
  },
  munuInfo(e) {
    
  },
  equipmentInfo(e){
    wx.navigateTo({
      url: `/pages/equipmentInfo/equipmentInfo?menuId=${this.data.menuId}&engineerNumValue=${e.currentTarget.dataset.index}&twoLevelMenuId=${e.currentTarget.dataset.id}`
    })
  }
})
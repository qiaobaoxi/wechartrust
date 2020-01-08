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
    isShow: "none",
    isOp: 1,
    border: "ulBorder",
    slideButtons: [
      {
        text: '选择菜单',
        src: '/img/edit.png',
      }
    ],
    slideButtons1: [
      {
        text: '选择菜单',
        src: '/img/edit1.png',
      }
    ],
    second_height: 0,
    projectTitle: "修改工程",
    name: "",
    areaNum:"",
    resetName: "",
    resetAreaNum:"",
    editId: 0,
    menuId:0
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
          second_height: res.windowHeight - res.windowWidth / 750 * 80
        })
      }
    })
    this.setData({ menuId: e.id})
    this.getAllTwoLevelMenu(e.id);
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
  getAllTwoLevelMenu(menuId) {
    let This = this;
    app.globalData.ajax("/getAllTwoLevelMenuByMenuId", "get", {
      menuId: menuId,
    }, function success(res) {
      if (res.code === 1) {
        This.data.tableData = res.result;
        for (let i = 0; i < This.data.tableData.length;i++){
          This.data.tableData[i].index=(i+1).toString().padStart(4,'0');
        }
        This.setData({ tableData: This.data.tableData})
      } else {
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
  slideButtonTap(e) {
    let name = "";
    let areaNum = "";
    if (e.currentTarget.dataset.id) {
      for (let item of this.data.tableData) {
        if (e.currentTarget.dataset.id === item.id) {
          name = item.name;
          areaNum = item.equpmentNumOfArea
          break;
        }
      }
      this.setData({ isShow: 'block', isOp: 1, projectTitle: "修改工程", resetName: name, resetAreaNum: areaNum, editId: e.currentTarget.dataset.id });
    } else {
      this.setData({ isShow: 'block', isOp: 1, projectTitle: "添加工程", resetName: name, resetAreaNum: areaNum});
    }
  },

  scroll(e) {
    if (this.data.nowPage < Math.ceil(this.data.total / 10)) {
      this.setData({ nowPage: this.data.nowPage + 1 })
      this.getAllTwoLevelMenu();
    }
  },
  focusName(e) {
    console.log(e);
    this.setData({ border: "ulBorder1" });
  },
  editname(e) {
    this.setData({ resetName: e.detail.value });
  },
  editareanum(e) {
    this.setData({ resetAreaNum: e.detail.value });
  },
  cancal() {
    this.setData({ isShow: 'none', isOp: 0, resetName: "", editId: "" });
  },
  save() {
    let This = this
    if (this.data.editId) {
      app.globalData.ajax("/updateTwoLevelMenu", "post", {
        id: this.data.editId,
        name: this.data.resetName,
        equpmentNumOfArea: this.data.resetAreaNum,
        userId: wx.getStorageSync("userId")
      }, function success(res) {
        if (res.code === 1) {
          wx.showToast({
            title: "修改成功",
            duration: 2000,
            icon: "none",
            mask: true
          })
          This.setData({ isShow: 'none', isOp: 0 });
          This.getAllTwoLevelMenu(This.data.menuId);
        } else {
          wx.showToast({
            title: res.result.msg,
            duration: 2000,
            icon: "none",
            mask: true
          })
        }
      }, function fail(err) {

      })
    } else {
      app.globalData.ajax("/saveTwoLevelMenu", "post", {
        menuId: this.data.menuId,
        name: this.data.resetName,
        equpmentNumOfArea: this.data.resetAreaNum,
        userId: wx.getStorageSync("userId")
      }, function success(res) {
        if (res.code === 1) {
          wx.showToast({
            title: "添加成功",
            duration: 2000,
            icon: "none",
            mask: true
          })
          This.setData({ isShow: 'none', isOp: 0 });
          This.getAllTwoLevelMenu(This.data.menuId);
        } else {
          wx.showToast({
            title: res.result.msg,
            duration: 2000,
            icon: "none",
            mask: true
          })
        }
      }, function fail(err) {

      })
    }
  }
})
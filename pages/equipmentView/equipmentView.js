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
    projectTitle: "选择数据",
    name: "",
    areaNum: "",
    menuId: 0,
    selectEquipments: [],
    equipments: ["请选择"],
    isSelect:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (e) {
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
    this.getAllTwoLevelMenu();
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
  SelectEquipments(){
    this.setData({ isSelect: !this.data.isSelect})
  }, 
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },
  GetAllEquipment() {
    let This=this;
    app.globalData.ajax("/getAllEquipment", "get", {
      userId: wx.getStorageSync("userId"),
      menuId: This.data.menuId
    }, function success(result) {
      if (result.code === 1) {
        let selectEquipments = This.IsSelect(result.result, This.data.equipments);
        This.setData({ selectEquipments: selectEquipments})
      } else {
        wx.showToast({
          title: result.result,
          duration: 2000,
          icon: "none",
          mask: true
        })
      }
    }, function fail(err) {

    })
  },
  GetAllEquipmentByMenuId() {
    let This=this;
    app.globalData.ajax("/wxGetAllEquipmentByMenuId", "get", {
      menuId: This.data.menuId
    }, function success(result) {
      if (result.code === 1) {
        let equipments = [];
        for (let item of result.result) {
          equipments.push({ equipmentDataName: item.equipmentDataName, equipmentDataId: item.equipmentDataId});
        }
        This.GetAllEquipment();
        This.setData({ equipments: equipments});
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
  DeleteSelected(e){
    console.log(e);
    for (let [index,item] of this.data.equipments.entries()){
      if (item.equipmentDataId == e.currentTarget.dataset.equipmentdataid){
         this.data.equipments.splice(index,1);
         break;
      }  
    }
    let selectEquipments = this.IsSelect(this.data.selectEquipments, this.data.equipments)
    this.setData({ equipments: this.data.equipments, selectEquipments: selectEquipments})           
  },
  IsSelect(selectEquipments, equipments){
    for (let item of selectEquipments) {
      let i = 0;
      for (let it of equipments) {
        if (item.id === it.equipmentDataId) {
          i = 1
        }
      }
      if (i) {
        item.isSelect = true
      } else {
        item.isSelect = false;
      }
    }
    return selectEquipments
  },
  IsSelected(e){
    let selectEquipments = this.data.selectEquipments;
    let i = e.currentTarget.dataset.i;
    selectEquipments[i].isSelect = !selectEquipments[i].isSelect;
    let sign=-1
    for (let [index,item] of this.data.equipments.entries()){
      if (item.equipmentDataId === selectEquipments[i].id){
        sign=index;
      }
    }
    if (sign===-1){
      this.data.equipments.push({ equipmentDataId: selectEquipments[i].id, equipmentDataName: selectEquipments[i].name })
    }else{
      this.data.equipments.splice(sign,1)
    }
    this.setData({ equipments: this.data.equipments, selectEquipments: selectEquipments})
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
   addEquipment(e){
     console.log(e)
     this.setData({ isShow: 'block', isOp: 1, menuId: e.currentTarget.dataset.id, menu: e.currentTarget.dataset.name});
     this.GetAllEquipmentByMenuId();
  },
  cancal(){
    this.setData({ isShow: 'none', isOp: 0, menuId: 0, menu: "", isSelect:false});
  },
  getAllTwoLevelMenu(menuId) {
    let This = this;
    app.globalData.ajax("/getAllMenuByPage", "get", {
      nowPage: This.data.nowPage,
    }, function success(result) {
      if (result.code === 1) {
        This.data.tableData = result.result.result;
        This.data.total = result.result.count
        This.setData({ tableData: This.data.tableData, total: This.data.total})
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
 
  save() {
    let This = this
    let equipments=[];
    for(let item of this.data.equipments){
      equipments.push(item.equipmentDataId)   
    }
    app.globalData.ajax("/saveAssociatedDevice", "post", {
      menuId: this.data.menuId,
      equipments: equipments,
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
  }
})
import * as echarts from '../../components/ec-canvas/echarts';

const app = getApp();


function setOption(chart, mergeData,This) {
  let xData = [];
  let yData = [];
  let yData1 = [];
  let yData2 = [];
  let tableData = [];
  let length = mergeData[6] * mergeData[7];
  let x = mergeData[8] & 0x7f;
  let p = mergeData[11] * 256 + mergeData[10] * 1;
  let howmanydays = mergeData[11] * 256 + mergeData[10] * 1;
  let csfinish = mergeData[12] & 0xff;
  for (let i = 0; i < length; i++) {
    xData.push(i + 1)
    let yValue = (mergeData[i * 2 + 16] + mergeData[i * 2 + 17] * 256) / 100;
    if (yValue * 100 == 65535) {
      yData.push(0);
      yData2.push(0)
      yData1.push(yValue);
    } else {
      yData.push(yValue);
      yData1.push(This.getRou(yValue * 100, p, csfinish, x));
      yData2.push(This.getRou(yValue * 100, p, csfinish, x));
    }
  }
  for (let j = 0; j < mergeData[7]; j++) {
    let row = [];
    for (let k = 0; k < mergeData[6]; k++) {
      let color = "green";
      let value = yData1[j * mergeData[6] + k] * 100;
      if (value == 65535) {
        color = "#A9A9A9";
        value = 65535
      } else if (value >= 1000) {
        color = "red";
        value = 5;
      } else if (value >= 500) {
        color = "orange";
        value = 4;
      } else if (value >= 300) {
        color = "yellow";
        value = 3
      } else if (value >= 200) {
        color = "blue";
        value = 2
      } else {
        value = 1;
      }
      row.push({ value: value, color });
    }
    tableData.push(row);
  }
  console.log(tableData)
  This.setData({ tableData, howmanydays})
  const option = {
    dataZoom: [
      {
        show: true,
        realtime: true,
        start: 0,
        end: 100,
        // xAxisIndex: [0, 1]
      },
      {
        type: 'inside',
        realtime: true,
        start: 30,
        end: 70,
        // xAxisIndex: [0, 1]
      }
    ],
    tooltip: {
      trigger: 'axis'
    },
    xAxis: {
      type: 'category',
      data: xData
    },
    yAxis: [
      {
        type: 'value',
        name: '电流密度',
        axisLabel: {
          formatter: '{value}'
        }
      },
      {
        type: 'value',
        name: '截面损失率',
        axisLabel: {
          formatter: '{value}'
        }
      },
    ],
    series: [{
      data: yData,
      type: 'line',
      smooth: true
    },
    {
      data: yData2,
      yAxisIndex: 1,
      type: 'line',
      smooth: true
    }
    ]
  };
  chart.setOption(option);
}

Page({
  onShareAppMessage: res => {
    return {
      title: 'ECharts 可以在微信小程序中使用啦！',
      path: '/pages/index/index',
      success: function () { },
      fail: function () { }
    }
  },
  onLoad(e){
        let This=this;
        app.globalData.ajax("/fileExisted", "get", {
          menuId: e.menuId, 
          engineerNum: e.engineerNumValue, 
          twoLevelMenuId: e.twoLevelMenuId
        }, function success(res) {
          if (res.code === 1) {
            let areaArr=["请选择"];
            for (let item of res.result){
              areaArr.push(item.index + '  ' + (item.isExisted?'有数据':'无数据'));
            }
            console.log(areaArr)
            This.setData({ areaArr: areaArr, menuId: e.menuId, engineerNum: e.engineerNumValue});
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
  },
  onReady: function () {
    // 获取组件
    this.ecComponent = this.selectComponent('#mychart-dom-bar');
    console.log(this.ecComponent)
  },

  data: {
    ec: {
      // 将 lazyLoad 设为 true 后，需要手动初始化图表
      lazyLoad: true
    },
    mergeData:[],
    areaArr:[],
    isLoaded: false,
    isDisposed: false,
    index:0,
    menuId:0,
    date:'', 
    engineerNum:'', 
    areaNum:'',
    row:'',
    column:'',
    diameter:'', 
    passivation:'',
    howmanydays:'',
    tableData:[],
    fileName:''
  },

  // 点击按钮后初始化图表
  init: function () {
    console.log(this.data.mergeData)
    this.ecComponent.init((canvas, width, height) => {
      // 获取组件的 canvas、width、height 后的回调函数
      // 在这里初始化图表
      console.log(width, height)
      const chart = echarts.init(canvas, null, {
        width: width,
        height: height
      });
      setOption(chart, this.data.mergeData,this);

      // 将图表实例绑定到 this 上，可以在其他成员函数（如 dispose）中访问
      this.chart = chart;

      this.setData({
        isLoaded: true,
        isDisposed: false
      });

      // 注意这里一定要返回 chart 实例，否则会影响事件处理等
      return chart;
    });
  },

  dispose: function () {
    if (this.chart) {
      this.chart.dispose();
    }

    this.setData({
      isDisposed: true
    });
  },
  downloadExcel(){
    wx.showLoading({
      title: '正在下载',
    })
      if (this.data.mergeData.length===0){
        wx.showToast({
          title: "没有数据",
          duration: 2000,
          icon: "none",
          mask: true
        })
        return;
      }
      console.log("jinlaile")
      let that = this;
      this.ecComponent.canvasToTempFilePath({
      //安卓机型此处不会成功回调
      success: res => {
        let base64=wx.getFileSystemManager().readFileSync(res.tempFilePath, "base64")
        console.log(base64)
        app.globalData.ajax("/downToExcel", "post", {
          base64: base64, 
          equipmentName: that.data.fileName, 
          menuId: that.data.menuId, 
          engineerNum: that.data.engineerNum
        }, function success(res) {
          if (res.code === 1) {
            wx.hideLoading()
            wx.downloadFile({
              url: res.result.http, //仅为示例，并非真实的资源
              success(result) {
                // 只要服务器有响应数据，就会把响应内容写入文件并进入 success 回调，业务需要自行判断是否下载到了想要的内容
                if (result.statusCode === 200) {
                  var filePath = result.tempFilePath
                  console.log(1111)
                  wx.openDocument({
                    filePath: filePath,
                    success: function (res) {
                      console.log('打开文档成功')
                    }
                  })
                }
              }
            })
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
        // wx.downloadFile({
        //   url: res.tempFilePath, //仅为示例，并非真实的资源
        //   success(res) {
        //     console.log(res.tempFilePath)
        //     // 只要服务器有响应数据，就会把响应内容写入文件并进入 success 回调，业务需要自行判断是否下载到了想要的内容
        //     if (res.statusCode === 200) {
        //       wx.arrayBufferToBase64(res)
        //     }
        //   }
        // })
        // that.eventDraw(res.tempFilePath)
      },
      fail: res => console.log('失败', res)
    });
  },
  getRou(r, p, csfinish, x) {
    let lt;
    lt = p;
    lt = parseInt(lt * r);   //电流密度i带100倍来计算,dates按365倍计算

    if (lt < 10000000) {
      lt = parseInt(lt * csfinish); //alpha;  //alpha按100000倍
      lt += 150;
      lt = parseInt(lt / 365);  //dates 365倍还原
      lt += 40;
      lt = parseInt(lt / 100);  //alpha 还原1000倍,由于直径按mm除，此处要加10倍，所以用/=100
    }
    else {
      lt += 40;
      lt = parseInt(lt / 100);  //alpha 还原1000倍,由于直径按mm除，此处要加10倍，所以用/=100
      lt = parseInt(lt * csfinish);//alpha;  //alpha按100000倍
      lt += 150;
      lt = parseInt(lt / 365);   //dates 365倍还原
    }
    lt = parseInt(lt / x);
    lt = 10000 - lt;
    lt = parseInt(lt * lt);
    lt += 4000;
    lt = parseInt(lt / 10000);
    lt = 10000 - lt;  //结果为 X%%
    return lt / 100;
  },
  bindPickerChange(e){
    this.setData({
      index: e.detail.value
    })
    if (e.detail.value===0||this.data.menuId===0||this.data.engineerNum===0){
      return 
    }
    let This=this;
    app.globalData.ajax("/getEquipmentData", "get", {
      menuId: this.data.menuId, 
      engineerNum: this.data.engineerNum, 
      equpmentNumOfArea: e.detail.value
    }, function success(result) {
      if (result.code === 1) {
        let isDisposed = true;
        let data = JSON.parse(result.result.data)
        let fileName = result.result.fileName;
        // this.fileName = fileName;
        data = data.map((item) => {
          item = JSON.parse(item)
          return item;
        })
        let mergeData = []
        console.log(fileName)
        for (let item of data) {
          mergeData.push(...item);
        }
        console.log(mergeData)
        for (let i = 0; i < mergeData.length; i++) {
          mergeData[i] = parseInt(mergeData[i], 16)
        }
        let date = fileName.slice(0, 4) + "年" + fileName.slice(4, 6) + "月" + fileName.slice(6, 8) + "日" + fileName.slice(8, 10) + ":" + fileName.slice(10, 12)+"测"
        let engineerNum = fileName.slice(13, 17)
        let areaNum = fileName.slice(18, 20)
        let row = mergeData[6];
        let column = mergeData[7];
        let diameter = mergeData[8];
        let passivation = mergeData[9];
        This.setData({ mergeData: mergeData, date, engineerNum, areaNum, row, column, diameter, passivation, fileName})
        This.init();
      } else {
        wx.showToast({
          title: result.result.msg,
          duration: 2000,
          icon: "none",
          mask: true
        })
      }
    }, function fail(err) {

    })
  }
});
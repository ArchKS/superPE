import { useState } from 'react'
import { stockObj } from './assets/sData';
import ReactECharts from 'echarts-for-react';
import "./App.less"



const getSeriesItem = (name: string, pes: number[]) => {
  let sortPe = [...pes].sort((a, b) => a - b);

  let obj = {
    data: pes,
    type: 'line',
    name: name,
    smooth: true,
    markLine: {
      symbol: ['none', 'none'],//去掉箭头
      data: [{
        name: `3 level`,
        yAxis: sortPe[Math.floor(sortPe.length * 3 / 10)]
      }, {
        name: `5 level`,
        yAxis: sortPe[Math.floor(sortPe.length * 5 / 10)]
      }, {
        name: `7 level`,
        yAxis: sortPe[Math.floor(sortPe.length * 7 / 10)]
      }]
    }
  }
  return obj
}

function App() {
  const name = "双汇发展"
  let times = stockObj[name]["stockData"].map((item: any) => (new Date(item.timestamp)).toLocaleDateString());
  let pes = stockObj[name]["stockData"].map((item: any) => item.modifyPE)

  const option = {
    legend: {},
    xAxis: {
      type: 'category',
      data: times
    },
    yAxis: {
      type: 'value'
    },
    series: [getSeriesItem(name,pes)],
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross',
        crossStyle: {
          color: '#999'
        }
      }
    },
    dataZoom: [
      {
        textStyle: {
          color: '#8392A5'
        },
        handleIcon:
          'path://M10.7,11.9v-1.3H9.3v1.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4v1.3h1.3v-1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z',
        dataBackground: {
          areaStyle: {
            color: '#8392A5'
          },
          lineStyle: {
            opacity: 0.8,
            color: '#8392A5'
          }
        },
        brushSelect: true
      },
      {
        type: 'inside'
      }
    ],
  };


  return (
    <div className="App">
      <ReactECharts option={option}
        className="echart-instance"
      />
    </div>
  )
}

export default App

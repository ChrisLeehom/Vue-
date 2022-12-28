<template>
  <div class="com-container" @dblclick="revertMap"> 
    <div class="com-chart" ref="map_ref"></div>
  </div>
</template>
  
  <script>
import axios from "axios";
import {getProvinceMapInfo} from '@/utils/map_utils'
export default {
  data() {
    return {
      chartInstance: null,
      allData: null, //从服务器中获取的所有数据
      titleFotSize:0,
      mapData:{},
    };
  },
  mounted() {
    this.initChart(),
      this.getData(),
      window.addEventListener("resize", this.screenAdapter);
    this.screenAdapter();
  },
  destroyed() {
    window.removeEventListener("resize", this.screenAdapter);
  },
  computed: {
    selectTypes() {
      if (!this.allData) {
        return [];
      } else {
        return this.allData.type.filter((item) => {
          return item.key !== this.choiceType;
        });
      }
    },
    showTitle() {
      if (!this.allData) {
        return "";
      } else {
        return this.allData[this.choiceType].title;
      }
    },
    // 设置给标题的样式
    comStyle() {
      return {
        fontSize: this.titleFotSize + "px",
      };
    },
  },
  methods: {
    async initChart() {
      this.chartInstance = this.$echarts.init(this.$refs.map_ref, "chalk");
      //   获取中国地图的矢量数据
      const ret = await axios.get(
        "http://localhost:8081/static/map/china.json"
      );
      console.log(ret);
      this.$echarts.registerMap("china", ret.data);
      const initOption = {
        title: {
          text: "商家分布",
          left: 20,
          top: 20,
        },
        geo: {
          type: "map",
          map: "china",
          top: "5%",
          bottom: "5%",
          itemStyle: {
            areaColor: "#2E72BF",
            borderColor: "#333",
          },
        },
        legend: {
          left: "5%",
          bottom: "5%",
          // 让图例从上往下排列
          orient: "vertical",
        },
      };
      this.chartInstance.setOption(initOption);
      this.chartInstance.on('click',async (arg)=>{
        console.log(arg)
      const provinceInfo=  getProvinceMapInfo(arg.name)
    // 获取这个省份地图的矢量数据
    // 判断是否已经有省份数据缓存
    if(!this.mapData[provinceInfo.key]){
        const ret =await axios.get('http://localhost:8081'+provinceInfo.path)
       this.mapData[provinceInfo.key]=ret.data
      this.$echarts.registerMap(provinceInfo.key,ret.data)
    }
      
        const changeOption={
            geo:{
                map:provinceInfo.key
            }
        }
        this.chartInstance.setOption(changeOption)
    })
    },

    async getData() {
      const { data: ret } = await this.$http.get("map");
      this.allData = ret;
      // 对allData赋值
      //   const { data: ret } = await this.$http.get("map");
      console.log(this.allData);
      //   this.allData = ret;
      this.updateChart();
    },
    updateChart() {
      // 处理图标所需要的数据
      // 图例的数据
      const legendArr = this.allData.map((item) => {
        return item.name;
      });
      const seriesArr = this.allData.map((item) => {
        // 一个类别下的所有散点数据
        // 如果想在地图中显示散点的数据，我们需要给散点图标增加coordinateSystem:geo属性
        return {
          type: "effectScatter",
          //   涟漪效果
          rippleEffect: {
            scale: 5,
            brushType: "stroke",
          },
          name: item.name,
          data: item.children,
          coordinateSystem: "geo",
        };
      });
      const dataOption = {
        series: seriesArr,
        legend: { data: legendArr },
      };
      this.chartInstance.setOption(dataOption);
    },
    screenAdapter() {
      this.titleFotSize = (this.$refs.map_ref.offsetWidth / 100) * 3.6;
      const adapterOption = {
        title: {
          textStyle: {
            fontSize:this.titleFotSize,
          },
        },
        legend:{
            itemWidth:this.titleFotSize/2,
            itemHeight:this.titleFotSize/2,
            
            textStyle:{
                fontSize:this.titleFotSize/2
            }
        }
      };
      this.chartInstance.setOption(adapterOption);
      this.chartInstance.resize();
    },
    // 回到中国地图
    revertMap(){
        const revertOption={
            geo:{
                map:'china'
            }
        }
        this.chartInstance.setOption(revertOption)
    }
  },
};
</script>
  
  <style lang="less" scoped>
</style>
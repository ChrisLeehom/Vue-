<template>
  <div class="com-container">
    <div class="title" :style="comStyle">
      <span>{{ showTitle }}</span>
      <span class="iconfont title-icon" :style="comStyle" @click='isShow=!isShow'>&#xe6eb;</span>
      <div class="select-con" v-show="isShow">
        <div class="select-item" v-for="item in selectTypes" @click="handleSelect(item.key)" :key="item.key">
         {{ item.text }}
        </div>
        
      </div>
    </div>
    <div class="com-chart" ref="trend_ref"></div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      chartInstance: null,
      allData: null, //从服务器中获取的所有数据
      isShow:false,//是否显示可选项
      choiceType:'map' ,//显示的数据类型
      titleFotSize:0,
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
    selectTypes(){
        if(!this.allData){
            return []
        }else{
            return this.allData.type.filter((item)=>{
                return item.key!==this.choiceType
            })
        }
    },
    showTitle(){
        if(!this.allData){
            return''
        }else{
            return this.allData[this.choiceType].title
        }
    },
    // 设置给标题的样式
    comStyle(){
        return{
            fontSize:this.titleFotSize+'px'
        }
    }
  },
  methods: {
    initChart() {
      this.chartInstance = this.$echarts.init(this.$refs.trend_ref, "chalk");
      const initOption = {
        grid: {
          top: "25%",
          left: "3%",
          right: "4%",
          bottom: "5%",
          containLable: true, //距离是包含坐标轴上的文字的
        },
        // 工具提示
        tooltip: {
          trigger: "axis",
        },
        legend: {
          left: 20,
          top: "15%",
          icon: "circle",
        },
        xAxis: {
          type: "category",
          boundaryGap: false,
        },
        yAxis: {
          type: "value",
        },
      };
      this.chartInstance.setOption(initOption);
    },
    handleSelect(currentType){
        this.choiceType=currentType
        this.updateChart()
    },
    async getData() {
      //  await this.$http.get()
      // 对allData赋值
      const { data: ret } = await this.$http.get("trend");
      console.log(ret);
      this.allData = ret;
      this.updateChart();
    },
    updateChart() {
      // 半透明的颜色值
      const colorArr1 = [
        "rgba(11, 168, 44, 0.5)",
        "rgba(44, 110, 255, 0.5)",
        "rgba(22, 242, 217, 0.5)",
        "rgba(254, 33, 30, 0.5)",
        "rgba(250, 105, 0, 0.5)",
      ];
      // 全透明的颜色值
      const colorArr2 = [
        "rgba(11, 168, 44, 0)",
        "rgba(44, 110, 255, 0)",
        "rgba(22, 242, 217, 0)",
        "rgba(254, 33, 30, 0)",
        "rgba(250, 105, 0, 0)",
      ];
      // 处理数据
      //   类目轴数据
      const timeArr = this.allData.common.month;
      //   y轴的数据 series下的数据
      const valueArr = this.allData[this.choiceType].data;
      const seriesArr = valueArr.map((item, index) => {
        return {
          name: item.name,
          type: "line",
          data: item.data,
          // 堆叠图
          stack: this.choiceType,
          areaStyle: {
            color: new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [
              {
                offset: 0,
                color: colorArr1[index],
              },
              {
                offset: 1,
                color: colorArr2[index],
              },
            ]),
          },
        };
      });
      //   图例的数据
      const legendArr = valueArr.map((item) => {
        return item.name;
      });
      const dataOption = {
        xAxis: {
          data: timeArr,
        },
        legend: {
          data: legendArr,
        },
        series: seriesArr,
      };
      this.chartInstance.setOption(dataOption);
    },
    screenAdapter() {
      this.titleFotSize=this.$refs.trend_ref.offsetWidth/100*3.6
      const adapterOption = {
        legend:{
            itemWidth: this.titleFotSize,
            itemHeight: this.titleFotSize,
            itemGap: this.titleFotSize,
            textStyle:{
                fontSize: this.titleFotSize/2
            }
        }
      };
      this.chartInstance.setOption(adapterOption);
      this.chartInstance.resize();
    },
  },
};
</script>

<style lang="less" scoped>
.title {
  position: absolute;
  left: 20px;
  top: 20px;
  z-index: 10;
  color: white;
  .title-icon {
    margin-left: 10px;
    cursor: pointer;
  }
  .select-item{
    cursor: pointer;
  }
}
</style>
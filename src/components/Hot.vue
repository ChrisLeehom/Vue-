<template>
  <div class="com-container">
    <div class="com-chart" ref="hot_ref">1111</div>
    <span class="iconfont arr-left" :style="comStyle" @click="toLeft">&#xe6ef;</span>
    <span class="iconfont arr-right" :style="comStyle" @click="toRight">&#xe6ed;</span>
    <span class="cat-name" :style="comStyle">{{ catName }}</span>
  </div>
</template>
    
    <script>
export default {
  data() {
    return {
      chartInstance: null,
      allData: null, //从服务器中获取的所有数据
      currentIndex: 0, //当前所展示的一级分类数据
      titleFotSize: 0,
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
    catName() {
      if (!this.allData) {
        return "";
      } else {
        return this.allData[this.currentIndex].name;
      }
    },
    
    comStyle(){
        return{
            fontSize:this.titleFotSize+'px'
        }
    }
  },

  methods: {
    async initChart() {
      this.chartInstance = this.$echarts.init(this.$refs.hot_ref, "chalk");
      //   获取中国地图的矢量数据

      const initOption = {
        title: {
          text: "热销商品占比",
          left: 20,
          top: 20,
        },
        legend: {
          bottom: "5%",
          icon: "circle",
        },
        tooltip: {
          show: true,
          formatter: (arg) => {
            const thirdCategory = arg.data.children;
            let total = 0;
            thirdCategory.forEach((item) => {
              total = item.value;
            });
            let retStr = "";
            thirdCategory.forEach((item) => {
              retStr += ` ${item.name}:${
                parseInt((item.value / total) * 100) + "%"
              } <br>`;
            });
            return retStr;
          },
        },
        series: [
          {
            type: "pie",
            label: {
              show: false,
            },
            emphasis: {
              label: {
                show: true,
              },
              labelLine: {
                show: false,
              },
            },
          },
        ],
      };
      this.chartInstance.setOption(initOption);
    },

    async getData() {
      const { data: ret } = await this.$http.get("hotproduct");
      this.allData = ret;
      // 对allData赋值
      //   const { data: ret } = await this.$http.get("map");
      console.log(this.allData);
      //   this.allData = ret;
      this.updateChart();
    },
    updateChart() {
      const legendData = this.allData[this.currentIndex].children.map(
        (item) => {
          return item.name;
        }
      );
      const seriesData = this.allData[this.currentIndex].children.map(
        (item) => {
          return {
            name: item.name,
            value: item.value,
            children: item.children,
          };
        }
      );
      const dataOption = {
        series: [
          {
            data: seriesData,
          },
        ],
        legend: {
          data: legendData,
        },
      };
      this.chartInstance.setOption(dataOption);
    },
    screenAdapter() {
      this.titleFotSize = (this.$refs.hot_ref.offsetWidth / 100) * 3.6;
      const adapterOption = {
        title: {
          textStyle: {
            fontSize: this.titleFotSize,
          },
        },
        legend: {
          itemWidth: this.titleFotSize,
          itemHeight: this.titleFotSize ,
          itemGap: this.titleFotSize / 2,
          textStyle: {
            fontSize: this.titleFotSize / 2,
          },
        },
        series: [
          {
            radius: this.titleFotSize * 5,
            center: ["50%", "50%"],
          },
        ],
      };
      this.chartInstance.setOption(adapterOption);
      this.chartInstance.resize();
    },
    toLeft() {
      this.currentIndex--;
      if (this.currentIndex < 0) {
        this.currentIndex = this.allData.length - 1;
      }
      this.updateChart();
    },
    toRight() {
      this.currentIndex++;
      if (this.currentIndex > this.allData.length - 1) {
        this.currentIndex = 0;
      }
      this.updateChart();
    },
  },
};
</script>
<style lang="less" scoped>
.iconfont {
  z-index: 10;
  color: white;
  font-size: 40px;
}
.arr-left {
  position: absolute;
  left: 5%;
  top: 50%;
  transform: translateY(-50%);
  cursor: pointer;
}
.arr-right {
  position: absolute;
  right: 5%;
  top: 50%;
  transform: translateY(-50%);
  cursor: pointer;
}
.cat-name {
  position: absolute;
  left: 80%;
  bottom: 10%;
  color: white;
}
</style>
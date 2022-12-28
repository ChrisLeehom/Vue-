<template>
  <div class="com-container">
    <div class="com-chart" ref="stock_ref"></div>
  </div>
</template>
      
      <script>
export default {
  data() {
    return {
      chartInstance: null,
      allData: null, //从服务器中获取的所有数据
      currentIndex: 0, //当前显示的数据页数
      timerId: null, //定时器的标识
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
    clearInterval(this.timerId);
  },

  methods: {
    async initChart() {
      this.chartInstance = this.$echarts.init(this.$refs.stock_ref, "chalk");
      //   获取中国地图的矢量数据

      const initOption = {
        title: {
          text: "库存和销量分析",
          left: 20,
          top: 20,
        },
      };
      this.chartInstance.setOption(initOption);
      this.chartInstance.on("mouseover", () => {
        clearInterval(this.timerId);
      });
      this.chartInstance.on("mouseout", () => {
        this.startInterval(this.timerId);
      });
    },

    async getData() {
      const { data: ret } = await this.$http.get("stock");
      this.allData = ret;
      // 对allData赋值
      //   const { data: ret } = await this.$http.get("map");
      console.log(this.allData);
      //   this.allData = ret;
      this.updateChart();
      this.startInterval();
    },
    updateChart() {
      const centerArr = [
        ["18%", "40%"],
        ["50%", "40%"],
        ["82%", "40%"],
        ["34%", "75%"],
        ["66%", "75%"],
      ];
      const colorArr = [
        ["red", "yellow"],
        ["blue", "white"],
        ["yellow", "pink"],
        ["green", "red"],
        ["blue", "red"],
      ];
      const start = this.currentIndex * 5;
      const end = (this.currentIndex + 1) * 5;
      const showData = this.allData.slice(start, end);
      const seriesArr = showData.map((item, index) => {
        return {
          type: "pie",
          // radius: [110, 100],
          center: centerArr[index],
          hoverAnimation: false, //关闭鼠标移入到饼图时的动画效果
          labelLine: {
            show: false,
          },

          label: {
            position: "center",
            color: "white",
          },
          data: [
            {
              name: item.name + "\n\n" + item.sales,
              value: item.sales,
              itemStyle: {
                color: new this.$echarts.graphic.LinearGradient(0, 1, 0, 0, [
                  {
                    offset: 0,
                    color: colorArr[index][0],
                  },
                  {
                    offset: 1,
                    color: colorArr[index][1],
                  },
                ]),
              },
            },
            {
              value: item.stock,
              itemStyle: {
                color: "#333843",
              },
            },
          ],
        };
      });
      const dataOption = {
        series: seriesArr,
      };
      this.chartInstance.setOption(dataOption);
    },
    screenAdapter() {
      this.titleFotSize = (this.$refs.stock_ref.offsetWidth / 100) * 3.6;
      const innerRadius = this.titleFotSize * 2.8;
      const outterRadius = innerRadius * 1.125;
      const adapterOption = {
        title: {
          textStyle: {
            fontSize: this.titleFotSize,
          },
        },
        series: [
          {
            type: "pie",
            radius: [outterRadius, innerRadius],
            label: {
              fontSize: this.titleFotSize/2,
            },
          },
          {
            type: "pie",
            radius: [outterRadius, innerRadius],
            label: {
              fontSize: this.titleFotSize/2,
            },
          },
          {
            type: "pie",
            radius: [outterRadius, innerRadius],
            label: {
              fontSize: this.titleFotSize/2,
            },
          },
          {
            type: "pie",
            radius: [outterRadius, innerRadius],
            label: {
              fontSize: this.titleFotSize/2,
            },
          },
          {
            type: "pie",
            radius: [outterRadius, innerRadius],
            label: {
              fontSize: this.titleFotSize/2,
            },
          },
        ],
      };
      this.chartInstance.setOption(adapterOption);
      this.chartInstance.resize();
    },
    startInterval() {
      if (this.timerId) {
        clearInterval(this.timerId);
      }
      this.timerId = setInterval(() => {
        this.currentIndex++;

        if (this.currentIndex >= this.allData.length / 5) {
          this.currentIndex = 0;
        }
        this.updateChart();
      }, 2000);
    },
  },
};
</script>
  <style lang="less" scoped>
</style>
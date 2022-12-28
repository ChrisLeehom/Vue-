<!-- 商家销量统计的横向柱状图 -->

<template>
  <div class="com-container">
    <div class="com-chart" ref="rank_ref"></div>
  </div>
</template>
  <script>
export default {
  data() {
    return {
      chartInstance: null,
      allData: null, //服务器返回的数据
      startValue: 0, //区域缩放的起点位置
      endValue: 9, //区域缩放的终点位置
      timerId: null,
      titleFotSize: 0,
    };
  },
  destroyed() {
    window.removeEventListener("resize", this.screenAdapter);
    clearInterval(this.timerId);
  },
  mounted() {
    this.initChart();
    this.getData();
    window.addEventListener("resize", this.screenAdapter);
    // 在界面加载完成的时候主动进行屏幕的适配
    this.screenAdapter();
  },

  methods: {
    // 初始化echartInstance对象
    initChart() {
      this.chartInstance = this.$echarts.init(this.$refs.rank_ref, "chalk");
      //   对图标初始化配置的控制
      const initOption = {
        title: {
          text: "地区销售排行",
          left: 20,
          top: 20,
        },
        grid: {
          top: "20%",
          left: "5%",
          right: "5%",
          bottom: "15%",
          containLable: true, //距离是包含坐标轴上的文字的
        },
        tooltip: {
          show: true,
        },
        xAxis: {
          type: "category",
        },
        yAxis: {
          type: "value",
        },
        series: [
          {
            type: "bar",
          },
        ],
      };
      this.chartInstance.setOption(initOption);
      this.chartInstance.on("mouseover", () => {
        clearInterval(this.timerId);
      });
      this.chartInstance.on("mouseout", () => {
        this.startInterval(this.timerId);
      });
    },

    // 获取服务器数据
    async getData() {
      const { data: ret } = await this.$http.get("rank");
      this.allData = ret;
      console.log(this.allData);
      this.allData.sort((b, a) => {
        return a.value - b.value;
      });
      this.updateChart();
      this.startInterval();
    },
    // 更新图表
    updateChart() {
      const provinceArr = this.allData.map((item) => {
        return item.name;
      });
      const valueArr = this.allData.map((item) => {
        return item.value;
      });
      const dataOption = {
        xAxis: {
          data: provinceArr,
        },
        dataZoom: {
          show: false,
          startValue: this.startValue,
          endValue: this.endValue,
        },
        series: [
          {
            data: valueArr,
            itemStyle: {
              color: (arg) => {
                if (arg.value > 300) {
                  return new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [
                    {
                      offset: 0,
                      color: "#5052EE",
                    },
                    {
                      offset: 1,
                      color: "#AB6EE5",
                    },
                  ]);
                } else if (arg.value > 200) {
                  return new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [
                    {
                      offset: 0,
                      color: "blue",
                    },
                    {
                      offset: 1,
                      color: "red",
                    },
                  ]);
                } else {
                  return new this.$echarts.graphic.LinearGradient(0, 0, 0, 1, [
                    {
                      offset: 0,
                      color: "blue",
                    },
                    {
                      offset: 1,
                      color: "white",
                    },
                  ]);
                }
              },
            },
          },
        ],
      };
      this.chartInstance.setOption(dataOption);
    },

    // 完成屏幕适配,当游览器大小发生变化时调用
    screenAdapter() {
      // this.$refs.seller_ref.offsetWidth
      this.titleFotSize = (this.$refs.rank_ref.offsetWidth / 100) * 3.6;
      const adapterOption = {
        title: {
          textStyle: {
            fontSize: this.titleFotSize,
          },
        },

        series: [
          {
            barWidth: this.titleFotSize,

            itemStyle: {
              // 左上角，右上角，右下角，左下角的圆角
              barBorderRadius: [this.titleFotSize / 2, this.titleFotSize / 2, 0, 0],
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
        this.startValue++;
        this.endValue++;
        if (this.endValue > this.allData.length - 1) {
          this.startValue = 0;
          this.endValue = 9;
        }
        this.updateChart();
      }, 2000);
    },
  },
};
</script>
  <style lang="less"></style>
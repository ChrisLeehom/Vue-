<!-- 商家销量统计的横向柱状图 -->

<template>
  <div class="com-container">
    <div class="com-chart" ref="seller_ref"></div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      chartInstance: null,
      allData: null, //服务器返回的数据
      currentPage: 1,
      totalPage: 0,
      timerId: null, //定时器的标识
    };
  },
  mounted() {
    this.initChart();
    this.getData();
    window.addEventListener("resize", this.screenAdapter);
    // 在界面加载完成的时候主动进行屏幕的适配
    this.screenAdapter();
  },
  destroyed() {
    clearInterval(this.timerId);
    // 在组件销毁时要将监听器销毁
    window.removeEventListener("resize", this.screenAdapter);
  },
  methods: {
    // 初始化echartInstance对象
    initChart() {
      this.chartInstance = this.$echarts.init(this.$refs.seller_ref, "chalk");
      //   对图标初始化配置的控制
      const initOption = {
        title: {
          text: "| 商家销售统计",

          left: 20,
          top: 20,
        },
        grid: {
          top: "20%",
          left: "10%",
          right: "6%",
          bottom: "15%",
          containLable: true, //距离是包含坐标轴上的文字的
        },
        xAxis: {
          type: "value",
        },
        yAxis: {
          type: "category",
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "line",
            z: 0,
            lineStyle: {
              color: "#2D3443",
            },
          },
        },
        series: [
          {
            type: "bar",

            label: {
              show: true,
              position: "right",
              textStyle: {
                color: "white",
              },
            },
            itemStyle: {
              //颜色渐变
              //  1指明颜色渐变的方向
              // 指明不同百分比之下颜色的值
              color: new this.$echarts.graphic.LinearGradient(0, 0, 1, 0, [
                {
                  offset: 0,
                  color: "#5052EE",
                },
                {
                  offset: 1,
                  color: "#AB6EE5",
                },
              ]),
            },
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
      //
      const { data: ret } = await this.$http.get("/seller");
      console.log(ret);
      this.allData = ret;
      this.allData.sort((a, b) => {
        return a.value - b.value;
      });
      //    每五个元素显示一页
      this.totalPage =
        this.allData.length % 5 === 0
          ? this.allData.length / 5
          : this.allData.length / 5 + 1;
      this.updateChart();
      this.startInterval();
    },
    // 更新图表
    updateChart() {
      const start = (this.currentPage - 1) * 5;
      const end = this.currentPage * 5;
      const showData = this.allData.slice(start, end); //slice不包含end结尾
      const sellerNames = showData.map((item) => item.name);
      const sellerValue = showData.map((item) => item.value);
      const dataOption = {
        yAxis: {
          data: sellerNames,
        },

        series: [
          {
            data: sellerValue,
          },
        ],
      };
      this.chartInstance.setOption(dataOption);
    },
    startInterval() {
      if (this.timerId) {
        clearInterval(this.timerId);
      }
      this.timerId = setInterval(() => {
        this.currentPage++;
        if (this.currentPage > this.totalPage) {
          this.currentPage = 1;
        }
        this.updateChart();
      }, 3000);
    },
    // 完成屏幕适配,当游览器大小发生变化时调用
    screenAdapter() {
      // this.$refs.seller_ref.offsetWidth
      const titleFotSize = (this.$refs.seller_ref.offsetWidth / 100) * 3.6;
      const adapterOption = {
        title: {
          textStyle: {
            fontSize: titleFotSize,
          },
        },

        tooltip: {
          trigger: "axis",
          axisPointer: {
            lineStyle: {
              width: titleFotSize,
            },
          },
        },
        series: [
          {
            barWidth: titleFotSize,

            itemStyle: {
              // 左上角，右上角，右下角，左下角的圆角
              barBorderRadius: [0, titleFotSize / 2, titleFotSize / 2, 0],
            },
          },
        ],
      };
      this.chartInstance.setOption(adapterOption);
      this.chartInstance.resize();
    },
  },
};
</script>
<style lang="less"></style>
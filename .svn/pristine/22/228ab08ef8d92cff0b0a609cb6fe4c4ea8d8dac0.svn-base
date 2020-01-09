<!--
  describe："图层管理组件"
  created by：Guan xiaojun
-->
<template>
  <div>
    <el-collapse-transition>
      <div class="tool" v-if="showCard">
        <el-card class="tool_button-group">
          
          <div class="label-name" @click="toggleBoundManage()" style="cursor:pointer;width:345px;">
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-tuceng1"></use>
            </svg>
            边界管理
            <i id="el-icon1" class="el-icon-arrow-up element-icon"></i>
          </div>
          <el-collapse-transition>
            <div v-if="showBoundManage">
              <el-checkbox-group v-model="Regions" size="small" v-on:change="fnChangeGrids" class="tool_checkbox-group" style="padding-top:2px;">
                <template v-for="item in RegionDisplay">
                  <div :key="item.name" v-if="item.name == '行政区'" style="" class="bound-checkbox">
                    <el-checkbox :label="item.name">
                      <svg class="icon" aria-hidden="true">
                        <use xlink:href="#icon-quyu"></use>
                      </svg>
                      行政区
                    </el-checkbox>
                  </div> 
                  <el-checkbox :key="item.name" :label="item.name" v-if="item.name == '单元格'" class="bound-checkbox" >
                     <svg class="icon" aria-hidden="true" style="font-size:12px;margin-left:4px;">
                        <use xlink:href="#icon-wangge"></use>
                      </svg>
                      单元格
                  </el-checkbox>
                  <el-checkbox :key="item.name" :label="item.name" v-if="item.name == '综合网格范围'" class="bound-checkbox">
                    <svg class="icon" aria-hidden="true">
                        <use xlink:href="#icon-zonghe"></use>
                      </svg>
                      综合网格范围
                  </el-checkbox> 
                  <el-checkbox :key="item.name" :label="item.name" v-if="item.name == '责任田范围'" class="bound-checkbox" style="margin-bottom:10px;">
                    <svg class="icon" aria-hidden="true">
                        <use xlink:href="#icon-baozhangzeren"></use>
                      </svg>
                     责任田范围
                  </el-checkbox> 
                  <div :key="item.name" v-if="item.name == '众包图层'" class="grid-checkbox">
                    <el-checkbox :label="item.name">
                      <svg class="icon" aria-hidden="true" style="font-size:13px;">
                        <use xlink:href="#icon-bianji"></use>
                      </svg>
                      众包图层
                    </el-checkbox>
                  </div>
                </template>  
              </el-checkbox-group>
            </div>
          </el-collapse-transition>
          
          <div class="label-name" @click="toggleMapManage()">
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-ditu"></use>
            </svg>
            底图管理
            <i id="el-icon3" class="el-icon-arrow-up element-icon"></i>
          </div>
          <el-collapse-transition v-if="showMapManage">
            <!-- <div style="display:flex;justify-content:center;align-item：center;"> -->
          <el-radio-group v-model="mapValue">
            <el-radio v-for="(item, index) in maps" class="rdaio" :label="item" style="margin:5px;" :key="index"></el-radio>
          </el-radio-group>
            <!-- </div> -->
          </el-collapse-transition>

        </el-card>
      </div>
    </el-collapse-transition>
  </div>
</template>

<script>
import Bus from "../../assets/js/bus.js";
// import filterTable from "./filter/channelFilter.vue";
// import gridFilterTable from "./filter/gridFilter.vue";
// import ProGridFilterTable from "./filter/ProGridFilter.vue";
// import $ from "jquery";
import { Loading } from "element-ui";
export default {
  name: "setting",
  props: ["initialData", "showCard"],
  data() {
    return {
      checkStatus :false,//控制业务管理图层的选项的显示状态
      flag: true,
      showBoundManage: false,
      showMapManage: false,
      showGridManage: true,
      region: "",
      region2: "",
      Regions: ["行政区"],
      RegionDisplay: [
        {
          name: "行政区",
          value: false
        },
        {
          name: "区块",
          value: false
        },
        {
          name: "单元格",
          value: false
        },
        {
          name: "综合网格范围",
          value: false
        },
        {
          name: "责任田范围",
          value: false
        },{
          name:"众包图层",
          value:false
        }
      ],
      Results:["业务选址结果"],
      ResultsDisplay:[
      {
        name:"业务选址结果",
        value:false
      }
      ],
      Grids: ["渠道单元格选址评分"],
      GridDisplay: [
        {
          name: "渠道点得分",
          value: false
        },
        {
          name: "渠道单元格选址评分",
          value: false
        },
        {
          name: "渠道单元格id",
          value: false
        },
        {
          name: "家宽服务站单元格选址评分",
          value: false
        },
        {
          name: "家宽单元格id",
          value: false
        },
        {
          name: "责任田渠道合理性分布",
          value: false
        },
        {
          name:"商圈",
          value:false
        },
        // {
        //   name:"渠道合理性分布",
        //   value:false
        // }
      ],
      mapValue: "天地图",
      maps: ["天地图", "卫星影像", "谷歌", "高德", "OpenStreetMap", "Mapbox", "空白底图"],
      drawFlag: false,
      selectCity: false,
      channelDetailShow: false,
      gridDetailShow: false,
      ProGridDetailShow: false,
      radio1: "grid",
      visible1: false,
      visible2: false,
      visible3: false,
      gridIdDisabled: false,
      jkIdDisabled: true
    };
  },
  created() {
    Bus.$on("initGrid", () => {
      if (this.flag) {
        this.fnChangeGrids();
        Bus.$emit("showInfo", this.radio1);
        this.flag = !this.flag;
      }
    });
    Bus.$on("closePopover", data => {
      if (this.visible1) {
        this.visible1 = false;
      } else if (this.visible2) {
        this.visible2 = false;
      } else if (this.visible3) {
        this.visible3 = false;
      }
    });
    // 加载默认图层
    Bus.$on("loadDefaultLayers", data => {
      this.Regions = ["行政区"];
      this.Grids = ["渠道单元格选址评分"];
      this.radio = "grid";
      Bus.$emit("showInfo", this.radio1);
      Bus.$emit("sendGrids", this.Grids);
      this.fnChangeGrids();
    });
    // StatusTab组件传参 20171215麦景翔
    Bus.$on("gridsFromTab", data => {
      this.Grids = data;
    });
    Bus.$on("radioFromTab", data => {
      this.radio1 = data;
      Bus.$emit("showInfo", this.radio1);
    });
    Bus.$on('showRespfieLayer', data => {
      if (this.Grids.indexOf('责任田渠道合理性分布') === - 1) {
        this.Grids.push('责任田渠道合理性分布');
      }
    });
    Bus.$on('hideresult', data=>{
      if(data===true){
        this.checkStatus = true;//显示业务选址结果图层选项
        this.Grids = [];//取消渠道单元格选址得分图层等其他图层的勾选。
      }
      else if(data===false){
      //this.Results = [];
      this.checkStatus = false;//隐藏业务选址结果图层选项
      this.Results = ["业务选址结果"];//还原“业务结果图层”选项被勾选的状态。
    }
    })
    Bus.$on("addCrowdSource", data => {
      if(data){
        if(this.Regions.indexOf("众包图层") == -1){
          this.Regions.push("众包图层");
        }
      }
    })
  },
  methods: {
    toggleBoundManage(){
      if(this.showBoundManage){
        this.showBoundManage = false;
      }else{
        this.showBoundManage = true;
      }
      // if(this.showBoundManage){
      //   $("#el-icon1").removeClass("el-icon-arrow-up");
      //   $("#el-icon1").addClass("el-icon-arrow-down");
      // }else{
      //   $("#el-icon1").removeClass("el-icon-arrow-down");
      //   $("#el-icon1").addClass("el-icon-arrow-up");
      // }
    },
    toggleMapManage(){
      if(this.showMapManage){
        this.showMapManage = false;
      }else{
        this.showMapManage = true;
      }
      // if(this.showMapManage){
      //   $("#el-icon3").removeClass("el-icon-arrow-up");
      //   $("#el-icon3").addClass("el-icon-arrow-down");
      // }else{
      //   $("#el-icon3").removeClass("el-icon-arrow-down");
      //   $("#el-icon3").addClass("el-icon-arrow-up");
      // }
    },
    toggleGridManage(){
      if(this.showGridManage){
        this.showGridManage = false;        
      }else{
        this.showGridManage = true;
      }
      // if(this.showGridManage){
      //   $("#el-icon2").removeClass("el-icon-arrow-up");
      //   $("#el-icon2").addClass("el-icon-arrow-down");
      // }else{
      //   $("#el-icon2").removeClass("el-icon-arrow-down");
      //   $("#el-icon2").addClass("el-icon-arrow-up");
      // }
    },
    dataExport(type) {
      if (type == "1") {
        window.location.href =
          hosts + "downLoadAllGrid.action" + "?type=" + type;
      } else {
        window.location.href =
          hosts + "downLoadExistedList.action" + "?type=" + type;
      }
    },
    changeresult(){
      Bus.$emit('changeResultLayer',);//【告诉Map.Vue当前点击了checkbox】
    },
    fnChangeGrids() {
      let layerList = [];
      for (let i in this.Regions) {
        layerList.push(this.Regions[i]);
      }
      for (let i in this.Grids) {
        layerList.push(this.Grids[i]);
      }
      Bus.$emit("changeGrid", layerList);
      Bus.$emit("sendGrids", this.Grids);
      //通知图例组件修改图例内容，麦景翔20180413
      Bus.$emit("changLegend", this.Grids);
      // Bus.$emit('loading')
    },
    fnOnClose() {
      Bus.$emit("closeAll", "");
    },
  },
  watch: {
    mapValue() {
      Bus.$emit("loading");
      Bus.$emit("changeMap", this.mapValue);
    },
    drawFlag() {
      Bus.$emit("enableDrawing", this.drawFlag);
    },
    radio1() {
      Bus.$emit("showInfo", this.radio1);
      Bus.$emit("sendRadio1", this.radio1);
    },
    Grids() {
      console.log(this.Grids, "Grids")
      let length = this.Grids.length;
      if (this.Grids[length - 1] === "家宽服务站单元格选址评分") {
        this.Grids.forEach((item, index) => {
          // if (item === "渠道单元格选址评分" || item === "责任田渠道合理性分布"|| item === "商圈") {
          if(item !== "家宽服务站单元格选址评分" && item !== "渠道点得分") {
            this.Grids.splice(index, 1);
            index--;
          }
        });
        this.radio1 = "ProGrid";
        this.gridIdDisabled = true;
        this.jkIdDisabled = false;
      } else if (this.Grids[length - 1] === "渠道单元格选址评分") {
        this.Grids.forEach((item, index) => {
          // if (item === "家宽服务站单元格选址评分" || item === "责任田渠道合理性分布"|| item === "商圈") {
          if(item !== "渠道单元格选址评分" && item !== "渠道点得分") {
            this.Grids.splice(index, 1);
            index--;
          }
        });
        this.radio1 = "grid";
        this.jkIdDisabled = true;
        this.gridIdDisabled = false;
      } else if (this.Grids[length - 1] === "渠道点得分") {
        this.radio1 = "channel";
        this.jkIdDisabled = true;
        this.gridIdDisabled = true;
      } 
      else if (this.Grids[length - 1] === "责任田渠道合理性分布") {
        this.Grids.forEach((item, index) => {
          // if (item === "家宽服务站单元格选址评分" || item === "渠道单元格选址评分" || item === "商圈") {
          if(item !== "责任田渠道合理性分布" && item !== "渠道点得分") {
            this.Grids.splice(index, 1);
            index--;
          }
        });
        this.radio1 = "respfie";
        this.jkIdDisabled = true;
        this.gridIdDisabled = true;
      }
      else if (this.Grids[length - 1] === "商圈"){
        this.Grids.forEach((item, index)=>{
          // if (item === "家宽服务站单元格选址评分" || item === "渠道单元格选址评分"|| item === "责任田渠道合理性分布") {
          if(item !== "商圈" && item !== "渠道点得分") {
            this.Grids.splice(index, 1);
            index--;
          }
        })
        this.radio1 = "businessCircle";
        this.jkIdDisabled = true;
        this.gridIdDisabled = true;
      }
     
      this.fnChangeGrids();
    },
    Regions(){
      this.fnChangeGrids();
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.$parent.$refs[this.target];
    });
  },
  // components: {
  //   filterTable,
  //   gridFilterTable,
  //   ProGridFilterTable
  // }
};
</script>

<style scoped>
/* @import "../../assets/css/variable.scss"; */
.tool {
  max-height:91vh;
  /* // min-width: 340px; */
  max-width: 387px;
  position: absolute;
  left: 50px;
  top: 56px;
  text-align: center;
  font-size: 0.8rem;
  /* // max-height: 450px; */
  border-radius: 0px;
  overflow-y: auto;
}
/* .closeBtn {
  @include closeBtnStyle;
} */
/* .closeBtn:hover {
  @include closeBtnHover;
} */
.tool .tool_button-group {
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  border-radius: 0px!important;
  /* // padding-right: 0px; */
}
.tool .label-name {
    font-size: 15px;
    text-align: left;
    margin: 5px;
    cursor: pointer;
    /* .element-icon {
      font-size: 12px;
      margin-left: 1px;
    } */
  }
.tool .el-checkbox-group {
    border: 1px solid #ccc;
    border-radius: 5px;
  }
.tool .el-radio-group {
    border: 1px solid #ccc;
    border-radius: 5px;
    padding: 10px 5px 10px 0;
  }
.tool .bound-checkbox {
    margin-left: 30px;
    margin-bottom:12px;
    display:inline-block;
    /* .region-icon{
      font-size: 16px;
      margin-left: 1px;
      color:#fff;
    } */
  }
.tool .tool_checkbox-group {
    display: flex;
    flex-direction: column;
    flex-wrap: wrap;
    align-items: flex-start;
    margin-bottom: 0px;
  }
    /* // min-width: 330px; */
     
    
  .icon{
    font-size: 14px;
    width: 16px;
    height: 16px;
  }
  
  .tool_selector {
    margin-top: 5%;
    width: 100%;
  }

    /* // .popover,
    // .download {
    //   display: flex;
    //   flex-direction: column;
    //   text-align: right;
    //   margin-top: 10px;
    //   margin-left: 10px;
    // } */

  .el-button {
    width: auto;
  }

/*滚动条样式*/
.tool::-webkit-scrollbar {
  /*滚动条整体样式*/
  width: 6px; /*高宽分别对应横竖滚动条的尺寸*/
  height: 4px;
}
.tool::-webkit-scrollbar-thumb {
  /*滚动条里面小方块*/
  border-radius: 10px;
  -webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.6);
  box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
  background: rgba(0, 0, 0, 0.6);
}
.tool::-webkit-scrollbar-track {
  /*滚动条里面轨道*/
  background: transparent;
}

/* @media screen and (max-width: 500px) {
  .tool {
    @include mediaStyle;
    top: 0;
    max-height: 60%;
  }
  .tool_button-group {
    @include mediaStyle;
    top: 0;
    position: absolute;
    width: 200%;
    overflow: scroll;
  }
} */
</style>

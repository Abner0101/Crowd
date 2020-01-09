<!--
  describe："众包图层的绘制组件，包括查看字段、修改字段"
  created by：Huang Wei
-->
<template>
  <div id="crowdEdit">
    <el-collapse-transition>
      <div class="tool" v-show="showCard">
        <!--绘制按钮-->    
        <!-- <el-tooltip :content="drawTooltip" placement="right"> -->
          <el-row style="margin-bottom:10px;">
          <el-button @click="changeEditStatus('draw')" :style="drawBtnStyle">
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-pan_icon"></use>            
            </svg>
            绘制要素
          </el-button>
          <el-tooltip :content="drawTooltip" placement="right">
            <div style="display:inline-block">
              <svg class="icon" aria-hidden="true">
                <use xlink:href="#icon-help"></use>            
              </svg>
            </div>
          </el-tooltip>
          </el-row>
          <!-- <br> -->
        <!-- </el-tooltip> -->
        <!--删除按钮-->
        <el-row style="margin-bottom:10px;">
        
          <el-button @click="changeEditStatus('delete')" :style="deleteBtnStyle">
            <svg class="icon" aria-hidden="true" style="font-size:12px;">
              <use xlink:href="#icon-shanchu"></use>
            </svg>
            删除要素
          </el-button>
          <el-tooltip :content="deleteTooltip" placement="right">
          <div style="display:inline-block">
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-help"></use>            
            </svg>
          </div>
          <!-- <br> -->
        </el-tooltip>
        </el-row>
        <!--查看字段按钮-->
        <el-row style="margin-bottom:10px;"> 
        <!-- <el-tooltip content="查看字段" placement="top"> -->
          <el-button @click="changeEditStatus('properties')" :style="propertyBtnStyle">
            <svg class="icon" aria-hidden="true" style="font-size:12px;">
              <use xlink:href="#icon-info"></use>            
            </svg>
            查看属性
          </el-button>
          <el-tooltip :content="propertiesTooltip" placement="right">
          <div style="display:inline-block">
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-help"></use>            
            </svg>
          </div>
        </el-tooltip>    
        </el-row>
        <el-row>
          <el-button @click="changeEditStatus('modify')" :style="modifyBtnStyle">
            <svg class="icon" aria-hidden="true" style="font-size:12px">
              <use xlink:href="#icon-Group"></use>
            </svg>
            调整形状
          </el-button>
          <el-tooltip :content="modifyTooltip" placement="right">
          <div style="display:inline-block">
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-help"></use>            
            </svg>
          </div>
        </el-tooltip>    
        </el-row>
      </div>
    </el-collapse-transition>
    <!--显示字段信息的弹出框-->
    <el-dialog title="属性" :visible.sync="dialogFormVisible" width="60%" center id="gs-dialog">
      <div style="display:overflow-y:auto">
      <el-form style="properties-form">
        <template v-for="item in form">
          <el-form-item label="" label-width="0px">
            <el-row>
              <el-col :span="4">
                <el-tooltip v-if="columnAlias != {}" :content="columnAlias[item.name]!=null? columnAlias[item.name]: ''"  placement="top">
                <span>{{item.name}}</span>
                </el-tooltip>
              </el-col>
              <el-col :span="20">
                <el-input v-model="item.value" :disabled="item.name =='school_id'"></el-input>
              </el-col>
            </el-row>
          </el-form-item>
        </template>
        <el-button @click="onSubmitForm()">保存修改</el-button>
      </el-form>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import Bus from '../../assets/js/bus.js'
// import $ from "jquery";
import {getPropertiesInfo, SetFeature} from '@/ajax/api'
export default {
  props: ["showCard"],
  data(){
    return{
      drawStatus:false,
      deleteStatus:false,
      drawTooltip:"单击地图，进行绘制",
      deleteTooltip:"单击要素，指定删除",
      propertiesTooltip:"单击要素，查看字段或修改字段",
      modifyTooltip: "点击要素，进入调整状态",
      drawSource:null,
      drawLayer:null,     
      drawBtnStyle:{}, //绘制按钮的样式      
      deleteBtnStyle: {},//删除按钮的样式      
      propertyBtnStyle:{},//处理字段按钮的样式      
      modifyBtnStyle:{},//调整形状按钮的样式
      buttonInactiveStyle:{ //按钮未被激活的样式
        background: "rgba(0,0,0,0.75)",
        color: "#e7e7e7",
        height: "35px",
        fontSize: "12px",
        borderRadius: "3px",
        borderStyle: "solid",
        borderColor: "rgba(0,0,0,0.75)",
        transition:"all 0.3s"
      },
      buttonActiveStyle:{ //按钮被激活的样式
        backgroundColor:"rgba(0,0,0,0.55)!important",
        color: "rgb(32, 160, 255)!important",
        fontWeight: "600!important",
        border: "1px solid rgba(0,0,0,0.4)!important"
      },
      form:[
        {
          name:'fid',
          value:'',
        }
      ],
      dialogFormVisible:false,
      showPropertiesStatus:false,
      radio1: '',
      fid:null,
      table:null,
      columnAlias:{},
      haveDraw:false,
      haveModify:false,
      editStatus: [],
      modifyStatus: false,
      lastEditBtn: "",//上一次被点击的编辑按钮
    }
  },
  methods:{
    //统一管理各个编辑事件
    changeEditStatus(data){
      this.lightenBtn("");
      let currentEditBtn = data;
      switch (data) {
        case "draw":
          if(this.editStatus.indexOf("draw")> -1){
            this.editStatus.splice(this.editStatus.indexOf("draw"),1);
          }else{
            this.editStatus = [];
            this.editStatus.push("draw");
            this.lightenBtn(data);
          }
          this.changeDrawStatus();
          break;
        case "delete":
          if(this.editStatus.indexOf("delete")> -1){
            this.editStatus.splice(this.editStatus.indexOf("delete"),1);
          }else{
            this.editStatus = [];
            this.editStatus.push("delete");
            this.lightenBtn(data);
          }
          this.changeDeleteStatus();
          break;
        case "properties":
          if(this.editStatus.indexOf("properties")> -1){
            this.editStatus.splice(this.editStatus.indexOf("properties"),1);
          }else{
            this.editStatus = [];
            this.editStatus.push("properties");
            this.lightenBtn(data);
          }
          this.changeShowPropertyStatus();
          break;
        case "modify":
           this.changeModifyStatus();
          if(this.editStatus.indexOf("modify")>-1){
            this.editStatus.splice(this.editStatus.indexOf("modify"), 1);
          }else{
            this.editStatus = [];
            this.editStatus.push("modify");
            this.lightenBtn(data);
          }         
          break;
        default:
          break;
      }
      if(this.lastEditBtn == "draw"){ //如果上一个按钮是绘制，则处理绘制完成的事件
          if(this.haveDraw){//有绘制新要素
            this.$confirm('是否保存该要素？', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              Bus.$emit("enableDrawCrowd", false);
              Bus.$emit("pushGeoJson", "");
              
            }).catch(() => {
              Bus.$emit("enableDrawCrowd", false);

              this.$message({
                type: 'info',
                message: '已取消保存'
              });          
            });
          }else{//没有绘制新要素
            Bus.$emit("enableDrawCrowd", false);
          }
      }
      if(this.lastEditBtn == "modify"){ //如果上一个按钮是调整形状，则处理调整完成的事件
        if(this.haveModify){//有调整形状
          this.$confirm('是否保存修改？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            Bus.$emit("enableModify", false, true);
            
          }).catch(() => {
            Bus.$emit("enableModify", false, false);
            this.$message({
              type: 'info',
              message: '已取消保存'
            });          
          });
        }else{
          Bus.$emit("enableModify", false, false);
        }
      }
      //如果没有按钮被激活
      if(this.editStatus.length == 0){
        Bus.$emit('enablePop', true);//允许弹框
        Bus.$emit("lockCrowdEditCard", false);//解除下拉列表的锁定
        this.lastEditBtn = "";
      }else{
          if(this.drawStatus){ //开启绘制
            Bus.$emit("lockCrowdEditCard", true);        
            Bus.$emit("enableDrawCrowd", true);
            this.haveDraw = false;//尚未绘制新要素
          }
          if(this.modifyStatus){ //开启修改
            Bus.$emit('enablePop', false);
            Bus.$emit("enableModify", true);
            Bus.$emit("lockCrowdEditCard", true);
            this.haveModify = false;//尚未修改要素形状
          }                
          this.lastEditBtn = currentEditBtn;
      }
      
    },
    changeDrawStatus(){
      this.deleteStatus = false;
      this.showPropertiesStatus = false;
      this.modifyStatus = false;
      this.drawStatus = !this.drawStatus;
    },
    changeDeleteStatus(){      
      this.showPropertiesStatus = false;
      this.drawStatus = false;
      this.modifyStatus = false;
      this.deleteStatus = !this.deleteStatus;
    },
    //获取指定要素的字段值
    changeShowPropertyStatus(){      
      this.drawStatus = false;
      this.deleteStatus = false;
      this.modifyStatus = false;
      this.showPropertiesStatus = !this.showPropertiesStatus;
      // this.dialogFormVisible = true;     
    },
    changeModifyStatus(){
      this.drawStatus = false;
      this.deleteStatus = false;
      this.showPropertiesStatus = false;
      this.modifyStatus = !this.modifyStatus;
    },
    //高亮按钮
    lightenBtn(data){
      this.drawBtnStyle = this.buttonInactiveStyle;
      this.deleteBtnStyle = this.buttonInactiveStyle;
      this.propertyBtnStyle = this.buttonInactiveStyle;
      this.modifyBtnStyle = this.buttonInactiveStyle;
      switch(data){
          case "draw":
              this.drawBtnStyle = this.buttonActiveStyle;
              break;
          case "delete":
              this.deleteBtnStyle = this.buttonActiveStyle;
              break;     
          case "properties":
              this.propertyBtnStyle = this.buttonActiveStyle;
              break;  
          case "modify":
              this.modifyBtnStyle = this.buttonActiveStyle;
              break;        
          default:
              break;         
      }
    },
    //点击字段修改
    onSubmitForm(){
      this.$confirm("是否修改该要素属性","提示", {
        confirmButtonText:"确定",
        cancelButtonText:"取消",
        type:"warning"
      }).then(()=>{
        let temp = {};

        for(let i =0;i< this.form.length;i++){
          if(this.form[i].value!==""){
            temp[this.form[i].name] = this.form[i].value;
          }else{
            temp[this.form[i].name] = ""
          }
          
        }
        console.log(temp, "temp")
        let json = {};
        json.table="schools";
        json.fid = this.fid;
        json.data = JSON.stringify(temp);
        SetFeature(json).then(response => {
          console.log(response, "rsp")
          if(response.code == 200){
            this.$message({
              type:"success",
              message:"修改成功"
            })
          }else{
            this.$message({
              type:"error",
              message:"修改失败"
            })
          }
        })
      }).catch(()=>{
        // this.$message({
        //   type:"info",
        //   message:"已取消修改"
        // })
      })      
    }
  },
  mounted(){    
    this.lightenBtn("");//初始化各按钮的样式
    //接收点击具体要素后获得属性，在表单中进行显示
    Bus.$on("showFeatureProperties", data => {
      this.form = [];
      for(let key in data){
        if(key!=="fid"){
          let temp = {name: key, value: data[key]};
          this.form.push(temp);
        } 
      }
      this.fid = data.fid;

      let json = {
          table:'schools'
      };
      //获得属性的别名
      getPropertiesInfo(json).then(response=>{
        for(let key in response.data){         
          this.columnAlias[key] = response.data[key];
        }
        this.dialogFormVisible = true;
      });
      
    })
    //识别是否绘制了新的要素
    Bus.$on("haveDraw", data=> {
      this.haveDraw = data;
    })
    //识别是否调整了形状
    Bus.$on("haveModify", data => {
      this.haveModify = data;
    });
  },
  watch:{
    deleteStatus(){
      //开启删除
      if(this.deleteStatus){          
        Bus.$emit("enableDelete", true);
        Bus.$emit("lockCrowdEditCard", true);
       
      }else {//关闭删除
        Bus.$emit("enableDelete", false);        
      }
    },
    showPropertiesStatus(){
      //告知Map.vue组件是否可以开始查看属性
      Bus.$emit("enableGetProperties", this.showPropertiesStatus);
      if(this.showPropertiesStatus){        
          Bus.$emit("lockCrowdEditCard", true);
      }else {           

      }
    },
  }
}
</script>

<style scoped>
/* @import "../../assets/css/variable.scss"; */
#crowdEdit .tool{

    position:absolute;
    padding:15px 10px;
    left: 600px;
    top: 10px;
    background:  rgba(0, 0, 0, 0.6);
    border-radius: 5px;
    line-height: 10px;
}
    .el-radio-button__inner{
      background: none!important;
    }
    .el-button:hover{
      background-color:rgba(0,0,0,0.55)!important;
      color:  rgb(32, 160, 255)!important;
      font-weight: 600!important;
      border: 1px solid rgba(0, 0,0,0.4)!important;
    }
    .el-button {
      background: rgba(0,0,0,0.75);
      color: #e7e7e7;
      height: 35px;
      font-size: 12px;
      border-radius: 3px;
      border-style: solid;
      border-color: rgba(255,255,255,0.75);
      transition:all 0.3s;
      /* // display: block; */
    }
    .icon{
      font-size:12px;
    }
    
  /* } */
  .el-button {
    background: rgba(0,0,0,0.75);
    color: #e7e7e7;
    height: 35px;
    font-size: 12px;
    border-radius: 3px;
    border-style: solid;
    border-color: rgba(255,255,255,0.75);
    transition:all 0.3s;
    /* // display: block; */
  }
  .el-dialog__body{
    padding:30px 30px !important;
  }
  .el-dialog__wrapper{
    overflow:hidden;
    /* .el-dialog__header{
      background: #000;
    } */
    
  }
  
  .el-form .el-button{
    /* { */
      float:right;
      margin-bottom: 10px;
    /* } */

  }
  #gs-dialog  .el-dialog__header{
   /* { */
      padding-bottom: 20px;
    /* } */
  }
/* } */
#crowdEdit .el-dialog__body{
  padding:30px 30px !important;
}

.icon{
        font-size: 14px;
        width: 16px;
        height: 16px;
    }

</style>
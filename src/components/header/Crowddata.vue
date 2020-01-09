<template>
    <div class="content">
        <div class="content-left">
            <div style="margin:10px 10px">
                <el-button type="danger" size="mini" @click="delInfoList()">删除</el-button>
                <el-button type="info" size="mini">导出</el-button>
            </div>
            <transition name="el-fade-in">
                <el-table :data="tableData" style="width: 100%" @selection-change="handleSelectionChange" v-if="showTable">
                    <el-table-column type="selection" width="50" fixed>
                    </el-table-column>
                    <el-table-column label="ID" prop="school_id" width="50">
                    </el-table-column>
                    <el-table-column label="园区名称" prop="school_na" width="150" fixed>
                    </el-table-column>
                    <el-table-column label="园区类型" prop="type" width="100">
                    </el-table-column>
                    <el-table-column label="人数" prop="student_cnt" width="100">
                    </el-table-column>
                    <el-table-column label="联系方式" prop="phone" width="150">
                    </el-table-column>
                    <el-table-column label="地址" prop="school_adr">
                    </el-table-column>
                    <el-table-column align="right" width="200">
                    <template slot="header" slot-scope="scope">
                        <el-select v-model="value" placeholder="请选择园区类型" clearable size="mini">
                        <el-option v-for="item in options" :key="item" :label="item" :value="item">
                        </el-option>
                        </el-select>
                    </template>
                    <template slot-scope="scope">
                        <el-button size="mini" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                        <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
                    </template>
                    </el-table-column>
                </el-table>
            </transition>
            <div class="paginationClass">
                <el-pagination @current-change="handleCurrentChange1" :page-size="pageSize"
                :current-page="currentPage1" layout="total, prev, pager, next, jumper" :total="total1">
                </el-pagination>
            </div>
        </div>

        <div class="content-right">
            <div id="myChart"  class="echartBox" style="width:400px;height:400px"></div>
        </div>
    </div>
</template>

<script>
import {getZoomtype,getAllFeatureInfo,getAllZoomInfo,getAlltypesNum,removeFeature} from '@/ajax/api'
import Bus from "../../assets/js/bus.js"
export default {
    mounted(){
        this.getTypeNum();
        this.getZoomtypes();
    },
    created(){
        this.getCrowdMes();
    },
    data() {
      return {
        total1: 0,
        currentPage1:1,
        pageSize:8,
        tableData: [],
        multipleSelection: [],
        value:'',
        options:[],
        zoomNameList:[],
        zoomNumList:[],
        showTable:true,
      }
    },
    watch:{
        value(){
            this.getCrowdMes();
            // console.log("calue");
        },
        tableData:{ //监听tableData值的变化，更新参数数据
            handler(){
                this.getTypeNum();
                this.showTable=false;
                const timer=setTimeout(()=>{
                    this.showTable=true;
                },100);  
                this.$once('hook:beforeDestroy', () => {    //清理定时器
                    clearTimeout(timer);           
                })
            },
            deep:true                 
        },

    },
    
    methods: {
        //页码切换
        handleCurrentChange1(currentPage) { 
            this.currentPage1 = currentPage;
            this.getCrowdMes();
        },
        handleEdit(index, row) {
            console.log(index, row);
        },
        //删除单个要素信息
        handleDelete(index, row) {
            // console.log(index, row);
            this.$confirm('是否要删除该要素信息？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() =>{
                Bus.$emit("removeItems",row.fid);
                if(this.tableData.length === 1 && this.currentPage1 > 1){
                    this.currentPage1--;
                }
            }).then(() => {
                const timer=setTimeout(()=>{
                    this.getCrowdMes();
                },100);  
                this.$once('hook:beforeDestroy', () => {    //清理定时器
                    clearTimeout(timer);           
                })
            })
        },
        handleSelectionChange(val) {
            // this.multipleSelection = val;
            // console.log(this.multipleSelection);
            let arr = val;
            arr.forEach(value => {
                this.multipleSelection.push(value.fid)
            })
        },

        //删除要素信息
        delInfoList(){
            if(this.multipleSelection.length <= 0){
                this.$message({
                    type: 'warning',
                    message: '请勾选您要删除的要素',
                    center:true
                });
            }else{
                this.$confirm('是否要删除已选要素信息？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(()=>{
                    let fid = this.multipleSelection.join(",");
                    // console.log(fid);
                    Bus.$emit("removeItems",fid);
                    if(this.tableData.length === this.multipleSelection.length && this.currentPage1 > 1){
                        this.currentPage1--;
                    }
                }).then(()=>{
                    const timer=setTimeout(()=>{
                        this.getCrowdMes();
                    },100);  
                    this.$once('hook:beforeDestroy', () => {    //清理定时器
                        clearTimeout(timer);           
                    })
                    this.multipleSelection = [];

                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除',
                        center:true
                    });          
                }); 
            }      
        },

        //获取所有众包类型
        getZoomtypes(){
            getZoomtype({}).then(res =>{
                if(res.code === 200){
                    this.options = res.data;
                    // this.crowdType = res.data;
                    // this.crowdType = res.data;
                }else{
                    this.$message({
                        type: 'error',
                        message: res.msg,
                        center:true
                    });
                }
            })
        },

        //获取属性信息列表
        getCrowdMes() {
            let json = {};
            json.type = this.value;
            json.page = this.currentPage1;
            json.pageSize = this.pageSize;
            getAllZoomInfo(json).then((res)=>{
                if(res.code === 200){
                    // console.log(res.data.info);
                    this.total1 = res.data.total;
                    this.tableData = res.data.info;
                    // this.showTable = false;
                }
            }).then(()=>{
                
            })
        },

        //获取所有园区类型占比
        getTypeNum(){
            getAlltypesNum({}).then(res => {
                if(res.code === 200){
                    this.zoomNumList = res.data;
                    this.zoomNumList.forEach(val => {
                        this.zoomNameList.push(val.name)
                    });
                    // console.log(res.data,"typesnum");
                }
            }).then(()=>{
                this.echartInit();
            })
        },

        //echart初始化
        echartInit() {
            let myChart = this.$echarts.init(document.getElementById('myChart'),'macarons');
            var option = {
                title: {
                    text: '园区类型分布',
                    subtext: '',
                    left: 'center'
                },
                tooltip: {
                    trigger: 'item',
                    formatter: '{a} <br/>{b} : {c} ({d}%)'
                },
                legend: {
                    left: 'center',
                    top: 'bottom',
                    data: this.zoomNameList
                },
                toolbox: {
                    show: true,
                    feature: {
                        mark: {
                            show: true
                        },
                        dataView: {
                            show: true,
                            readOnly: false
                        },
                        magicType: {
                            show: true,
                            type: ['pie', 'funnel']
                        },
                        restore: {
                            show: true
                        },
                        saveAsImage: {
                            show: true
                        }
                    }
                },
                series: [{
                    name: '数量比例',
                    type: 'pie',
                    radius: [30, 110],
                    roseType: 'area',
                    data: this.zoomNumList
                }]
            };
            myChart.setOption(option,window.onresize = myChart.resize)
        }
    },
}
</script>

<style scoped lang="less">
    .content{
        display: flex;
        flex-wrap:wrap;
        height: 100%;
        overflow-y:scroll; 
        overflow-x:hidden;
    }
    .content-left{
        @media only screen and (min-width: 540px) {
            width: 60%;
            height: 100%;
        }
        @media only screen and (max-width: 540px) {
            width: 100%;
            margin-bottom: 20px;
        }
        
        // position: relative;

        .paginationClass{
            margin-top:20px;
            // position: absolute;
            float: right;
            right: 0px;
            bottom: 0px;
        }
    }

    .content-right{
        display: flex;
        justify-content: center;
        align-items:center;
        @media only screen and (min-width: 540px) {
            width: 39%;
            height: 100%;
        }
        @media only screen and (max-width: 540px) {
            width: 100%;
        }    
    }
    
</style>
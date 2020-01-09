<template>
    <div>
        <div class="header">
            <div class="header_top">
                <div class="header_title">
                    <svg class="icon-school" aria-hidden="true">
                        <use xlink:href="#icon-school"></use>
                    </svg>
                    <font>园区采集平台</font>
                </div>
                <div class="header_denglu" @click="loginout()"><i class="iconfont icon-denglu" style="font-size:16px;margin-right:5px"> &nbsp;退出</i></div>
            </div>

            <div class="header_down">
                <el-popover
                    placement="bottom"
                    width="420"
                    trigger="click">
                    <div class="ditu">
                        <div class="ditu_title">请选择底图</div>
                        <div class="ditu_content">
                            <div class="ditu_show" v-for="(map,index) in maps" :key="index">
                                <el-image
                                class="ditu_img"
                                :src="map.mapSrc"
                                fit="fill"
                                @click="mapValue = map.mapVal"
                                :class="{ ditu_active:  mapValue === map.mapVal}"></el-image>
                                <div class="ditu_name" :class="{ditu_name_active : mapValue === map.mapVal}">{{ map.mapVal }}</div>
                            </div>
                        </div>
                    </div>
                    <div class="edit" slot="reference">
                        <svg class="icon" aria-hidden="true">
                            <use xlink:href="#icon-tuceng"></use>
                        </svg>
                        <font>底图管理</font>
                    </div>
                </el-popover>

                <div class="edit" @click="showCrowdDiv()">
                    <svg class="icon" aria-hidden="true">
                        <use xlink:href="#icon-bianji"></use>
                    </svg>
                    <font>众包编辑</font>
                </div>

                <div class="edit" @click="showDataDiv()">
                    <svg class="icon" aria-hidden="true">
                        <use xlink:href="#iconjianqieban"></use>
                    </svg>
                    <font>属性报表</font>
                </div>

            </div>
        </div> 
        
        <transition name="slide" >
            <div class="crowd" v-show="showCrowd">
                <i class="el-icon-caret-left icon-toleft" @click="showCrowdDiv()"></i>            
                <Crowd/>
            </div>
        </transition>

        <transition name="el-zoom-in-top" >
            <div class="dataShow" v-if="showData">
                <i class="el-icon-circle-close icon-totop" @click="showDataDiv()"></i> 
                <Crowddata/>
            </div>
        </transition>
    </div> 
</template>

<script>
import Crowd from './Crowdedit.vue'
import Crowddata from './Crowddata.vue'
import Bus from "../../assets/js/bus.js"
import {logout} from '../../ajax/api'
export default {
    data(){
        return{
            showCrowd:false,
            showData:false,
            table:false,
            maps: [
                {
                    mapVal:"天地图",
                    mapSrc:require('../../assets/img/tiandi.png')
                },
                {
                    mapVal:"卫星影像",
                    mapSrc:require('../../assets/img/weixing.png')
                },
                {
                    mapVal:"谷歌",
                    mapSrc:require('../../assets/img/guge.png')
                },
                {
                    mapVal:"高德",
                    mapSrc:require('../../assets/img/gaode.png')
                },
                {
                    mapVal:"OpenStreetMap",
                    mapSrc:require('../../assets/img/OpenstreetMap.png')
                },
                {
                    mapVal:"Mapbox",
                    mapSrc:require('../../assets/img/Mapbox.png')
                },
                {
                    mapVal:"空白底图",
                    mapSrc:require('../../assets/img/kongbai.png')
                }
            ],
            mapValue:"天地图",
        }
    },
    mounted(){

    },
    watch:{
        mapValue() {
            Bus.$emit("loading");
            Bus.$emit("changeMap", this.mapValue);
        },
        
    },
    components:{
        Crowd,
        Crowddata
    },
    methods:{
        showCrowdDiv(){
            if(this.showCrowd){
                this.showCrowd = false;
                Bus.$emit("closeCrowdDiv",true);
            }else{
                this.showCrowd = true;
            }
        },
        showDataDiv(){
            if(this.showData){
                this.showData = false;
            }else{
                this.showData = true;
            }
            
        },
        loginout(){
            this.$confirm("是否要退出系统？", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
            }).then(()=>{
                logout().then(res =>{
                    // console.log(res)
                    if(res.code === 200){
                        this.$message({
                            message: "注销成功",
                            center: true
                        })
                        this.$router.push("/login");
                    }
                })
            }).catch(() => {
                return;
            })
        }
    }
}
</script>

<style scoped lang="less">
    .slide-enter-active {
        animation-name: slideInUp;
        animation-duration: 0.3s;
        animation-fill-mode: both;
    }
    .slide-leave-active {
        animation-name: slideOutDown;
        animation-duration: 0.3s;
        animation-fill-mode: both;
    }
    @keyframes slideInUp {
        0% {
            transform: translate3d(-100%, 0, 0);
            visibility: visible;
        }

        to {
            transform: translateZ(0);
        }
    }
    @keyframes slideOutDown {
        0% {
            transform: translateZ(0);
        }

        to {
            visibility: hidden;
            transform: translate3d(-100%, 0, 0);
        }
    }

    .header{
        width: 100%;
        height: 100px;
        background: #fff;
        position: fixed;
        top:0;
        z-index: 999;
        &_title{
            color:#4D4D4D;
            font-family:"微软雅黑";
            font-weight: 1;
        }
        &_denglu i:hover{
            color: #5AC8FA;
        }
        &_denglu{
            // 居右
            flex: 1;
            text-align: right;
            cursor: pointer;
        }
        &_top{
            height: 60px;
            display: flex;
            align-items: center;
            padding: 0 30px;

            font{
                font-size:22px;
                letter-spacing: 4px;
            }
        }
        &_down{
            height: 45px;
            background: #F7F8F8;
            display: flex;
            align-items: center;
            padding: 0 30px;

            .edit{
                border-right: 1px solid #B7BBBC;
                padding: 0 10px;
                cursor: pointer;
                position:relative;
                font{
                    font-size: 14px;
                }
            }
            .edit:hover::after {
                content: "";
                display: block;
                position:absolute;
                background: #5AC8FA;
                width: 80%;
                height: 2px;  
                margin-top: 4px;
            }
        }

        .icon {
            width: 1.2em;
            height: 1.2em;
            vertical-align: -0.15em;
            fill: currentColor;
            overflow: hidden;
        }

        .icon-school{
            width: 2.3em;
            height: 2.3em;
            vertical-align: -0.15em;
            fill: currentColor;
            overflow: hidden; 
            margin-right: 10px;
        }
    }

    .ditu{
        &_title{
            width: 100%;
            height: 25px;
            border-bottom: 1px solid #000;
        }
        &_content{
            display: flex;
            margin-top:15px;
            flex-wrap: wrap;
        }
        &_show{
            margin:10px 10px;
            // display: flex !important;
            // justify-content: center;
            // align-items: center;
            width: 120px;
            cursor: pointer;
            // height: 135px;
        }
        &_img{
            width: 120px;
            height: 80px;
            -moz-box-shadow:0px 1px 8px #333333; 
            -webkit-box-shadow:0px 1px 8px #333333; 
            box-shadow:0px 1px 8px #333333;
        }
        &_img:hover{
            -moz-box-shadow:0px 1px 9px #5AC8FA; 
            -webkit-box-shadow:0px 1px 9px #5AC8FA; 
            box-shadow:0px 1px 9px #5AC8FA;
        }
        &_name{
            text-align: center;
            font-size:14px;
        }
        &_name_active{
            color: #5AC8FA;
        }
        &_active{
            -moz-box-shadow:0px 1px 9px #5AC8FA; 
            -webkit-box-shadow:0px 1px 9px #5AC8FA; 
            box-shadow:0px 1px 9px #5AC8FA;
        }
    }

    .crowd{
        height: 100%;
        width: 280px;
        background: #F7F8F8;
        z-index:999;
        position: fixed;
        top:105px;
        left: 0;
        padding: 25px 5px;
        border-top: 1px solid #E4E4E5;
        border-right: 1px solid rgb(189, 189, 189);

        .icon-toleft{
            display: block;
            position: absolute;
            top:2px;
            right:0px;
            font-size: 20px;
            color: #BABBBE;
            cursor: pointer;
            z-index: 1005;
        }

        .icon-toleft:hover{
            color: #5AC8FA;
        }
    }

    .dataShow{
        height: 70%;
        padding-bottom: 40px; 
        width: 100%;
        background: #fff;
        z-index:999;
        position: fixed;
        top:105px;
        left: 0;

        .icon-totop{
            display: block;
            position: absolute;
            bottom:10px;
            right:49%;
            font-size: 24px;
            color: #BABBBE;
            cursor: pointer;
            z-index: 1005;
        }
        .icon-totop:hover{
            color: #5AC8FA;
        }
    }
</style>
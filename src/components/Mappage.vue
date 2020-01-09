<template>
    <div id="map-page">
        <Header/>
         <div class="gs-interact">
            <div class="control-btn">
                <!-- <div class="zoom" @click="toggleZoom">
                <svg class="icon" aria-hidden="true">
                    <use xlink:href="#icon-dingwei1"></use>
                </svg>
                </div> -->
            </div>
            <div class="layerControl" @click="toggleSetting">
                <svg class="icon" aria-hidden="true">
                <use xlink:href="#icon-tuceng1"></use>
                </svg>
            </div>
            <div class="button-bar" v-show="showButton">
                <el-button v-show="cmd_zhongbaobianji" :plain="true" class="gs-button" @click="toggleFeatureEdit">
                    <svg class="icon" aria-hidden="true">
                        <use xlink:href="#icon-bianji"></use>
                    </svg>
                    众包编辑
                </el-button>
            </div>
         </div>
        
        <gs-map class="gs-map" :initialData="initialData" v-if="showMap"></gs-map>
        
    </div>
</template>

<script>
import gsMap from './map/Map.vue';
import Header from './header/Header.vue'

export default {
    name:"map-page",
    data(){
        return{
            showMap: true,
            initialData: {},
            showSetting:true,
            showButton: true,
            cmd_zhongbaobianji:false,
            showFeatureEdit:true,
        }
    },
    methods:{
        toggleSetting(){ //图层管理卡片开关
            let temp = !this.showSetting
            Bus.$emit("closeAll")
            this.showSetting = temp
            if(!this.showSetting){
                Bus.$emit("closePopover")
            }
        },
        toggleFeatureEdit(){
            let temp = !this.showFeatureEdit
            Bus.$emit("closeAll")
            this.showFeatureEdit = temp

        },
    },
    created() {
        this.initialData = {"geoserver":{"style01":"cals01polygonregiongd-style","style02":"cals02polygonblockgd-style","style10_2":"cals10polygonbusinesscircleselected-style","style10_1":"cals10polygonbusinesscircle-style","style05":"cals05pointchannelscrgd-style","layerName01":"cals01polygonregiongd","layerName02":"cals02polygonblockgd","layerName03":"cals03gridchannelscrgd","style03_4":"cals03gridid-style","style06_1":"cals06polygonblockscrgd-style","style03_3":"cals03gridselected-style","style04_2":"cals04gridhbid-style","style08_1":"cals08polygonresponsibilityfieldscr-style","style06_2":"cals06polygonblockselectedgd-style","style07_1":"cals07polygonresponsibilityfield-style","style08_2":"cals08polygonresponsibilityfieldscrselected-style","style09_1":"cals09polygonintegrategrid-style","layerName04":"cals04gridhbchannelscrgd","style12":"cals12gridboundarygd-style","layerName05":"cals05pointchannelscrgd","layerName06":"cals06polygonblockscrgd","layerName07":"cals07polygonresponsibilityfield","layerName08":"cals08polygonresponsibilityfieldscr","layerName09":"cals09polygonintegrategrid","url":"http://118.126.64.227:8080/geoserver/postgres/wms","style03_2":"cals03gridtop20-style","style04_1":"cals04gridhbintival-style","style03_1":"cals03gridintival-style","layerName10":"cals10polygonbusinesscircle","layerName11":"cals11polygonresponsibilityfieldscrqd","layerName12":"cals12gridboundarygd"},"city":[{"id":1,"level":2,"region":"广州","fid":0,"gpsLon":113.2760010000,"gpsLat":23.1357585947},{"id":2,"level":2,"region":"深圳","fid":0,"gpsLon":114.0439987000,"gpsLat":22.5489396658},{"id":3,"level":2,"region":"东莞","fid":0,"gpsLon":113.7320023000,"gpsLat":22.9803320647},{"id":4,"level":2,"region":"佛山","fid":0,"gpsLon":113.0589981000,"gpsLat":23.0007831870},{"id":5,"level":2,"region":"珠海","fid":0,"gpsLon":113.5220032000,"gpsLat":22.2887320465},{"id":6,"level":2,"region":"中山","fid":0,"gpsLon":113.3970032000,"gpsLat":22.5186111908},{"id":7,"level":2,"region":"江门","fid":0,"gpsLon":113.0490036000,"gpsLat":22.6567781377},{"id":8,"level":2,"region":"惠州","fid":0,"gpsLon":114.4749985000,"gpsLat":23.1597858906},{"id":9,"level":2,"region":"汕头","fid":0,"gpsLon":116.6350021000,"gpsLat":23.3865305264},{"id":10,"level":2,"region":"汕尾","fid":0,"gpsLon":115.4309998000,"gpsLat":22.7438380862},{"id":11,"level":2,"region":"揭阳","fid":0,"gpsLon":116.3580017000,"gpsLat":23.5259632875},{"id":12,"level":2,"region":"潮州","fid":0,"gpsLon":116.6669998000,"gpsLat":23.6967241869},{"id":13,"level":2,"region":"湛江","fid":0,"gpsLon":110.3690033000,"gpsLat":21.2840159788},{"id":14,"level":2,"region":"茂名","fid":0,"gpsLon":110.8580017000,"gpsLat":21.6727398584},{"id":15,"level":2,"region":"阳江","fid":0,"gpsLon":111.9810028000,"gpsLat":21.6643028216},{"id":16,"level":2,"region":"韶关","fid":0,"gpsLon":113.5650024000,"gpsLat":24.9160799366},{"id":17,"level":2,"region":"肇庆","fid":0,"gpsLon":112.4660034000,"gpsLat":23.0999214550},{"id":18,"level":2,"region":"清远","fid":0,"gpsLon":113.1029968000,"gpsLat":23.6223436271},{"id":19,"level":2,"region":"云浮","fid":0,"gpsLon":111.9509964000,"gpsLat":22.8440781746},{"id":20,"level":2,"region":"河源","fid":0,"gpsLon":114.6429977000,"gpsLat":23.6902738206},{"id":21,"level":2,"region":"梅州","fid":0,"gpsLon":116.1050034000,"gpsLat":24.2871154772}],"lbl_aim":[{"id":1,"name":"自营","type":1},{"id":2,"name":"社会","type":1}],"sessionid":"69fdf187-018e-44a1-87c5-fb4372612dc1","lbl_type":[{"id":6,"name":"竞争补点","type":2},{"id":7,"name":"不饱和补点","type":2},{"id":4,"name":"新增补点","type":2}]
        }
    },
    mounted() {

    },
    components:{
        gsMap,
        Header
    },
    watch:{

    }
}
</script>

<style scoped>
#map-page {
	position: absolute;
	top: 0;
	left: 0;
	margin: 0;
	padding: 0;
	width: 100%;
	height: 100%;
	font-family: "Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "微软雅黑", Arial, sans-serif;
	-webkit-font-smoothing: antialiased;
	/*设置字体反锯齿*/
	-moz-osx-font-smoothing: grayscale;
	/*兼容火狐浏览器中设置字体的抗锯齿或者说光滑度*/
	color: #2c3e50;

}

.gs-map {
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	overflow: hidden;
	z-index: 0;
}

.gs-interact {
	position: absolute;
	top: 0;
	left: 0;
	width: 100vw;
	height: auto;
	z-index: 10;
	pointer-events: none;
	display: flex;
	flex-direction: row;
	justify-content: flex-start;
}

.gs-interact .layerControl {
	position: absolute;
	left: 0;
	top: 0;
	margin-top: 10px;

}

.icon {
	font-size: 14px;
	width: 16px;
	height: 16px;
}

.button-bar {
	display: flex;
	flex-direction: row;
	flex-wrap: wrap;

}

.button-bar .gs-button {
	margin: 10px 0 5px 3px;
	height: 35px;
	min-height: 35px;
	pointer-events: auto;
	width: auto;
}

</style>
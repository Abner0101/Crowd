<!--
  describe："地图组件——包含所有地图处理方法和事件"
  created by：Guan xiaojun
-->
<template>
  <div>
    <div id="map">
      <div id="location" class="gs-tooltip" :style="style">
        <span>经度：{{currentLon}},</span>
        <span>纬度：{{currentLat}}</span>
      </div>
      <div id="mapTooltip" class="gs-tooltip" :style="tooltipStyle">
        <span v-show="drawFlag == true">{{currentTooltip}}</span>
        <!--查看要素的标识icon-->
        <span v-show="propertiesFlag == true"> 
          <svg class="icon mapvue-icon" aria-hidden="true" style="font-size:15px;">
            <use xlink:href="#icon-info"></use>            
          </svg>
        </span>
        <!--删除要素的标识icon-->
        <span v-show="deleteFlag == true"> 
          <svg class="icon mapvue-icon" aria-hidden="true" style="font-size:15px;">
            <use xlink:href="#icon-lajitong"></use>            
          </svg>
        </span>
      </div>
    </div>
    <!-- <canvas id="canvas"></canvas> -->
  </div>
</template>

<script>
import Bus from "../../assets/js/bus.js";
// import $ from "jquery";
import { constants } from 'http';
import {pushGeo, updateGeo, removeFeature} from '@/ajax/api'
import axios from 'axios';
import * as turf from '@turf/turf'

export default {
  name: "Map",
  props: ["initialData"],
  data() {
    // cityAdd:判断广州行政区图层是否已加载,city:行政区地图
    let cityObj = { city: null, cityAdd: 0 };
    // gridAdd:判断单元格图层是否已加载,grid:1000米单元格图
    let gridObj = { grid: null, gridAdd: 0, gridDetail: false };
  
    // baseMap_road:道路图层,baseMap_annotation:注记图层
    let baseMap = { baseMap_road: null, baseMap_annotation: null };
    // drawFlag:是否点击画图按钮,判断是否开启画图模式,draw:绘制对象,old_feature://当前绘制的图形要素,source:多边形的数据源
    let drawPolygonObject = {
      drawFlag: 0,
      draw: null,
      old_feature: null,
      source: null,
      vector: null
    };
    let crowdDrawObject = {
      drawFlag: 0,
      draw: null, //绘制控件
      modify:null, //修改控件
      snap:null, //捕捉控件
      old_feature: null,
      source: null,
      vector: null,
      crowdLayer:null,
      crowdLayerAdd: 0,
    };
    // 单元格高亮显示图层
    let highLightVector_obj = { highLightVector: null, highLightAdd: 0 };
    // 渠道合理性图层高亮显示图层
    let highLightValidate_obj = {
      highLightValidate: null,
      highLightValidateAdd: 0
    };
    // 责任田高亮图层
    let highLightRespfieObj = { highLightRespfie: null , highLightRespfieAdd: 0 };
    //商圈高亮图层
    let highLightBusCircleObj= { highLightBusCircle: null, highLightBusCircleAdd: 0};
    //单元格范围图层
    let gridBoundObj = {
      gridBound:null, gridBoundAdd:0
    };
    // Marker图层
    let MarkerVector_obj = {
      MarkerVector: [],
      singleMarkerVector: null,
      isMarkerZoom: false
    };

    let modifyObj = {
      wfsLayer:null,
      modifyLayer: null,
      wfsLayerAdd: 0,
      modifyFids: [],//修改要素的fid，-1指的是无要素被修改
      modifyGeoJson: "", //存储被修改要素的geojson
      select: null,
      modify: null,
      modifySource: null,

    }
    return {
      cityObj,
      gridObj,
      baseMap,
      drawPolygonObject,
      highLightVector_obj,
      MarkerVector_obj,
      pureCoverage: false,
      bounds: [
        112.95026410622809,
        22.591001193836636,
        114.05819004861627,
        23.93758208432624
      ],
      map: null,
      timeOutId: null,
      geoserverProperties: {},
      channelRegion: "",
      circleVectorObj: {circleVector: null},
      coorCardShow: false,
      style: {
        left: "",
        top: "",
        display: "none"
      },
      tooltipStyle: {
        left: "",
        top: "",
        display: "none"
      },
      currentLon: "",
      currentLat: "",
      currentTooltip:"",
      layerList: [],//存储边界图层和单元格图层
      gridList: [],//存储单元格图层
      drawArea: false,
      selectPoint: false,
      distance: "",
      clickCoor: "",
      earthquakeWaveMarkerList: [],
      highLightRespfieObj,
      highLightBusCircleObj,
      heatMap: { heatMapLayer: null },
      drawFlag:false, //是否开始绘制
      deleteFlag:false,
      propertiesFlag:false,//是否显示字段
      modifyFlag: false,//是否修改已有要素
      popFlag: true,
      drawendFlag: false,//是否完成一次绘制
      geojson:"",
      modifyObj,
      crowdDrawObject,
    };
  },
  methods: {
    /* 构建wms图层
     * @params Object map 地图对象
     * @params String layerName 图层名称
     * @params String style 图层样式名称
     * */
    _sourceLayer(url, layerName, style) {
      let sourceLayer = new ol.layer.Image({
        source: new ol.source.ImageWMS({
          ratio: 1,
          url: url,
          params: {
            FORMAT: "image/png",
            VERSION: "1.1.1",
            STYLES: style, //styles为空
            LAYERS: layerName
          }
        })
      });
      return sourceLayer;
    },   

    /* 重新加载已加载的图层
     * @params Object map 地图对象
     * @params Object cityObj 行政区图层对象
     * @params Object gridObj 渠道单元格图层对象
     * @params Object blockObj 区块图层对象
     * @params Object channelObj 渠道点图层对象
     * @params Object ProGridObj 家宽图层对象
     * @oarams Object busCircleObj 商圈图层对象
     * */
    judgeCurrentLayer(
      map,
      cityObj,
      gridObj,
      crowdDrawObject,
      MarkerVector_obj      
    ) {
      if (gridObj.gridAdd) {
        map.removeLayer(gridObj.grid);
        map.addLayer(gridObj.grid);
      }     
      if (cityObj.cityAdd) {
        map.removeLayer(cityObj.city);
        map.addLayer(cityObj.city);
      }
      if (MarkerVector_obj.MarkerVector.length > 0) {
        for (let j = 0; j < MarkerVector_obj.MarkerVector.length; j++) {
          map.removeLayer(MarkerVector_obj.MarkerVector[j]);
          map.addLayer(MarkerVector_obj.MarkerVector[j]);
        }
      }
      if(crowdDrawObject.crowdLayerAdd){
        map.removeLayer(crowdDrawObject.crowdLayer);
        map.addLayer(crowdDrawObject.crowdLayer);
      }
    },
    /* 切换底图
     * @params Object map 地图对象
     * @params String map_Name 底图名称
     * @params Object MarkerVector_obj 底图对象
     * */
    radio_change(map, map_Name, baseMap) {
      //获取瓦片地图
      function _getTile(url) {
        let tileImage = new ol.layer.Tile({
          source: new ol.source.XYZ({
            url: url
          })
        });
        return tileImage;
      }
      map.removeLayer(baseMap.baseMap_road);
      map.removeLayer(baseMap.baseMap_annotation);
      switch (map_Name) {
        case "tian_di_tu_road_layer":
          baseMap.baseMap_road = _getTile(
            "http://t4.tianditu.com/DataServer?T=vec_w&x={x}&y={y}&l={z}&tk=076410d95f484938c7474b38c391c527"
          ); //天地图道路图层定义
          baseMap.baseMap_annotation = _getTile(
            "http://t3.tianditu.com/DataServer?T=cva_w&x={x}&y={y}&l={z}&tk=076410d95f484938c7474b38c391c527"
          ); //天地图注记图层定义
          map.addLayer(baseMap.baseMap_road); //加载天地图道路图层
          map.addLayer(baseMap.baseMap_annotation); //加载天地图注记图层
          break;
        case "google_map":
          baseMap.baseMap_road = _getTile(
            "http://www.google.cn/maps/vt?lyrs=m@189&gl=cn&x={x}&y={y}&z={z}"
          );
          baseMap.baseMap_annotation = null;
          map.addLayer(baseMap.baseMap_road);
          break;
        case "gaode_map":
          baseMap.baseMap_road = _getTile(
            "http://webst0{1-4}.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=7&x={x}&y={y}&z={z}"
          );
          baseMap.baseMap_annotation = null;
          map.addLayer(baseMap.baseMap_road);
          break;
        case "baidu_layer":
          let resolutions = [];
          for (let i = 0; i < 19; i++) {
            resolutions[i] = Math.pow(2, 18 - i);
          }
          let baidu_source = new ol.source.TileImage({
            projection: ol.proj.get("EPSG:3857"),
            tileGrid: new ol.tilegrid.TileGrid({
              origin: [0, 0],
              resolutions: resolutions
            }),
            tileUrlFunction: function(tileCoord, pixelRatio, proj) {
              if (!tileCoord) {
                return "";
              }
              let z = tileCoord[0];
              let x = tileCoord[1];
              let y = tileCoord[2];

              if (x < 0) {
                x = "M" + -x;
              }
              if (y < 0) {
                y = "M" + -y;
              }

              return (
                "http://online3.map.bdimg.com/onlinelabel/?qt=tile&x=" +
                x +
                "&y=" +
                y +
                "&z=" +
                z +
                "&styles=pl&udt=20151021&scaler=1&p=1"
              );
            }
          });
          baseMap.baseMap_road = new ol.layer.Tile({
            source: baidu_source
          });
          map.addLayer(baseMap.baseMap_road);
          baseMap.baseMap_annotation = null;
          break;
        case "tian_di_tu_satellite_layer":
          baseMap.baseMap_road = _getTile(
            "http://t3.tianditu.com/DataServer?T=img_w&x={x}&y={y}&l={z}&tk=076410d95f484938c7474b38c391c527"
          );
          baseMap.baseMap_annotation = _getTile(
            "http://t3.tianditu.com/DataServer?T=cva_w&x={x}&y={y}&l={z}&tk=076410d95f484938c7474b38c391c527"
          );
          map.addLayer(baseMap.baseMap_road);
          map.addLayer(baseMap.baseMap_annotation);
          break;
        case "blank":
          baseMap.baseMap_road = null;
          baseMap.baseMap_annotation = null;
          break;
        case "OpenStreetMap":
          baseMap.baseMap_road = new ol.layer.Tile({
            source : new ol.source.OSM()
          })
          map.addLayer(baseMap.baseMap_road);
          baseMap.baseMap_annotation = null;
          break;
        case "Mapbox":
          baseMap.baseMap_road = _getTile(
            'https://api.mapbox.com/styles/v1/mxd/cjxjv18st329p1dqurbh061tf/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoibXhkIiwiYSI6ImNqd3UyeTlsNzAxMDc0Y21sZjRsc3NxM2wifQ.SWaiFdzJMx0sKxF6mfZ3qw' 
          )
          baseMap.baseMap_annotation = null;
          map.addLayer(baseMap.baseMap_road);
          break;
      } //switch
    },
    /* 绘制多个marker
     * @params Object map 地图对象
     * @params Object MarkerVector_obj marker对象
     * @params Array coorList marker坐标列表
     * @params String image_path marker图片路径
     * */
    drawMarker(map, MarkerVector_obj, coorList, image_path) {
      for (let j = 0; j < MarkerVector_obj.MarkerVector.length; j++) {
        map.removeLayer(MarkerVector_obj.MarkerVector[j]);
      }
      //绘制marker的图层
      let features = [];
      for (let i = 0; i < coorList.length; i++) {
        let locate = coorList[i]; //坐标位置
        let feature = new ol.Feature({
          //坐标点转换为要素
          geometry: new ol.geom.Point(locate)
        });
        features.push(feature);
        let source = new ol.source.Vector({
          features: [feature]
        });
        MarkerVector_obj.MarkerVector[i] = new ol.layer.Vector({
          style: new ol.style.Style({
            image: new ol.style.Icon({
              anchor: [0.5, 23], //位置
              anchorXUnits: "fraction",
              anchorYUnits: "pixels",
              scale: 0.15, //图片比例
              opacity: 1,
              src: image_path //图片位置
            }),
            text: new ol.style.Text({
              offsetY: 10,
              scale: 2, //图片比例
              text: (i + 1).toString(),
              fill: new ol.style.Fill({
                color: "#F8F8FF"
              })
            })
          })
        });
        MarkerVector_obj.MarkerVector[i].setSource(source); //更新vector图层内容
        map.addLayer(MarkerVector_obj.MarkerVector[i]); //加载vector图层
      }
    },
    /* 绘制单个marker
     * @params Object map 地图对象
     * @params Object MarkerVector_obj marker对象
     * @params Array coor marker坐标
     * @params String image_path marker图片路径
     * */
    drawSingleMarker(map, MarkerVector_obj, coor, image_path) {
      map.removeLayer(MarkerVector_obj.singleMarkerVector);
      //绘制marker的图层
      MarkerVector_obj.singleMarkerVector = new ol.layer.Vector({
        style: new ol.style.Style({
          image: new ol.style.Icon({
            anchor: [0.5, 23], //位置
            anchorXUnits: "fraction",
            anchorYUnits: "pixels",
            scale: 0.15, //图片比例
            opacity: 1,
            src: image_path //图片位置
          })
        })
      });
      let locate = coor; //坐标位置
      let feature = new ol.Feature({
        //坐标点转换为要素
        geometry: new ol.geom.Point(locate)
      });
      let source = new ol.source.Vector({
        features: [feature]
      });
      MarkerVector_obj.singleMarkerVector.setSource(source); //更新vector图层内容
      map.addLayer(MarkerVector_obj.singleMarkerVector); //加载vector图层
    },
    /* 绘制多边形
     * @params Object map 地图对象
     * @params Object drawPolygonObject 多边形对象
     * */
    drawPolygon(map, drawPolygonObject) {
      drawPolygonObject.drawFlag = 1; //开启画图模式，禁用点击弹框功能
      drawPolygonObject.source = new ol.source.Vector({ wrapX: false });
      //实例化一个Vector作为绘制层
      let vector = new ol.layer.Vector({
        source: drawPolygonObject.source,
        style: new ol.style.Style({
          //填充样式
          fill: new ol.style.Fill({
            color: "rgba(255, 255, 255, 0.2)"
            // color: "rgba(255,0,0,0.5)"
          }),
          stroke: new ol.style.Stroke({
            //边界样式
            color: "#0000FF",
            // color: " 	#FF0000",
            width: 2
          }),
          image: new ol.style.Circle({
            //点要素样式
            radius: 7,
            fill: new ol.style.Fill({
              color: "#ffcc33"
            })
          })
        })
      });
      map.addLayer(vector); //加载绘图图层
      map.removeInteraction(drawPolygonObject.draw); //移除绘制图形

      let geometryFunction, maxPoints;
      drawPolygonObject.draw = new ol.interaction.Draw({
        source: drawPolygonObject.source,
        type: /** @type {ol.geom.GeometryType} */ ("Polygon"),
        // type: /** @type {ol.geom.GeometryType} */ ("Circle"),
        geometryFunction: geometryFunction,
        maxPoints: maxPoints
      });
      drawPolygonObject.draw.on(
        "drawstart",
        function(evt) {
          if (
            drawPolygonObject.old_feature != null &&
            drawPolygonObject.old_feature != "undifined"
          )
            drawPolygonObject.source.removeFeature(
              drawPolygonObject.old_feature
            ); //画图层开始前先删除之前画的图形
          drawPolygonObject.old_feature = evt.feature;
        },
        this
      );
      map.addInteraction(drawPolygonObject.draw);
    },
    //绘制众包图层
    drawCrowdPolygon(map, drawObject) {
      drawObject.drawFlag = 1; //开启画图模式，禁用点击弹框功能
      drawObject.source = new ol.source.Vector({ wrapX: false });
      //实例化一个Vector作为绘制层
      let vector = new ol.layer.Vector({
        source: drawObject.source,
        style: new ol.style.Style({
          //填充样式
          fill: new ol.style.Fill({
            color: "rgba(255, 255, 255, 0.2)"
            // color: "rgba(255,0,0,0.5)"
          }),
          stroke: new ol.style.Stroke({
            //边界样式
            color: "#0000FF",
            // color: " 	#FF0000",
            width: 2
          }),
          image: new ol.style.Circle({
            //点要素样式
            radius: 7,
            fill: new ol.style.Fill({
              color: "#ffcc33"
            })
          })
        })
      });
      map.addLayer(vector); //加载绘图图层
      map.removeInteraction(drawObject.draw); //移除绘制图形

      let geometryFunction, maxPoints;
      drawObject.draw = new ol.interaction.Draw({
        source: drawObject.source,
        type: /** @type {ol.geom.GeometryType} */ ("Polygon"),
        // type: ("MultiPolygon"),
        // type: /** @type {ol.geom.GeometryType} */ ("Circle"),
        geometryFunction: geometryFunction,
        maxPoints: maxPoints
      });
      drawObject.modify =  new ol.interaction.Modify({
        source:drawObject.source,
      })
      drawObject.snap = new ol.interaction.Snap({
        source:drawObject.source,
      })

      drawObject.draw.on("drawstart", evt => {
        
        // if (drawObject.old_feature != null && drawObject.old_feature != undefined){
        //   //画图层开始前先删除之前画的图形
        //   drawObject.source.removeFeature(drawObject.old_feature); 

        // }          
        // drawObject.old_feature = evt.feature;
      });
      drawObject.draw.on("drawend", evt => {
        Bus.$emit("haveDraw", true);
        this.drawendFlag = true;
        let intersect = this.checkPolygonIsSelfIntersection(evt.feature.values_.geometry.flatCoordinates)
        if(intersect){
          //  vector.source.removeFeature(evt.feature); 
            this.$message({
              type: "error",
              message: "请勿绘制自相交的多边形",
              center: true
            })
        }
        Bus.$emit("isSelfIntersect", intersect);
        map.removeInteraction(drawObject.draw);

        // this.currentTooltip ="点击绘制要素按钮进行保存或继续调整绘制的图形"
      })

      drawObject.modify.on("modifyend", evt => {
        //获得feature集合中的最后一个feature
        let feature = evt.features.item(evt.features.getLength() - 1);
        let intersect = this.checkPolygonIsSelfIntersection(feature.values_.geometry.flatCoordinates)
        if(intersect){
          //  vector.source.removeFeature(evt.feature); 
            this.$message({
              type: "error",
              message: "请勿绘制自相交的多边形",
              center: true
            })
        }
        Bus.$emit("isSelfIntersect", intersect);
      })
      //添加绘制交互、修改交互和捕捉交互
      map.addInteraction(drawObject.draw);
      map.addInteraction(drawObject.modify);
      map.addInteraction(drawObject.snap);
    },
    /* 绘制矩形（绘制加盟厅评估单元格）
     * @params Object map 地图对象
     * @params Object MarkerVector_obj 加盟厅单元格对象
     * @params Array coor 单元格中心点坐标
     * @params Number length 单元格边长
     * @params Number i 编号
     * @params String color 单元格颜色
     * @params Number opacity 单元格透明度
     * @params String text 单元格名称
     * */
    drawRectangle(map, MarkerVector_obj, coor, length, i, color, opacity, text) {
      let distance = lengthParams[length - 1];
      let minX = coor[0] - distance.longtitudeParams;
      let minY = coor[1] - distance.latitudeParams;
      let maxX = coor[0] + distance.longtitudeParams;
      let maxY = coor[1] + distance.latitudeParams;
      let feature = new ol.Feature({
        geometry: ol.geom.Polygon.fromExtent([minX, minY, maxX, maxY])
      });
      let source = new ol.source.Vector({
        features: [feature]
      });
      MarkerVector_obj.MarkerVector[i] = new ol.layer.Vector({
        style: new ol.style.Style({
          fill: new ol.style.Fill({
            color: color
          }),
          stroke: new ol.style.Stroke({
            color: color,
            width: 2
          }),
          text: new ol.style.Text({
            offsetY: 10,
            scale: 2, // 图片比例
            text: text,
            overflow: "line",
            textAlign: "center",
            fill: new ol.style.Fill({
              color: "#ffffff"
            })
          })
        }),
        opacity: opacity
      });
      MarkerVector_obj.MarkerVector[i].setSource(source); // 更新vector图层内容
      map.addLayer(MarkerVector_obj.MarkerVector[i]); // 加载vector图层
    },
    /* 清除绘制的多边形
     * @params Object map 地图对象
     * @params Object drawPolygonObject 多边形对象
     * */
    testBoxClear(map, drawPolygonObject) {
      //清空所有图形
      let features = drawPolygonObject.source.getFeatures();
      if (features != null && features.length > 0) {
        for (let x in features) {
          let properties = features[x].getProperties();
          let id = properties.id;
          drawPolygonObject.source.removeFeature(features[x]);
        }
      }
      // //移除交互功能绘制控件
      // map.removeInteraction(drawPolygonObject.draw);
      // //结束画图模式，可以重新启用点击弹框功能
      // drawPolygonObject.drawFlag = 0;
    },
    //清空绘制的众包草图
    clearCrowdSourceDraw(map, drawPolygonObject) {
      //清空所有图形
      let features = drawPolygonObject.source.getFeatures();
      if (features != null && features.length > 0) {
        for (let x in features) {

          drawPolygonObject.source.removeFeature(features[x]);
          //需要给要素添加一个属性值才能成功插入数据库
          features[x].setProperties("x");//随意插入一个字符，以免properties属性为空
          // features[x].set("geometry_name", "the_geom");          
        }
        //将绘制完成的要素转换为geojson格式
        this.geojson = new ol.format.GeoJSON().writeFeatures(features);

        let json = JSON.parse(this.geojson);
        //添加坐标信息
        let crs = {
          type:'name',
          properties:{
            name:"urn:ogc:def:crs:EPSG::4326"
          }
        }
        json.crs = crs;
        json.totalFeature = features.length; //添加totalFeature属性

        this.geojson = JSON.stringify(json);
      }
      //移除交互功能绘制控件
      map.removeInteraction(drawPolygonObject.draw);
      //结束画图模式，可以重新启用点击弹框功能
      drawPolygonObject.drawFlag = 0;
    },
    /* 结束多边形绘制操作
     * @params Object map 地图对象
     * @params Object drawPolygonObject 多边形对象
     * */
    stopDrawing(map, drawPolygonObject) {
      //移除交互功能绘制控件
      map.removeInteraction(drawPolygonObject.draw);
      //结束画图模式，可以重新启用点击弹框功能
      drawPolygonObject.drawFlag = 0;
    },
    //根据传入的数组，判断多边形是否自相交
    checkPolygonIsSelfIntersection(array){
      let coors = [], intersect = false;
      for(let i = 0; i < array.length-1; i= i+2){ 
        let coor = [array[i], array[i+1]];
        coors.push(coor)
      }
      //构造线
      var lineArray = [];
      for(var j = 0; j< coors.length-1; j++){
          var line = [];
          line.push(coors[j]);
          line.push(coors[j+1]);
          lineArray.push(line);
      }
      var intersection, line1, line2;
      for(var k = 0; k < lineArray.length; k++){
          for(var m = 2; m < lineArray.length - k; m++){
              line1 = turf.lineString(lineArray[k]);
              line2 = turf.lineString(lineArray[k + m]);
              intersection = turf.lineIntersect(line1, line2);
              if(intersection.features.length > 0){
                //排除首尾两条线相交的情况
                if(k == 0 && k+m == lineArray.length - 1){
                  // debugger;
                }
                else{
                  intersect = true;
                  break;
                }
              }
          }
          if(intersect){
              break;
          }
      }
      return intersect;
    },
    /* 根据行政区更新选择结果
     * @params String layerName 图层名
     * @params String region 城市
     * */
    _updateFilterByRegion(layerName, region) {
      if (this.pureCoverage) {
        return;
      }
      let filter3;
      let filterType = "cql";

      let filterParams = {
        FILTER: null,
        CQL_FILTER: null,
        FEATUREID: null
      };

      if (region != "") {
        filter3 = "region=" + "'" + region + "'";
      } else {
        filter3 = "";
      }
      if (filter3.replace(/^\s\s*/, "").replace(/\s\s*$/, "") != "") {
        if (filterType == "cql") {
          filterParams["CQL_FILTER"] = filter3;
        }
      }
      layerName.getSource().updateParams(filterParams);
      filter3 = null;
    },
    /* 根据地市更新单元格图层选择结果
     * @params String layerName 图层名
     * @params String city 城市
     * */
    _updateFilterByCity(layerName, city) {
      if (this.pureCoverage) {
        return;
      }
      let filter3;
      let filterType = "cql";

      let filterParams = {
        FILTER: null,
        CQL_FILTER: null,
        FEATUREID: null
      };

      if (city != "") {
        filter3 = "city=" + "'" + city + "'";
      } else {
        filter3 = "";
      }
      if (filter3.replace(/^\s\s*/, "").replace(/\s\s*$/, "") != "") {
        if (filterType == "cql") {
          filterParams["CQL_FILTER"] = filter3;
        }
      }
      layerName.getSource().updateParams(filterParams);
      filter3 = null;
    },
    /* 根据要素类型更新众包图层的显示
     * */
    _updateFilterByType(layerName, typeList) {
      if (this.pureCoverage) {
        return;
      }
      let filter3;
      let filterType = "cql";

      let filterParams = {
        FILTER: null,
        CQL_FILTER: null,
        FEATUREID: null
      };
      let sql = "";
      //取出数组中的元素，包裹上单引号
      for(let i = 0; i< typeList.length; i++){
        if(i == typeList.length -1 ){
          sql +=  "'"+ typeList[i]+ "'";
          break;
        }
        sql +="'"+ typeList[i] + "', ";
        
      }
      filter3 = "type in (" + sql + ")";        

      if (filter3.replace(/^\s\s*/, "").replace(/\s\s*$/, "") != "") {
        if (filterType == "cql") {
          filterParams["CQL_FILTER"] = filter3;
        }
      }
      layerName.getSource().updateParams(filterParams);
      filter3 = null;
    },
    /* 回到原点
     * @params Array centerCoor 原点坐标
     * @params Object map 地图对象
     * */
    _zoomToCenter(map, centerCoor) {
      let view = map.getView(); //获取当前视图
      let duration = 2000; //持续时间（毫秒）
      let start = +new Date();
      // ol3 平移效果
      // let pan = new ol.animation.pan({
      //   duration: duration, //设置持续时间
      //   source: /** @type {ol.Coordinate} */ (view.getCenter()),
      //   start: start
      // });
      // //反弹效果
      // let bounce = new ol.animation.bounce({
      //   duration: duration, //设置持续时间
      //   resolution: 2 * view.getResolution(), //4倍分辨率
      //   start: start
      // });
      // map.beforeRender(pan, bounce); //地图渲染前设置动画效果(pan+bounce)

      view.animate({
        zoom: 9,
        duration: duration,
      })
      // ol4 平移效果
      view.animate({
        center: centerCoor,
        duration: duration,
      });
      view.setCenter(centerCoor);
      view.setZoom(14);
    },
    /* 绘制圆
     * @params Array centerCoor 圆心坐标
     * @params Number radius 半径
     * @params Number centerId 编号
     * @params Object circleVectorObj 圆对象
     * @params Object map 地图对象
     * */
    _addCircle(map, circleVectorObj, centerId, centerCoor, radius) {
      //创建要素
      var feature = new ol.Feature({
        id: centerId,
        geometry: new ol.geom.Circle(centerCoor, radius),
        name: "circle"
      });
      //创建样式
      circleVectorObj.circleVector = new ol.layer.Vector({
        style: new ol.style.Style({
          fill: new ol.style.Fill({
            color: "rgba(137,207,240,0.5)"
          }),
          stroke: new ol.style.Stroke({
            color: "#97FFFF",
            width: 1
          })
        })
      });
      //添加要素至图层
      let source = new ol.source.Vector({
        features: [feature]
      });
      circleVectorObj.circleVector.setSource(source);
      map.addLayer(circleVectorObj.circleVector);
    },
    /* 绘制地震波效果的点
     * @params Array coorList 坐标数组 (必须为数组结构)
     * @params Object map 地图对象，已删除
     * @params Array earthquakeWaveMarkerList 地震波图层数组，已删除
     * */
    drawEarthquakeWave(coorList) {
      if(this.earthquakeWaveMarkerList.length > 0) {
        this.earthquakeWaveMarkerList.forEach((marker) => {
          this.map.removeOverlay(marker);
        })
        this.earthquakeWaveMarkerList = [];
      }
      coorList.forEach((coor, index) => {
        const pointDiv1 = document.createElement('div');
        pointDiv1.className = 'gradient';
        this.earthquakeWaveMarkerList[index] = new ol.Overlay({
            element: pointDiv1,
            positioning: 'center-center'
        });
        this.earthquakeWaveMarkerList[index].setPosition(coor);
        this.map.addOverlay(this.earthquakeWaveMarkerList[index]);
      })
    },
    /* 绘制热力图
     * @params Array coorList 坐标数组
     * @params Object heatMapLayer 热力图对象
     * @params Object map 地图对象
     * */
    drawHeatMap(coorList, heatMap, map) {
      const heatMapData = new ol.source.Vector();
      coorList.forEach((coor) => {
        const point = new ol.geom.Point(coor);
        const pointFeature = new ol.Feature({
          geometry: point,
          weight: 20
        });
        heatMapData.addFeature(pointFeature);
      });
      //create the layer
      heatMap.heatMapLayer = new ol.layer.Heatmap({
        source: heatMapData,
        radius: coorList.length
      });
      map.addLayer(heatMap.heatMapLayer);
    },

    //根据fid对众包图层的要素进行删除
    deleteFeatureByFid(fid){
      //请求后台
      let dataJson = {
        fid:fid,
        table:"schools"
      }
      removeFeature(dataJson).then(response => {
        if(response.code == 200){
          this.$message({
            type: 'success',
            message: '删除成功!'
          });
          let zoom = this.map.getView().getZoom();
          this.crowdDrawObject.crowdLayer.getSource().refresh();

          setTimeout(() => {
            this.map.getView().setZoom(zoom+1);
          }, 500);
        }else{
          this.$message({
            type: 'error',
            message: '删除失败!'
          });
        }
      })
    },
    addModifyLayer(types){
      if(this.modifyObj.wfsLayerAdd){
        this.map.removeLayer(this.modifyObj.wfsLayer);
        this.modifyObj.wfsLayerAdd = 0;
      }
      this.modifyObj.modifySource = new ol.source.Vector();
      // this.modifyObj.modifyFid = fid;
      let condition = [];
      //遍历type，生成判断条件
      for(let i = 0; i< types.length; i++){
        condition.push(ol.format.filter.equalTo("type",types[i]));
      }

      let featureRequest = new ol.format.WFS().writeGetFeature({
        srsName: 'EPSG:4326',
        featureNS: "www.postgres.pub",//命名空间
        featurePrefix: 'postgres', //工作区
        featureTypes: ['schools'], //图层名
        outputFormat: 'application/json',
        filter: ol.format.filter.or(...condition) //传入判断条件
      })
      //请求geoserver，获得wfs格式的要素
      fetch('http://118.126.64.227:8080/geoserver/wfs', {
        method:'POST',
        body:new XMLSerializer().serializeToString(featureRequest)
      }).then(response => response.json())
      .then(json => {
        //将json转为features
        let features = new ol.format.GeoJSON().readFeatures(json);
        let vector = new ol.layer.Vector({
          source: new ol.source.Vector({
            features:features
          }),
          style:new ol.style.Style({
            fill:new ol.style.Fill({
              color: 'rgba(255,255, 255, 0.7)'
            }),
            stroke: new ol.style.Stroke({
              color:'#319FD3',
              width: 1.5
            })
          })
        })
        this.modifyFlag = false;
        
        this.modifyObj.wfsLayer = vector;
        this.modifyObj.wfsLayerAdd = 1;
        this.map.addLayer(this.modifyObj.wfsLayer);
        //创建选择、修改交互类
        this.modifyObj.select = new ol.interaction.Select({
          wrapX:false
        })
        this.modifyObj.modify = new ol.interaction.Modify({
          features:this.modifyObj.select.getFeatures()
        })
        
        this.map.addInteraction(this.modifyObj.select);
        this.map.addInteraction(this.modifyObj.modify);

        
        let fid;
        this.modifyObj.modify.on("modifyend", evt => {
          //获得feature集合中的最后一个feature
          let feature = evt.features.item(evt.features.getLength() - 1);
          let intersect = this.checkPolygonIsSelfIntersection(feature.values_.geometry.flatCoordinates)
          if(intersect){
            //  vector.source.removeFeature(evt.feature); 
              this.$message({
                type: "error",
                message: "请勿绘制自相交的多边形",
                center: true
              })
          }
          Bus.$emit("isSelfIntersect", intersect);
          let fid = feature.getId();
          //如果该fid没有在数组中找到，则将该fid的要素添加到source中
          if(this.modifyObj.modifyFids.indexOf(fid) < 0){
            this.modifyObj.modifyFids.push(fid);
            this.modifyObj.modifySource.addFeature(feature);
            // console.log(evt.features.pop(), "feature")
          }
          Bus.$emit("haveModify", true);
        })
      })    
    }
  },
  created() {
    // 切换底图
    Bus.$on("changeMap", data => {
      switch (data) {
        case "百度":
          this.radio_change(this.map, "baidu_layer", this.baseMap);
          this.judgeCurrentLayer(
            this.map,
            this.cityObj,
            this.gridObj,
            this.crowdDrawObject,
            this.MarkerVector_obj
          );
          break;
        case "天地图":
          this.radio_change(this.map, "tian_di_tu_road_layer", this.baseMap);
          this.judgeCurrentLayer(
            this.map,
            this.cityObj,
            this.gridObj,
            this.crowdDrawObject,
            this.MarkerVector_obj
          );
          break;
        case "谷歌":
          this.radio_change(this.map, "google_map", this.baseMap);
          this.judgeCurrentLayer(
            this.map,
            this.cityObj,
            this.gridObj,
            this.crowdDrawObject,
            this.MarkerVector_obj
          );
          break;
        case "高德":
          this.radio_change(this.map, "gaode_map", this.baseMap);
          this.judgeCurrentLayer(
            this.map,
            this.cityObj,
            this.gridObj,
            this.crowdDrawObject,
            this.MarkerVector_obj
          );
          break;
        case "卫星影像":
          this.radio_change(
            this.map,
            "tian_di_tu_satellite_layer",
            this.baseMap
          );
          this.judgeCurrentLayer(
            this.map,
            this.cityObj,
            this.gridObj,
            this.crowdDrawObject,
            this.MarkerVector_obj
          );
          break;
        case "空白底图":
          this.radio_change(this.map, "blank", this.baseMap);
          this.judgeCurrentLayer(
            this.map,
            this.cityObj,
            this.gridObj,
            this.crowdDrawObject,
            this.MarkerVector_obj
          );
          break;
        case "OpenStreetMap":
          this.radio_change(this.map, "OpenStreetMap", this.baseMap);
          this.judgeCurrentLayer(
            this.map,
            this.cityObj,
            this.gridObj,
            this.crowdDrawObject,
            this.MarkerVector_obj
          );
          break;
        case "Mapbox":
          this.radio_change(this.map, "Mapbox", this.baseMap);
          this.judgeCurrentLayer(
            this.map,
            this.cityObj,
            this.gridObj,
            this.crowdDrawObject,
            this.MarkerVector_obj
          );
          break;
      }
    });
   

    // 切换图层
    Bus.$on("changeGrid", data => {
      this.layerList = data; // 记录已加载的图层
      Bus.$emit("rateLabelShow", false); // 用于显示家宽占有率的组件不显示
      
      // 移除所有图层
      this.map.removeLayer(this.gridObj.grid);
      this.gridObj.gridAdd = 0;
      this.map.removeLayer(this.cityObj.city);
      this.cityObj.cityAdd = 0;
      if(this.crowdDrawObject.crowdLayerAdd){
        this.map.removeLayer(this.crowdDrawObject.crowdLayer);
        this.crowdDrawObject.crowdLayerAdd = 0;
      }
      // 图例不显示
      Bus.$emit("legendCardShow", false);
      Bus.$emit("legendButtonShow", false);
      // 将单元格图层至于底部
      let dataLength = data.length;
      for (let i = 0; i < dataLength; i++) {
        if (data[i] == "渠道单元格选址评分") {
          let temp = data[0];
          data[0] = data[i];
          data[i] = temp;
        } else if (data[i] == "家宽服务站单元格选址评分") {
          let temp = data[0];
          data[0] = data[i];
          data[i] = temp;
        } else if (data[i] == "责任田渠道合理性分布") {
          let temp = data[0];
          data[0] = data[i];
          data[i] = temp;
        }else if(data[i] == "商圈") {
          let temp = data[0];
          data[0] = data[i];
          data[i] = temp;
        // }else if(data[i] == "渠道合理性分布") {
        //   let temp = data[0];
        //   data[0] = data[i];
        //   data[i] = temp;
        // }else if(data[i] == "众包图层") {
        //   let temp = data[0];
        //   data[0] = data[i];
        //   data[i] = temp;
        }
        
      }
      // 加载图层
      for (let i in data) {
        switch (data[i]) {
          case "行政区":
            if (window.currentCity == "广东省") {
              this._updateFilterByCity(this.cityObj.city, "");
            } else {
              this._updateFilterByCity(this.cityObj.city, window.currentCity);
            }
            this.map.addLayer(this.cityObj.city);
            this.cityObj.city.set("opacity", 1);
            this.cityObj.cityAdd = 1;
            break;
         
          case "众包图层":
          //  this.map.removeLayer(this.crowdDrawObject.crowdSource);
            this.map.addLayer(
              this.crowdDrawObject.crowdLayer
            );
            this.crowdDrawObject.crowdLayer.set(
              "opacity",
              1
            );
            this.crowdDrawObject.crowdLayerAdd = 1;
            break;
        }
      }
    });
    // 图形绘制
    Bus.$on("enableDrawing", data => {
      this.drawFlag = data;
      if (data) this.drawPolygon(this.map, this.drawPolygonObject);
      else this.testBoxClear(this.map, this.drawPolygonObject);
    });

    // 回到原点
    Bus.$on("zoomToCenter", data => {
      this._zoomToCenter(this.map, window.centerCoor);
    });
     //响应是否开始绘制众包图层
    Bus.$on("enableDrawCrowd", data => {     
      //修改控制变量
      this.drawFlag = data;
      //清除原来绘制的要素
      this.crowdDrawObject.old_feature= null;
      if (data){
        this.popFlag = false; //禁止弹框
        //获得除了fid外的字段名
        // this.$http.jsonp(window.host2+"GetFeatureDescriptors.action",{
        //   params:{
        //     table:"schools"//表名在这里是写死的
        //   }
        // }).then(response => {
          //获得唯一标识要素的字段名
          // this.crowdDrawObject.idName = response.body[0];
          this.crowdDrawObject.idName = "school_na";
          this.crowdDrawObject.lastIdValue = "007";
          //获得已有唯一值中的最大值，达到字段自增长的效果
          // this.crowdDrawObject.lastIdValue = response.body[1];
        // })
        this.drawCrowdPolygon(this.map, this.crowdDrawObject);
      } else{
        this.clearCrowdSourceDraw(this.map, this.crowdDrawObject);
      } 
    });
    //添加新的要素，将新要素的geojson格式发送给后台
    Bus.$on("pushGeoJson", data => {
      let json = {
          geojson:this.geojson,
          table:"schools",//表名写死了
          data:data
      }
      //请求后台，向数据库插入要素            
     pushGeo(json).then(response => {
        if(response.code == 200){                  
         //实现图层的刷新显示

          let zoom = this.map.getView().getZoom();
          setTimeout(() => {
            this.map.getView().setZoom(zoom-1);
            this.$message({
              type: 'success',
              message: '保存成功!'
            });
          }, 5)
        }else{  //请求后台失败
          this.$message({
            type: 'error',
            message: '保存失败!'
          });
        }
      })
    
    })
    //响应激活删除按钮
    Bus.$on('enableDelete', data => {
      this.deleteFlag = data;
      if(data){
        this.popFlag = false; //禁止弹框
      }      
    })
    Bus.$on('removeItems',data => {
        this.deleteFeatureByFid(data);
    })
    //响应查看字段
    Bus.$on('enableGetProperties', data =>{
      this.propertiesFlag = data;
      if(data){
        this.popFlag = false; //禁止弹框
      }
    })
    //响应是否可以弹出单元格详情页
    Bus.$on("enablePop", data=>{
      this.popFlag = data;
    })
    //响应是否可调整形状 
    //param: data（判断是否开启调整）,save（判断是否保存），types（要显示的类型）
    Bus.$on("enableModify", (data, save, types) => {
      this.modifyFlag = data;
      if(data){
        this.addModifyLayer(types);
      }else{
        this.modifyObj.modifyFids = [];
        if(save){
          let features = this.modifyObj.modifySource.getFeatures();
          console.log(features, "features");
          if (features != null && features.length > 0) {
            for (let x in features) {
              //由于这里的features是从geojson转换而来，所以已经具备了属性，不必手动补全
              this.modifyObj.modifySource.removeFeature(features[x]);

              //将绘制完成的要素转换为geojson格式
              this.modifyObj.GeoJson = new ol.format.GeoJSON().writeFeatures(features);

            }
            
            // this.$http.jsonp(window.host2 + "UpdateGeometry.action", {
            let paramJson = {
                geojson: this.modifyObj.GeoJson,
                table: "schools",
            }
            updateGeo(paramJson).then(response => {
              if(response.code == 200){

                this.map.getView().setZoom(this.map.getView().getZoom()+1);
                this.$message({
                  type:"success",
                  message: "保存成功"
                })
              };
              //待返回请求结果之后再移除交互
              this.map.removeLayer(this.modifyObj.wfsLayer);
              this.modifyObj.wfsLayerAdd = 0;

              this.map.removeInteraction(this.modifyObj.modify);
              this.map.removeInteraction(this.modifyObj.select);
            })
          }
        }else {
          this.map.removeLayer(this.modifyObj.wfsLayer);
          this.modifyObj.wfsLayerAdd = 0;

          this.map.removeInteraction(this.modifyObj.modify);
          this.map.removeInteraction(this.modifyObj.select);
        }
        
      }
      
    })
    //接收传过来的类型数组，根据数组进行过滤显示
    Bus.$on("updateFilterByType", data => {
      if(!data || data.length == 0){
        this.crowdDrawObject.crowdLayer.setVisible(false);
      }else{        
        this._updateFilterByType(this.crowdDrawObject.crowdLayer,data);
        this.crowdDrawObject.crowdLayer.setVisible(true);
      }
    })
  },
  mounted() {
    // WMS发布地址
    this.geoserverProperties.url = this.initialData.geoserver.url;
    // 广东省行政区图层
    this.geoserverProperties.layerName01 = this.initialData.geoserver.layerName01;
    // 广东省区块图层
    this.geoserverProperties.layerName02 = this.initialData.geoserver.layerName02;
    // 广东省渠道单元格得分图层
    this.geoserverProperties.layerName03 = this.initialData.geoserver.layerName03;
    // 广东省家宽单元格得分图层
    this.geoserverProperties.layerName04 = this.initialData.geoserver.layerName04;
    // 广东省渠道点得分图层
    this.geoserverProperties.layerName05 = this.initialData.geoserver.layerName05;
    // 广东省渠道合理性得分图层
    this.geoserverProperties.layerName06 = this.initialData.geoserver.layerName06;
    //广深东佛责任田范围图层
    this.geoserverProperties.layerName07 = this.initialData.geoserver.layerName07;
    //广深东佛责任田得分图层
    this.geoserverProperties.layerName08 = this.initialData.geoserver.layerName08;
    //广东省综合网格图层
    this.geoserverProperties.layerName09 = this.initialData.geoserver.layerName09;
    //广东省商圈图层
    this.geoserverProperties.layerName10 = this.initialData.geoserver.layerName10;
    //广东省责任田渠道分布合理性
    this.geoserverProperties.layerName11 = this.initialData.geoserver.layerName11;
    //广东省单元格范围图层
    this.geoserverProperties.layerName12 = this.initialData.geoserver.layerName12;
    // 广东省行政区图层样式
    this.geoserverProperties.style01 = this.initialData.geoserver.style01;
    // 广东省区块图层样式
    this.geoserverProperties.style02 = this.initialData.geoserver.style02;


    // 地图中心点
    window.centerCoor = [113.2760010000, 23.1357585947];
    // 行政区
    this.cityObj.city = this._sourceLayer(
      this.geoserverProperties.url,
      this.geoserverProperties.layerName01,
      this.geoserverProperties.style01
    );
   
    //众包图层
    this.crowdDrawObject.crowdLayer = this._sourceLayer(
      this.geoserverProperties.url,
      "postgres:schools",
      ""
    )
    // 天地图道路图层
    this.baseMap.baseMap_road = new ol.layer.Tile({
      title: "天地图路网",
      source: new ol.source.XYZ({
        url: "http://t4.tianditu.com/DataServer?T=vec_w&x={x}&y={y}&l={z}&tk=076410d95f484938c7474b38c391c527"
      })
    });
    // 天地图注记图层
    this.baseMap.baseMap_annotation = new ol.layer.Tile({
      title: "天地图文字标注",
      source: new ol.source.XYZ({
        url: "http://t3.tianditu.com/DataServer?T=cva_w&x={x}&y={y}&l={z}&tk=076410d95f484938c7474b38c391c527"
      })
    });
    // 鹰眼控件
    const overviewMapControl = new ol.control.OverviewMap({
      className: "ol-overviewmap ol-custom-overviewmap", // 鹰眼控件样式
      layers: [this.baseMap.baseMap_road, this.crowdDrawObject.crowdLayer], // 鹰眼中加载同坐标系下不同数据源的图层
      collapseLabel: "\u00BB", // 鹰眼控件展开时功能按钮上的标识（网页的JS的字符编码）
      label: "\u00AB", // 鹰眼控件折叠时功能按钮上的标识（网页的JS的字符编码）
      collapsed: true, // 初始为隐藏显示方式
      view: new ol.View({
        // 地图视图设置,只有投影和主视图相同，鹰眼才会显示出来
        projection: new ol.proj.Projection({
          code: "EPSG:4326",
          units: "degrees",
          axisOrientation: "neu",
          global: true
        }),
        zoom: 8
      })
    });
    // 比例尺控件
    const scaleLineControl = new ol.control.ScaleLine({
      units: "metric", //设置比例尺单位，degrees、imperial、us、nautical、metric（度量单位）
      target: "scalebar",
      className: "ol-scale-line"
    });
    // 滑动控件
    const zoomslider = new ol.control.ZoomSlider({
      className: "ol-zoomslider"
    });
    // 创建地图对象
    this.map = new ol.Map({
      controls: ol.control
        .defaults({
          attribution: false
        })
        .extend([
          // scaleLineControl, // 添加比例尺控件
          zoomslider, // 添加滑动控件
          overviewMapControl // 鹰眼控件
        ]),
      target: "map", // 地图容器div的id
      layers: [this.baseMap.baseMap_road, this.baseMap.baseMap_annotation], // 地图容器中初始默认加载天地图和天地图注记
      view: new ol.View({
        // 地图视图设置
        projection: new ol.proj.Projection({
          code: "EPSG:4326",
          units: "degrees",
          axisOrientation: "neu",
          global: true
        }),
        minZoom: 1,
        maxZoom: 18
      })
    });
    // 设置地图显示范围
    this.map.getView().fit(this.bounds, this.map.getSize());
    // 缩放至中心点
    this.map.getView().setCenter(window.centerCoor);
    // 设置初始缩放级别
    this.map.getView().setZoom(14);
    // 地图点击事件
    this.map.on("singleclick", evt => {
      
      // 坐标拾取
      if (this.coorCardShow) {
        Bus.$emit("showCoordinate", evt.coordinate);
        if(this.earthquakeWaveMarkerList.length > 0) {
          this.earthquakeWaveMarkerList.forEach((marker) => {
            this.map.removeOverlay(marker);
          })
          this.earthquakeWaveMarkerList = [];
        }
        this.drawEarthquakeWave([evt.coordinate]);
        let view = this.map.getView(); //获取当前视图
        view.setCenter([view.getCenter()[0], view.getCenter()[1]]); //将当前视图的中心点设置为中心点，解决地震波点偏移的bug，by hejw20181128
        return;
      }
      // 关闭选显卡
      Bus.$emit("closeAll");

      //删除指定要素和查看点击要素的字段
      if(!this.drawArea & !this.drawPolygonObject.drawFlag & this.crowdDrawObject.crowdLayerAdd & this.deleteFlag || this.propertiesFlag||this.modifyFlag){
        if(this.deleteFlag){
          
            let viewResolution = this.map.getView().getResolution();
            let source = this.crowdDrawObject.crowdLayer.getSource();
            let url = source.getGetFeatureInfoUrl(
              evt.coordinate,
              viewResolution,
              "EPSG:4326",
              { INFO_FORMAT: "application/json", FEATURE_COUNT: 50 }
            );
            axios.get(url).then(response => {
              if(response.data.features.length > 0){
                let id = response.data.features[0].id;
                Bus.$emit("sendSchoolMes",id)
              }
            })

        }
       
        if(this.propertiesFlag||this.modifyFlag){
          // Bus.$emit("loading2");
          let viewResolution = this.map.getView().getResolution();
          let source = this.crowdDrawObject.crowdLayer.getSource();
          let url = source.getGetFeatureInfoUrl(
            evt.coordinate,
            viewResolution,
            "EPSG:4326",
            { INFO_FORMAT: "application/json", FEATURE_COUNT: 50 }
          );
          //显示字段信息
            axios.get(url).then(response => {
                    if(response.data.features.length > 0){
                    let properties = response.data.features[0].properties;
                    if(this.propertiesFlag){
                            Bus.$emit("showFeatureProperties", properties);
                    }  
                }
            })  
        }
      }
    });

    // 鼠标拖动事件
    this.map.on("pointerdrag", evt => {
      if (!this.coorCardShow) {
        Bus.$emit("closeDetail");
      }
    });
    // 地图放大倍数改变事件
    this.map.getView().on("change:resolution", evt => {
      if (!this.coorCardShow) {
        Bus.$emit("closeDetail");
      }
    });
    // 地图渲染结束事件
    this.map.on("postrender", evt => {
      if (this.timeOutId) clearTimeout(this.timeOutId);
      this.timeOutId = setTimeout(() => {
        Bus.$emit("stopLoading");
        Bus.$emit("initGrid");
      }, 200);
    });
    // 鼠标移动事件
    this.map.on("pointermove", evt => {
      if (this.coorCardShow) {
        this.style = {
          left: evt.pixel[0] + 10 + "px",
          top: evt.pixel[1] + "px",
          display: "block"
        };
        this.currentLon = parseFloat(evt.coordinate[0])
          .toFixed(5)
          .toString();
        this.currentLat = parseFloat(evt.coordinate[1])
          .toFixed(5)
          .toString();
      }
      this.tooltipStyle = {
        left: "",
        top: "",
        height:"0px",
        display: "none"
      }
      if(this.propertiesFlag||this.deleteFlag){
        this.tooltipStyle = {
          left: evt.pixel[0] + 10 + "px",
          top: evt.pixel[1] + "px",
          display: "block",
          height:"18px",
          width: "18px",
          borderRadius: "9px",
          border: "1px solid #666"
          // background: "rgba(0, 0, 0, 0.5)",
        }
        // this.currentTooltip ="点击众包图层要素，查看字段信息或修改字段值"
      }
      // if(this.drawendFlag&& this.drawFlag)
      //   this.tooltipStyle = {
      //     left: evt.pixel[0] + 10 + "px",
      //     top: evt.pixel[1] + "px",
      //     display: "block",
      //     height:"auto",
          // background: "rgba(0, 0, 0, 0.5)",
        // }
    });
  },
};
</script>

<style lang="css">
#map{
    width: 100%;
    height: 100%;
}


@media only screen and (min-width: 540px) {
    /* // 地图容器背景 */
    .ol-viewport .ol-unselectable {
        background-color: #ffffff;
    }
    /* 图层缩放滑动条中的滑块*/
    .ol-zoomslider-thumb {
        background-color: rgba(44, 62, 80, 0.6) !important;
    }
    /*放大和缩小按钮 */
    .ol-zoom {
        top: 7em !important;
        right: 1em !important;
        left: auto !important;
    }
    /*滑动缩放条 */
    .ol-zoomslider {
        top: 10.8em !important;
        right: .9em!important;
        left: auto !important;
        height: 200px !important;
        border:1px solid #8e98a2 !important;
    }
    /*对所有相关的control按钮进行设置*/
    .ol-control button{
        color:#8e98a2 !important;
        background: #ffffff !important;
        border:1px solid #8e98a2 !important;
    }
    .ol-control button:focus, .ol-control button:hover {
        /* text-decoration: none; */
        background-color: #fff !important;
        color:rgb(96, 169, 209) !important;
    }
    /* // 鹰眼控件内部框 */
    .ol-custom-overviewmap .ol-overviewmap-box {
        border: 2px solid red;
        z-index: 9999;
    }
    /*鹰眼图位置*/
    .ol-overviewmap {
        left:auto !important;
        right: 1em!important;
    }
}
@media only screen and (max-width: 540px) {
     .ol-viewport .ol-unselectable{
         display: none;
     }
}

#location {
  position: absolute;
  background-color: rgba(0, 0, 0, 0.5);
  color: aliceblue;
  z-index: 999;
  font-size: 14px;
  height: 22px;
  padding: 0;
}

.gs-tooltip{
  position: absolute;
  background-color: rgba(255, 255, 250, 0.5);
  color: aliceblue;
  z-index: 999;
  font-size: 14px;
  padding: 0;
}
.mapvue-icon{
  font-size:15px;
  height: 16px;
  width:16px;
  padding:2px;
  color:#666!important;
}
.gradient {
  background: -webkit-radial-gradient(deeppink, aqua,  #DDA0DD); /* Safari 5.1 - 6.0 */
  background: -o-radial-gradient(deeppink, yellow,  #DDA0DD); /* Opera 11.6 - 12.0 */
  background: -moz-radial-gradient(deeppink, yellow,  #DDA0DD); /* Firefox 3.6 - 15 */
  background: radial-gradient(deeppink, aqua,#DDA0DD); /* 标准的语法（必须放在最后） */
  opacity: 0.8;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  animation: point-scale 3s;  
  animation-iteration-count: infinite; 
}
@keyframes point-scale{  
  to {
    transform: scale(2, 2);
  }
}
</style>



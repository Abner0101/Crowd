/*
API接口方法
*/
import Vue from 'vue';
import {post,get} from './http'

Vue.prototype.$post = post;
Vue.prototype.$get = get;

//获取请求基础接口
// const baseURL = process.env.API;


//登录接口
export const login = (json) => {
    const data = new FormData();
    data.append("username", json.username)
    data.append("password", json.password);
    return post("login", data);
};

//退出登录
export const logout = (json) => {
    return post("logout", {});
};

//获取每个字段的说明
export const getPropertiesInfo = (json) => {
  return get("GetPropertiesOtherInfoJ.action", {
    "table": json.table
  })
};

//添加新的要素到数据库
export const pushGeo = (json) => {
  const data = new FormData()
  data.append("table", json.table)
  data.append("geojson", json.geojson);
  data.append("data",json.data);
  return post("PushGeoJsonJ.action", data)
};

//指定要素进行删除
export const removeFeature = (json) => {
  return get("RemoveFeatureJ.action", {
    "fid": json.fid,
    "table": json.table
  })
};

//修改指定要素的字段值
export const SetFeature = (json) => {
  const data = new FormData();
  data.append('fid', json.fid)
  data.append("table", json.table)
  data.append("data", json.data);
  return post("SetFeaturePropertiesJ.action", data)
};

//修改要素的几何形状
export const updateGeo = (json) => {
  const data = new FormData()
  data.append('geojson', json.geojson)
  data.append('table', json.table)
  return post("UpdateGeometryJ.action", data)
};

//获取所有园区类型
export const getZoomtype = (json) => {
    return get("getZoneTypes.action", {})
};

//添加园区类型
export const addZoomtype = (json) => {
    const data = new FormData()
    data.append('types', [json.types]);
    data.append('workspace','postgres');
    data.append('style','schools-style');
    return post("addZoneTypes.action", data);
};

//删除园区类型
export const delZoomtype = (json) => {
    const data = new FormData();
    data.append('types', [json.types]);
    data.append('workspace','postgres');
    data.append('style','schools-style');
    return post("removeZoneTypes.action", data)
};

//获取所有众包信息
export const getAllFeatureInfo = (json) => {
    return get("GetAllFeatureInfo.action", {
        "type":json.type
    })
};

//分页获取当前所有众包信息
export const getAllZoomInfo = (json) => {
    return get("getAllZoneInfo.action", {
        "type":json.type,
        "page":json.page,
        "pageSize":json.pageSize
    })
};

export const getAlltypesNum = (json) =>{
    return get("getCountsOfType.action",{});
}

export const getFeatureInfo = (url) => {
  return get(url)
}
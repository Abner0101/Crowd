/**
 * axios封装
 * 封装get、post方法
 */
import axios from 'axios';
import Vue from 'vue'
import router from '../router';
let New_vue = new Vue()

/** 
 * 提示函数 
 * 禁止点击蒙层、显示一秒后关闭
 */
const Tip = msg => {
    New_vue.$message({
        center: true,
        message: msg,
        type: 'error'
    });
}

// const baseURL = process.env.API;

// 请求超时时间
axios.defaults.timeout = 10000;

//获取请求基础接口
axios.defaults.baseURL = process.env.API;
// post请求头
// axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;';  
//携带cookie
axios.defaults.withCredentials=true;  

// var instance = axios.create({
//     withCredentials:false,
//     headers: {'content-type':'multipart/form-data'}
// });

/** 
 * 跳转登录页
 * 携带当前页面路由，以期在登录页面完成登录后返回当前页面
 */
const toLogin = () => {
    router.replace({
        path: '/login',        
        query: {
            redirect: router.currentRoute.fullPath
        }
    });
}
  

const errorHandle = (status, other) => {
    // 状态码判断
    switch (status) {

        // 401: 未登录状态，跳转登录页
        case 401:
            Tip('未登录，请先登录');
            toLogin();
            break;

        // 403 token过期
        // 清除token并跳转登录页
        case 403:
            Tip('登录过期，请重新登录');
            setTimeout(() => {
                toLogin();
            }, 1000);
            break;
            
        // 404请求不存在
        case 404:
            Tip('请求的资源不存在'); 
            break;
        default:
            console.log(other);   
	}
}

//请求拦截器
axios.interceptors.request.use(
    config => {
      config.headers['Content-Type'] = 'application/x-www-form-urlencoded'; // 关键所在
      return config
    },
    error => Promise.error(error)
);

// 响应拦截器
axios.interceptors.response.use(    
    // 请求成功
    res => {
        res.data.code = parseInt(res.data.code);
        return res.status === 200 ? Promise.resolve(res) : Promise.reject(res);
    },  
    // 请求失败
    error => {
        
        const { response } = error;
        // console.log(response);
        if (response) {
            // 请求已发出，但是不在2xx的范围 
            errorHandle(response.status, response.data.message);
            return Promise.reject(response);
        } else {
            // 处理断网的情况
            // eg:请求超时或断网时，更新state的network状态
            // network状态在app.vue中控制着一个全局的断网提示组件的显示隐藏
            // 关于断网组件中的刷新重新获取数据，会在断网组件中说明
            // if (!window.navigator.onLine) {
            //    store.commit('changeNetwork', false);
            // } else {
            let message = '请求失败！请检查网络';
            Tip(message);
            return Promise.reject(error);
            // }
        }
	}
);

/**
 * 封装get方法
 * @param url
 * @param params
 * @returns {Promise}
 */
export function get(url, params = {}) {
    return new Promise((resolve, reject) => {
        axios.get(url, {
            params: params,
        }).then(response => {
            // console.log(response.data, "data")
            if (response.data.code === 401) {
                Tip('未登录，请先登录');
                toLogin();
            }else{
                resolve(response.data);
            }
        })
        .catch(err => {
            reject(err);
            // let message = '请求失败！请检查网络';
            // //错误返回
            // if (err.response) message = err.response.data.message;
            // Tip(message)
        })
    })
}


/**
 * 封装post请求
 * @param url
 * @param data
 * @returns {Promise}
 */

export function post(url, data) {
    return new Promise((resolve, reject) => {
        axios.post(url, data)
            .then(response => {   
                if (response.data.code === 401) {
                    toLogin();
                    Tip('未登录，请先登录');
                }else{
                    resolve(response.data);
                }
        }, err => {
            reject(err);
            // let message = '请求失败！请检查网络';
            // if (err.response) message = err.response.data.message;
            // Tip(message)
        })
    })
}
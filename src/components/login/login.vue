<template>
    <div class="login">
        <div class="login_out">
            <div class="login_title">
                <svg class="icon-school" aria-hidden="true" style="height:50px;width:50px">
                    <use xlink:href="#icon-school"></use>
                </svg>&nbsp;园区众包平台
            </div>
            <div class="login_content">
                <el-form ref="loginForm" :model="form" :rules="rules" label-width="0px" class="login-box">
                    <el-form-item label="" prop="username">
                        <el-input type="text" placeholder="请输入账号" v-model="form.username" prefix-icon="el-icon-user" @keyup.enter.native="onSubmit('loginForm')"/>
                    </el-form-item>
                    <el-form-item label="" prop="password">
                        <el-input type="password" placeholder="请输入密码" v-model="form.password" prefix-icon="el-icon-key" @keyup.enter.native="onSubmit('loginForm')"/>
                    </el-form-item>
                </el-form>
                <el-button type="primary" @click="onSubmit('loginForm')" v-loading="loadLogin">登录</el-button>
                <el-button @click="resetForm('loginForm')" plain>重置</el-button>
            </div>
        </div>
    </div>
</template>

<script>
import {login} from '@/ajax/api'
export default {
    data(){
        return{
            // 表单验证，需要在 el-form-item 元素中增加 prop 属性
            form:{
                username: '',
                password: ''
            },
            rules: {
            username: [
                {required: true, message: '账号不可为空', trigger: 'blur'}
            ],
            password: [
                {required: true, message: '密码不可为空', trigger: 'blur'}
            ]
            },
            loadLogin:false,
        }
    },
    methods:{
        onSubmit(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    this.loadLogin = true;
                    login(this.form).then(res =>{
                        this.loadLogin = false;
                        if(res.code === 200){
                            this.$router.push("/Mappage");
                            this.$message({
                                type: "success",
                                message: "登录成功",
                                center: true
                            })
                        }else{
                            this.$message({
                                type: "error",
                                message: res.msg,
                                center: true
                            })
                        }
                    })
                } else {
                    console.log('error submit!!');
                    return false;
                }
            });
        },
        resetForm(formName) {
            this.$refs[formName].resetFields();
        }
    }

}
</script>

<style scoped lang="less">
    .login{
        width: 100%;
        height: 100%;
        @media only screen and (min-width: 540px) {
            background: url("../../assets/img/back.jpg") ;
        }
        @media only screen and (max-width: 540px) {
            background: url("../../assets/img/back-phone.jpg");
        }
        background-repeat:no-repeat;
        background-size: cover;
        display: flex;
        justify-content: center;
        align-items: center;

        &_title{
            height: 50px;
            font-size:24px;
            letter-spacing: 4px;
            color:#4D4D4D;
            font-family:"微软雅黑";
            font-weight: 500;
            line-height: 1.2;
            display: flex;
            align-items: center;
            // padding-left: 50px;

        }

        &_out{
            display: flex;
            align-items: center;
            justify-content: center;
            flex-direction: column;
            padding: 25px 50px;
            background: rgba(255,255,255,0.6);
            /** 平板 **/
            @media only screen and (min-width: 540px) and (max-width: 1024px) {
                background: rgba(255,255,255,0.6);
            }
            // 手机
            @media only screen and (max-width: 540px) {
                background: rgba(255,255,255,0);
            }
            border-radius: 8px;
        }

        &_content{
            margin-top: 25px;
            width: 320px;
            text-align: center;
        }
    }
</style>
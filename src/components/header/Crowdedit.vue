<!--
众包编辑模块
created by duosheng jiang
-->
<template>
    <div class="crowd">    
        <div class="crowd_out">
            <div>
                <font style="font-size:14px;margin-right:10px">众包图层</font>
                <el-switch
                    v-model="openCrowd"
                    active-color="#5AC8FA"
                    inactive-color="#E0E1E1">
                </el-switch>
                <span style="color:red;font-size:14px;margin-left:10px" v-if="openErrmes">请打开众包图层!</span>
            </div>

            <div style="margin-top:15px;">
                <font style="font-size:14px;margin-right:10px">园区类型</font>
                <el-select v-model="crowdType" multiple placeholder="请选择" collapse-tags size="mini" style="width:155px;">
                    <el-option
                    v-for="item in dynamicTags"
                    :key="item"
                    :label="item"
                    :value="item">
                    </el-option>
                </el-select>
                <a title="园区类型设置">
                    <el-button type="primary" icon="el-icon-edit" circle size="mini" style="background-color:#5AC8FA;margin-left:7px" 
                    @click="showZoomdiv = !showZoomdiv"></el-button>
                </a>
                <Outdiv class="zoom" divclass="div4" closeclass="close1" :show.sync="showZoomdiv" @closeDiv="showZoomdiv=!showZoomdiv">
                    <div class="zoom_content">
                        <div class="zoom_btn">园区类型</div>
                        <el-tag :key="tag" v-for="tag in dynamicTags" closable :disable-transitions="false"
                          @close="handleClose(tag)">
                          {{tag}}
                        </el-tag>
                        <el-input class="input-new-tag" v-if="inputVisible" v-model="inputValue" ref="saveTagInput"
                        size="small" @keyup.enter.native="handleInputConfirm" @blur="handleInputConfirm">
                        </el-input>
                        <el-button v-else class="button-new-tag" size="small" @click="showInput">+ 添加类型</el-button>  
                    </div>
                </Outdiv>
            </div>
            
            <div class="crowd_title">要素信息编辑</div>
            <div class="crowd_content">
                <Btn btnClass="btn1" btnsClass="btns" btnValue="添加要素" :btnObject="showDiv == 'add'?activeBtn:normalBtn" @ebtn="addCrowd()"/>
                <el-collapse-transition>
                    <div class="add" v-if="showDiv == 'add'">
                        <div class="add_content" v-if="!isDraw">
                            请在地图上绘制众包要素 =>
                        </div>
                        <div class="add_form" v-if="isDraw">
                            <el-form ref="form" :model="form" label-width="100px" :rules="rules">
                                <el-form-item label="园区类型" style="margin-bottom:17px">
                                    <el-select v-model="form.type" placeholder="请选择" size="small">
                                        <el-option
                                        v-for="item in dynamicTags"
                                        :key="item"
                                        :label="item"
                                        :value="item">
                                        </el-option>
                                    </el-select>
                                </el-form-item>
                                <el-form-item :label="form.type + '名称'" style="margin-bottom:17px" prop="school_na">
                                    <el-input v-model="form.school_na" size="small "></el-input>
                                </el-form-item>
                                <el-form-item :label="form.type + '人数'" style="margin-bottom:17px" prop="student_cnt">
                                    <el-input v-model="form.student_cnt" size="small "></el-input>
                                </el-form-item>
                                <el-form-item label="联系方式" style="margin-bottom:17px" prop="phone">
                                    <el-input v-model="form.phone" size="small "></el-input>
                                </el-form-item>
                                <el-form-item :label="form.type + '地址'" style="margin-bottom:17px" prop="school_adr">
                                    <el-input v-model="form.school_adr" size="small " type="textarea"></el-input>
                                </el-form-item> 
                            </el-form>
                        </div>

                        <el-button type="primary" size="mini" :disabled="!isDraw" @click="subCrowd('form')">确定</el-button>
                        <el-button size="mini" plain @click="cancelAdd()" >取消</el-button>
                        <el-button type="info" size="mini" v-if="isDraw" @click="resetAdd('form')" plain>重置</el-button>
                    </div>
                </el-collapse-transition>

                <Btn btnClass="btn1" btnsClass="btns" btnValue="删除要素" :btnObject="showDiv == 'del'?activeBtn:normalBtn" @ebtn="delCrowd()"/>
                <el-collapse-transition>
                    <div class="add" v-if="showDiv == 'del'">
                        <div class="add_content" v-if="!isSelDelete">
                            请在地图上选择您要删除的要素 =>
                        </div>
                        <div v-if="isSelDelete">
                            <div v-for="(item,index) in delArr" :key="index" class="del">
                                <span class="del_label">[{{item.school_id}}]:{{item.school_na}}</span>
                                <i class="el-icon-close icon_delout" @click="removeItem(item.school_id)"></i>
                            </div>    
                        </div>
                        <el-button type="primary" size="mini" :disabled="!isSelDelete" @click="submitDel()">确定</el-button>
                        <el-button size="mini" plain @click="cancelDel()" >取消</el-button>
                    </div>    
                </el-collapse-transition>

                <Btn btnClass="btn1" btnsClass="btns" btnValue="查看要素" :btnObject="showDiv == 'show'?activeBtn:normalBtn" @ebtn="showCrowd()"/>
                <el-collapse-transition>
                    <div class="add" v-if="showDiv == 'show'">
                        <div class="add_content" v-if="!showInfo && !editInfo">
                            请在地图上点击您要查看的要素 =>
                        </div>
                        <div v-if="showInfo" class="add_form">
                            <div class="edit_btn"><el-button type="info" icon="el-icon-edit-outline"  @click="toEdit()" size="mini">修改属性</el-button></div>
                            <hr>
                            <el-form ref="form" :model="showform" label-width="80px">
                                <el-form-item label="ID:" style="margin-bottom:0px" align="left">
                                    {{showform.school_id}}
                                </el-form-item>
                                <el-form-item label="园区类型:" style="margin-bottom:0px" align="left">
                                    {{showform.type}}
                                </el-form-item>
                                <el-form-item :label="showform.type + '名称:'" style="margin-bottom:0px" align="left">
                                    {{showform.school_na}}
                                </el-form-item>
                                <el-form-item :label="showform.type + '人数:'" style="margin-bottom:0px" align="left">
                                    {{showform.student_cnt}}
                                </el-form-item>
                                <el-form-item label="联系方式:" style="margin-bottom:0px" align="left">
                                    {{showform.phone}}
                                </el-form-item>
                                <el-form-item :label="showform.type + '地址:'" style="margin-bottom:0px" align="left">
                                    {{showform.school_adr}}
                                </el-form-item> 
                            </el-form>
                            <hr>
                        </div>

                        <div v-if="editInfo" class="add_form">
                            <div class="back" @click="editBack()"><i class="el-icon-arrow-left"></i>返回</div>
                            <el-form ref="editform" :model="editform" label-width="80px" :rules="rules">
                                <el-form-item label="ID:" style="margin-bottom:17px">
                                    <el-input v-model="editform.school_id" size="small " :disabled="true"></el-input>
                                </el-form-item>
                                <el-form-item label="园区类型" style="margin-bottom:17px">
                                    <el-select v-model="editform.type" placeholder="请选择" size="small">
                                        <el-option
                                        v-for="item in dynamicTags"
                                        :key="item"
                                        :label="item"
                                        :value="item">
                                        </el-option>
                                    </el-select>
                                </el-form-item>
                                <el-form-item :label="editform.type + '名称'" style="margin-bottom:17px" prop="school_na">
                                    <el-input v-model="editform.school_na" size="small "></el-input>
                                </el-form-item>
                                <el-form-item :label="editform.type + '人数'" style="margin-bottom:17px" prop="student_cnt">
                                    <el-input v-model="editform.student_cnt" size="small "></el-input>
                                </el-form-item>
                                <el-form-item label="联系方式" style="margin-bottom:17px" prop="phone">
                                    <el-input v-model="editform.phone" size="small "></el-input>
                                </el-form-item>
                                <el-form-item :label="editform.type + '地址'" style="margin-bottom:17px" prop="school_adr">
                                    <el-input v-model="editform.school_adr" size="small " type="textarea"></el-input>
                                </el-form-item> 
                            </el-form>
                        </div>
                        <el-button type="primary" size="mini" :disabled="!editInfo" @click="subEditInfo('editform')">确定</el-button>
                        <el-button size="mini" plain @click="cancelEditInfo()" >取消</el-button>
                    </div>    
                </el-collapse-transition>

                <Btn btnClass="btn1" btnsClass="btns" btnValue="调整形状" :btnObject="showDiv == 'edit'?activeBtn:normalBtn" @ebtn="editCrowd()"/>
                <el-collapse-transition>
                    <div class="add" v-if="showDiv == 'edit'">
                        <div class="add_content" v-if="!isSelEdit">
                            请在地图上选择您要调整的要素 =>
                        </div>
                        <!-- <div v-if="isSelEdit" class="edit_content">
                            <div class="edit_btn">修改该要素属性<i class="el-icon-edit"></i></div>
                        </div> -->
                        <el-button type="primary" size="mini" :disabled="!isSelEdit" @click="subEdit()">确定</el-button>
                        <el-button size="mini" plain @click="cancelEdit()" >取消</el-button>
                    </div>    
                </el-collapse-transition>

            </div>
        </div>
    </div>
</template>

<script>
import Btn from '../commom/Button.vue'
import Outdiv from '../commom/Outdiv.vue'
import Bus from "../../assets/js/bus.js"
import {SetFeature,getZoomtype,addZoomtype,delZoomtype} from '@/ajax/api'
export default {
    data(){
        return{
            showZoomdiv:false,
            dynamicTags: [],
            inputVisible: false,
            inputValue: '',
            crowdType:["校园"],
            activeName: '1',
            showDiv:'',  //判断点击的按钮字段，有add，del，edit，show四个字段
            activeBtn:{
                "box-shadow": "0 0 0 0 rgba(40, 100, 240, 0)",
                "border":"2px solid #5AC8FA"
            },
            normalBtn:{
                "border":"1px solid #A4A5A8",
            },
            form:{
                school_na:'',
                student_cnt:'',
                school_adr:'',
                phone:'',
                type:'校园'
            },
            isDraw:false, //是否已绘制
            openCrowd:false, //是否打开众包图层
            openErrmes:false,
            isSelEdit:false,
            showInfo:false,
            editInfo:false,
            delArr:[],
            subDelArr:[], //删除的id数组
            showform:{},
            editform:'',
            rules: {
                school_na: [
                    { required: true, message: '请输入名称', trigger: 'blur' },
                ],
                student_cnt: [
                    { required: true, message: '请输入人数', trigger: 'blur' },
                    { required: true,pattern: /^[0-9]*[1-9][0-9]*$/,message: '必须为整数',trigger: 'blur'}
                ],
                school_adr: [
                    { required: true, message: '请输入地址', trigger: 'blur' }
                ],
                phone: [
                    { required: true, message: '请输入联系方式', trigger: 'blur' },
                ],
            },
            isSelfIntersect:false,
        }
    },
    components:{
        Btn,
        Outdiv
    },
    computed:{
        isSelDelete(){
            return this.delArr.length>0?true:false;
        }
    },
    created(){
        this.getZoomtypes();
    },
    mounted(){
        Bus.$on("closeCrowdDiv",data => {
            if(this.showDiv === "add"){
                this.cancelAdd();
            }else if(this.showDiv === "del"){
                this.cancelDel();
            }else if(this.showDiv === "edit"){
                this.cancelEdit();
            }else if(this.showDiv === "show"){
                this.cancelEditInfo();
            }    
        });
        //判断绘制图形时是否交叉
        Bus.$on("isSelfIntersect",data => {
            this.isSelfIntersect = data;
        })
        //识别是否绘制了新的要素
        Bus.$on("haveDraw", data=> {
            this.isDraw = data;
        });
        //识别是否调整了形状
        Bus.$on("haveModify", data => {
            this.isSelEdit = data;
        });
        //获取要删除的要素属性
        Bus.$on("sendSchoolMes",data=>{
            // console.log(data);
            if(this.subDelArr.indexOf(data.school_id) === -1){
                this.delArr.push(data);
                this.subDelArr.push(data.school_id);
            }else{
                this.$message({
                    message: '该要素已被选中！',
                    center: true,
                    type:'warning'
                });
            }
        })
        //获取要素属性
        Bus.$on("showFeatureProperties", data =>{
            this.showInfo = true;
            this.showform = data;
            // console.log(data);
        })
        //获取图层状态
        this.openCrowd = (localStorage.getItem('openCrowdStatus') === 'true');   
    },

    watch:{
        //监听图层状态
        openCrowd:{
            handler:function() {
                let layerList = [];
                if(this.openCrowd){
                    this.openErrmes = false;
                    layerList.push("众包图层");
                }
                localStorage.setItem("openCrowdStatus",String(this.openCrowd));
                Bus.$emit("changeGrid", layerList);
                Bus.$emit("updateFilterByType", this.crowdType);
            },
            // immediate: true,    
        },
         crowdType:{
            handler:function(){
                if(typeof(this.crowdType) == "undefined"){
                    console.log("crowdType is undefined")
                }else{
                    Bus.$emit("updateFilterByType", this.crowdType);
                }
            },
            // immediate: true
        }
    },

    methods:{
        //获取所有众包类型
        getZoomtypes(){
            getZoomtype({}).then(res =>{
                if(res.code === 200){
                    this.dynamicTags = res.data;
                    this.crowdType = res.data;
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

        //删除众包类型
        handleClose(tag) {
            this.$confirm('是否要删除'+tag+'类型？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(()=>{
                let json = {};
                json.types = tag;
                delZoomtype(json).then(res => {
                    if(res.code === 200){
                        this.dynamicTags.splice(this.dynamicTags.indexOf(tag), 1);
                        this.$message({
                            type: 'success',
                            message: res.msg,
                            center:true
                        });
                    }else{
                        this.$message({
                            type: 'error',
                            message: res.msg,
                            center:true
                        });
                    }
                })
            });    
        },

        showInput() {
             this.inputVisible = true;
             this.$nextTick(_ => {
               this.$refs.saveTagInput.$refs.input.focus();
             });
        },

        //添加众包类型
        handleInputConfirm() {
            let inputValue = this.inputValue;
            if (inputValue) {
                if(this.dynamicTags.indexOf(inputValue) !== -1){
                    this.$message({
                        type: 'warning',
                        message: "该众包类型已存在！",
                        center:true
                    });
                }else{
                    this.$confirm('是否要添加'+inputValue+'类型？', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(()=>{
                        let json = {};
                        json.types = inputValue;
                        addZoomtype(json).then(res => {
                            if(res.code === 200){
                                this.$message({
                                    type: 'success',
                                    message: res.msg,
                                    center:true
                                });
                                this.dynamicTags.push(inputValue);
                            }else{
                                this.$message({
                                    type: 'error',
                                    message: res.msg,
                                    center:true
                                });
                            }
                        })
                    });
                }    
            }  
            this.inputVisible = false;
            this.inputValue = '';  
        },
        
        //重置
        resetAdd(formName){
            Bus.$emit("enableDrawCrowd", false);
            this.$refs[formName].resetFields();
            this.form.type = '校园';
        },

        //激活绘制功能
        addCrowd(){
            if(this.showDiv == '' && this.openCrowd === true){
                this.showDiv = 'add';
                // Bus.$emit("lockCrowdEditCard", true);        
                Bus.$emit("enableDrawCrowd", true);
                this.isDraw = false;
            }else if(!this.openCrowd){
                this.openErrmes=true;
            }    
        },

        //取消添加要素
        cancelAdd(){
            this.showDiv = '';
            this.form = {
                school_na:'',
                student_cnt:'',
                school_adr:'',
                phone:'',
                type:'校园'
            };
            Bus.$emit("enableDrawCrowd", false);
            // this.resetAdd('form');
        },

        //确定添加要素
        subCrowd(formName){
            if(this.isSelfIntersect){
                this.$message({
                    type: 'error',
                    message: '请勿绘制自相交的多边形',
                    center:true
                });
            }else{
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        if (this.isDraw) { //有绘制新要素
                            this.$confirm('是否保存该要素？', '提示', {
                                confirmButtonText: '确定',
                                cancelButtonText: '取消',
                                type: 'warning'
                            }).then(() => {
                                Bus.$emit("enableDrawCrowd", false);
                                Bus.$emit("pushGeoJson",JSON.stringify(this.form));
                            }).then(()=>{
                                this.showDiv = '';
                                this.isDraw = false;
                                this.form = {
                                    school_na:'',
                                    student_cnt:'',
                                    school_adr:'',
                                    phone:'',
                                    type:'校园'
                                };
                            }).catch(() => {
                                Bus.$emit("enableDrawCrowd", false);

                                this.$message({
                                    type: 'info',
                                    message: '已取消保存',
                                    center:true
                                });
                            });
                        } else { //没有绘制新要素
                            Bus.$emit("enableDrawCrowd", false);
                        }
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                }); 
            }
               
        },

        //激活删除功能
        delCrowd(){
            if(this.showDiv == '' && this.openCrowd === true){
                this.showDiv = 'del';
                Bus.$emit("enableDelete", true);
                // Bus.$emit("lockCrowdEditCard", true);
            }else if(!this.openCrowd){
                this.openErrmes=true;
            }
        },

        //取消删除的要素
        cancelDel(){
            Bus.$emit("enableDelete", false); 
            this.showDiv = '';
            this.delArr = [];
            this.subDelArr = [];
        },

        //移除选中的删除项
        removeItem(id){
            this.delArr = this.delArr.filter((item) => {
                return item.school_id !== id;
            })
            this.subDelArr = this.subDelArr.filter((item) => {
                return item !== id;
            })
        },

        //删除要素
        submitDel(){
            this.$confirm('是否要删除已选要素？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(()=>{
                let fid = this.subDelArr.join(",");
                // console.log(fid);
                Bus.$emit("removeItems",fid);
            }).then(()=>{
                // Bus.$emit("enableDelete", false); 
                this.delArr = [];
                this.subDelArr = [];
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除',
                    center:true
                });          
            });   
        },

        //激活调整形状按钮
        editCrowd(){
            if(this.showDiv == '' && this.openCrowd === true){
                this.showDiv = 'edit';
                Bus.$emit('enablePop', false);
                Bus.$emit("enableModify", true, null, this.dynamicTags);
                // Bus.$emit("lockCrowdEditCard", true);
                this.isSelEdit = false;//尚未修改要素形状
            }else if(!this.openCrowd){
                this.openErrmes=true;
            }
        },

        //取消调整
        cancelEdit(){
            this.showDiv = '';
            this.isSelEdit = false;
            Bus.$emit("enableModify", false, false);
        },

        //提交已调整的众包
        subEdit(){
            this.$confirm('是否要保存修改的要素？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(()=>{
                Bus.$emit("enableModify", false, true);
            }).then(()=>{
                this.isSelEdit = false;
                this.showDiv = '';
            }).catch(() => {
                Bus.$emit("enableModify", false, false);
                this.$message({
                    type: 'info',
                    message: '该元素已取消修改',
                    center:true
                }); 
                Bus.$emit('enablePop', false);
                Bus.$emit("enableModify", true, null, this.dynamicTags);
                // Bus.$emit("lockCrowdEditCard", true);
                this.isSelEdit = false;//尚未修改要素形状         
                // this.showDiv = '';
            })
        },

        //激活查看要素按钮
        showCrowd(){
            if(this.showDiv == '' && this.openCrowd === true){
                //告知Map.vue组件是否可以开始查看属性
                Bus.$emit("enableGetProperties", true);      
                // Bus.$emit("lockCrowdEditCard", true);
                this.showDiv = 'show';
            }else if(!this.openCrowd){
                this.openErrmes=true;
            }
        },

        //关闭或取消查看、修改要素
        cancelEditInfo(){
            this.showDiv = "";
            this.showInfo = false;
            this.editInfo = false;
            this.editform = "";
            this.showform = {};
            Bus.$emit("enableGetProperties", false);
        },
        
        //显示修改样式面板
        toEdit(){
            if(this.editform === "" || this.editform.fid !== this.showform.fid){
                this.editform = JSON.parse(JSON.stringify(this.showform));
            }
            Bus.$emit("enableGetProperties", false);
            this.showInfo = false;
            this.editInfo = true;
        },

        //返回
        editBack(){
            this.showInfo = true;
            this.editInfo = false;
            Bus.$emit("enableGetProperties", true);   
        },

        //提交修改的要素属性
        subEditInfo(formName) {
          this.$refs[formName].validate((valid) => {
            if (valid) {
              this.$confirm("是否修改该要素属性", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
              }).then(() => {
                let json = {};
                json.table = "schools";
                json.fid = this.editform.school_id;
                json.data = JSON.stringify(this.editform);
                SetFeature(json).then(response => {
                  if (response.code == 200) {
                    this.$message({
                      type: "success",
                      message: "修改成功",
                      center: true
                    })
                    this.editBack();
                    this.showform = JSON.parse(JSON.stringify(this.editform));
                    this.editform = "";
                  } else {
                    this.$message({
                      type: "error",
                      message: "修改失败",
                      center: true
                    })
                  }
                })
              }).catch(() => {
                this.$message({
                  type: "info",
                  message: "已取消修改",
                  center: true
                })
              })
            } else {
              console.log('error submit!!');
              return false;
            }
          })
        }
    }
                   
}
</script>

<style scoped lang="less">
    .zoom{
         &_btn{
             font-size: 16px;
             padding-bottom: 5px; 
             border-bottom: 1px solid #000;
             margin-bottom: 8px;
         }

         &_content{
             cursor: default;
         }
    }
    .el-tag+.el-tag {
      margin-left: 10px;
      margin-bottom: 8px;
    }

    .button-new-tag {
      margin-left: 10px;
      height: 32px;
      line-height: 30px;
      padding-top: 0;
      padding-bottom: 0;
    }

    .input-new-tag {
      width: 90px;
      margin-bottom: 8px;
      margin-left: 10px;
      vertical-align: bottom;
    }
    .crowd{
        &_title{
            width: 95%;
            height: 25px;
            font-size:14px;
            color: #606266;
            border-bottom: 1px solid #000;
            margin-top:20px;
        }

        &_out{
            width:100%;
            height: 80%;
            border-right: 1px solid #BABBBE;   
            overflow-y:auto; 
            overflow-x:hidden;       
        }
         /*滚动条样式*/
        &_out::-webkit-scrollbar {
            width: 5px;
            /*height: 4px;*/
        }
        &_out::-webkit-scrollbar-thumb {
            border-radius: 10px;
            // box-shadow: inset 0 0 5px #B3B4B6;
            background: #BABBBE;
        }
        &_out::-webkit-scrollbar-track {
            // box-shadow: inset 0 0 5px #B3B4B6;
            border-radius: 10px;
            background: #E6E8E9;
        }

        &_content{
            margin-top:15px;
            width:95%;
            display: flex;
            justify-content: center;
            align-items: center;
            flex-direction: column; 
        }
        

    }

    .icon_type{
        cursor: pointer;
        font-size: 20px;
        color: #606266;
        margin-left: 10px;
    }
    .icon_type:hover{
        color: #409EFF;
    }


    .add{
        width:100%;
        height: auto;
        border-top:1px solid #A4A5A8;
        border-bottom:1px solid #A4A5A8;
        background: #fff;
        margin-top: 10px;
        text-align: center;
        padding: 10px 5px;
        &_content{
            height: 120px;
            width:100%;
            display: flex;
            justify-content: center;
            align-items: center;
            background: #fff;
        }

        &_form{
            height: auto;
            width: 100%;
        }
    }

    .del{
        position: relative;
        margin-bottom:10px;
        width: 100%;
        height: 20px;
        padding: 5px 0;
        &_label{
            margin-left: 10px;
            position: absolute;
            left: 0;
        }

        .icon_delout{
            color: #fff;
            position: absolute;
            right: 5px;
            font-size: 18px;
            cursor: pointer;
        }
    }
    .del:hover{
        background: #409EFF;
    }
    .del:hover .del_label{
        color:#fff
    }

    .edit_btn{
        font-size:16px;
        margin-bottom: 5px;
        width: 40%;
        // border-bottom:1px solid #606266;
        // color: #606266;
    }
    // .edit_btn:hover{
    //     color: #409EFF;
    //     border-bottom:1px solid #409EFF;
    //     cursor: pointer;
    //     width: 50%;
    // }
    .back{
        width: 100%;
        font-size: 14px;
        color: #606266;
        margin-bottom: 15px;
        text-align: left;
    }
    .back:hover{
        color: #409EFF;
        cursor: pointer;
    }
    
</style>
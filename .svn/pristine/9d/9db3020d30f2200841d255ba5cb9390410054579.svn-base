<template>
    <div class="out">
        <button class="btn" :class="[btnClass,btnsClass]" :style="btnObject" @click="ebtn">{{btnValue}}</button>
    </div>
</template>

<script>
export default {
    props:{
		btnValue:{
			type:String,
			default:"ADD USER"
		},
		btnObject:{
			type:Object
		},
		btnClass:{
			type:String,
		},
		btnsClass:{
			type:String
		}
	},
	methods: {
		ebtn(){
			this.$emit('ebtn')
		}
	}
}
</script>

<style scoped lang="less">
.out{
    position: relative;
    width: 220px;
    height: 40px;
    margin-top: 22px;
}
.btn{
	appearance: none;
	font-size: 16px;
	// border-radius: 40px;
    /* margin-right: 1em; */
    padding: 8px 0px;
	cursor: pointer;
	border:1px solid #A4A5A8;
	display: inline-block;
    box-sizing: border-box;
    letter-spacing: 2px;
    transition: .2s box-shadow, .2s transform;
    position: absolute;

}

.btn:focus{
	outline: 0;
}
/* .btn1:hover{
	box-shadow: inset 0 -4px 0 0 rgba(0,0,0,0.6), 0 0 8px 0 rgba(0,0,0,0.5);
} */
.btn1 {
	background: #fff;
	box-shadow: inset 0 0 0 0 rgba(0,0,0,0.2);
    color: #606266;
    width: 220px;
    
	// font-weight: 700;
}

.btns{
  box-shadow:0px 5px 10px 0 rgb(189, 189, 189,0.3);
}
.btns:active{
	/* position: relative; */
	/* top: 2px; */
	/* box-shadow: inset 0 5px 10px 0 rgba(0,0,0,0.2); */
	box-shadow: 0 0 0 0 rgba(40, 100, 240, 0) !important;
    transform: translateY(1px);
    border:2px solid #5AC8FA;
	/* outline: 0; */
}
.btns:hover{
  box-shadow: 0px 2px 4px 0 rgb(189, 189, 189,0.3);
}

</style>
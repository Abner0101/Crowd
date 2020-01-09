<!-- 弹框组件 -->
<template>
<transition name="el-zoom-in-center">
  <div class="out-div" :class="divclass" :style="divObject" v-show="show" @mousedown.self="move">
    <!-- <div style="widht:100%;height:60px;background:#000" @mousedown="move"> -->
      <span class="div-close" :class="closeclass" :style="closeObject" @click="closeDiv"><i class="el-icon-close" :style="iconStyle"></i></span>
    <!-- </div> -->
      <slot></slot>
  </div>
</transition>
</template>
<script>
  export default{
    props:{
      divclass:{
        type:String,
      },
      closeclass:{
        type:String,
        default:'close1'
      },
      divObject:{
        type:Object
      },
      iconStyle:{
        type:Object
      },
      closeObject:{
        type:Object
      },
      show: {
        type: Boolean,
        required: true,
        twoWay: true
      }
    },
    data(){
      return{
        positionX:0,
        positionY:0,
      }
    },
    methods:{
      closeDiv(){
        this.$emit('closeDiv');
      },

      //边框拖拽
      move(e){
            let odiv = e.target;        //获取目标元素

            //算出鼠标相对元素的位置
            let disX = e.clientX - odiv.offsetLeft;
            let disY = e.clientY - odiv.offsetTop;
            document.onmousemove = (e)=>{       //鼠标按下并移动的事件
                //用鼠标的位置减去鼠标相对元素的位置，得到元素的位置
                let left = e.clientX - disX;
                let top = e.clientY - disY;

                //绑定元素位置到positionX和positionY上面
                this.positionX = top;
                this.positionY = left;

                //移动当前元素
                odiv.style.left = left + 'px';
                odiv.style.top = top + 'px';
            };
            document.onmouseup = (e) => {
                document.onmousemove = null;
                document.onmouseup = null;
            };
        }

    }


  }
</script>

<style scoped>
  .out-div{
    position: fixed;
	z-index: 999;
    -moz-user-select: none; /*火狐*/
    -webkit-user-select: none;  /*webkit浏览器*/
    -ms-user-select: none;   /*IE10*/
    -khtml-user-select: none; /*早期浏览器*/
    user-select: none;
  }

  .div4 {
    width: 400px;
    min-height: 180px;
    left: 30%;
    top: 35%;
    border-radius: 5px;
    background-color: #ffffff;
    box-shadow: 0px 5px 10px 0 rgba(40, 100, 240, 0.3);
    padding: 30px;
  }

  .out-div:hover {
    cursor: move;
  }

  /* 关闭按钮 */
  .div-close {
    border-radius: 50%;
    float: right;
    margin: -20px -20px 0 0;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
  }

  .div-close:hover {
    background: #BCC9D9;
    color: #409EFF;
  }

  .close1 {
    width: 20px;
    height: 20px;
    background: #409EFF;
    color: #fff;
    font-size:10px;
  }

  .close2 {
    width: 50px;
    height: 50px;
    background: #409EFF;
    color: #fff;
  }
</style>

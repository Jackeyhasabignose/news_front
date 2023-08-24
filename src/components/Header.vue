<script>
import { RouterLink } from "vue-router";
export default{

}
</script>

<template>
  
  <header class="top">
    <h1 class="oo">最新消息</h1>
  </header>
</template>

<style lang="scss" scoped>

  header {
    width:100%;
    height:70px;
    
    display: flex;
    align-items: center;
    background-image: linear-gradient(to right, #f9d423 0%, #ff4e50 100%);
  }
  .top{
    padding-left: 35rem;
    
  }
  .oo{
    margin-left: 2.5rem;
    margin-top: 2rem;
    margin-bottom: 2rem;
    font-size:40px;
  }

</style>

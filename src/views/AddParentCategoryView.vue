<template>
    <router-link to="/parentCategory">返回上一頁</router-link>
    <div class="center-container">
      <div>
        <input v-model="parentCategoryName" placeholder="輸入大類別名稱" />
        <button class="btn btn-primary" @click="addParentCategory">新增</button>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        parentCategoryName: "", // 输入框的值
      };
    },
    methods: {
      async addParentCategory() {
        // 检查输入是否为空
        if (!this.parentCategoryName.trim()) {
          // 输入为空，显示提示
          alert("輸入不能為空");
          return; // 停止执行添加操作
        }
  
        // 构造要发送的 JSON 数据
        const requestData = {
          parentCategoryName: this.parentCategoryName,
        };
  
        try {
          const response = await this.$axios.post('http://localhost:8080/Add_parent_category', requestData);
          // 处理成功响应
          console.log(response.data); // 在控制台中查看响应数据
  
          // 检查后端返回的消息并显示相应提示
          if (response.data.message === "It's InvalidCategory.") {
            alert("類別已存在");
          } else {
            // 显示成功提示
            alert("新增成功");
  
            // 重定向到 /parentCategory 页面
            this.$router.push('/parentCategory');
          }
        } catch (error) {
          // 处理错误响应
          console.error(error);
  
          // 检查错误响应的消息内容
          if (error.response && error.response.data && error.response.data.message) {
            // 从后端响应中获取错误消息并显示
            alert(error.response.data.message);
          } else {
            // 显示默认的错误提示
            alert("添加失敗");
          }
        }
      },
    },
  };
  </script>
  
  <style>
  .center-container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh; /* 让容器占据整个视口高度 */
  }
  </style>
  
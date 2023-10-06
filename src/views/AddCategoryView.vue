<template>
    <router-link to="/category">返回上一頁</router-link>
    <div class="center-container">
      <div>
        <select v-model="selectedParentCategory">
          <option v-for="parentCategory in parentCategories" :value="parentCategory.parentCategoryName">{{
            parentCategory.parentCategoryName
          }}</option>
        </select>
  
        <input v-model="parentCategoryName" placeholder="輸入小類別名稱" />
        <button class="btn btn-primary" @click="addParentCategory">新增</button>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        parentCategoryName: "", // 输入框的值
        selectedCategoryId: null, // 选择要修改的大类别的ID
        selectedParentCategory: null,
        parentCategories: [], // 添加一个空数组以存储大类别数据
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
  
        // 检查是否选择了大类别
        if (!this.selectedParentCategory) {
          // 未选择大类别，显示提示
          alert("請先選擇大類別");
          return; // 停止执行添加操作
        }
  
        // 构造要发送的 JSON 数据，包括大类别名称和小类别名称
        const requestData = {
          parentCategoryName: this.selectedParentCategory, // 选择的大类别名称
          categoryName: this.parentCategoryName, // 输入的小类别名称
        };
  
        try {
          const response = await this.$axios.post(
            "http://localhost:8080/Add_category",
            requestData
          );
          // 处理成功响应
          console.log(response.data); // 在控制台中查看响应数据
  
          // 检查后端返回的消息并显示相应提示
          if (response.data.message === "It's InvalidCategory.") {
            alert("類別已存在");
          } else {
            // 显示成功提示
            alert("新增成功");
  
            // 重定向到 /parentCategory 页面
            this.$router.push("/category");
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
  
      async getAllParentCategoriesWithNewsCount() {
        // 通过GET请求获取大类别列表
        try {
          const response = await this.$axios.get(
            "http://localhost:8080/get_all_parent_categories_with_news_count"
          );
          this.parentCategories = response.data;
          console.log(response.data); // 在控制台中查看响应数据
        } catch (error) {
          console.error("获取大类别时出错：", error);
        }
      },
    },
    created() {
      // 获取大类别列表
      this.getAllParentCategoriesWithNewsCount();
  
      // 使用 $nextTick 确保数据加载后再渲染下拉选择框
      this.$nextTick(() => {
        this.selectedParentCategory = this.parentCategories[0].parentCategoryName;
      });
    },
  };
  </script>
  
  <style>
  .center-container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    /* 让容器占据整个视口高度 */
  }
  </style>
  
<template>
  <router-link to="/back">回首頁</router-link>
  <div class="edit-news">

    <div class="edit-form">
      <h2>Edit News</h2>
      <label for="parentCategory">大類別：</label>
      <select v-model="parentCategoryName" id="parentCategoryName" class="input-field">
        <!-- 这里可以使用v-for动态生成选项 -->
        <option v-for="category in parentCategories" :value="category.parentCategoryName"
          :key="category.parentCategoryId">
          {{ category.parentCategoryName }}
        </option>
      </select><br>
      <label for="category">小類別：</label>
      <select v-model="categoryName" id="categoryName" class="input-field">
        <!-- 同样，这里可以使用v-for动态生成选项 -->
        <option v-for="category in categories" :value="category.categoryName" :key="category.categoryId">
          {{ category.categoryName }}
        </option>
      </select><br>
      <label for="publicTime">選擇日期：</label>
      <input v-model="publicTime" id="publicTime" type="datetime-local" class="input-field3" required><br>

      <label for="title">標題：</label>
      <input v-model="title" id="title" type="text" class="input-field"><br>

      <!-- 新增副標題的輸入框 -->
      <label for="subTitle">副標題：</label>
      <input v-model="subTitle" id="subTitle" type="text" class="input-field"><br>

      <label for="content">內容：</label>
      <textarea v-model="content" id="content" class="input-field2"></textarea><br>

    </div>

    <!-- 預覽區域 -->
    <div v-if="isPreviewVisible" class="edit-news">
      <div class="oo">
        <h2>消息預覽</h2>
        <label>大類別：</label>
        <span>{{ parentCategoryName }}</span><br>
        <label>小類別：</label>
        <span>{{ categoryName }}</span><br>
        <label>選擇日期：</label>
        <span>{{ publicTime.split('T')[0] }}</span><br>
        <label>標題：</label>
        <span>{{ title }}</span><br>
        <label>內容：</label>
        <p>{{ content }}</p><br>
        <button @click="saveEditedNews" type="button" class="btn btn-danger">發布</button>
      </div>
    </div>

  </div>

  <div class="pp">
    <button @click="saveEditedNews" type="button" class="btn btn-danger">儲存</button>
    <button @click="previewNews" type="button" class="btn btn-primary">預覽</button>

  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      title: '',
      isPreviewVisible: false,
      content: '',
      parentCategoryName: '',
      parentCategories: [],
      categories: [],
      categoryName: '',
      subTitle: '',
      parentCategory: '', // 添加这两个变量并设置初始值
      category: '',
      publicTime: '',
      today: new Date().toISOString().split('T')[0],
    };
  },

  created() {
    // 从路由参数中获取数据
    this.title = this.$route.query.title || '';
    this.subTitle = this.$route.query.subTitle || '';
    this.content = this.$route.query.content || '';
    this.parentCategoryName = this.$route.query.parentCategoryName || '';
    this.categoryName = this.$route.query.categoryName || '';
    const timeZoneOffsetHours = 8;
    const currentUTC = new Date();
    const localTime = new Date(currentUTC.getTime() + timeZoneOffsetHours * 60 * 60 * 1000);
    this.publicTime = localTime.toISOString().slice(0, 16);

    // 获取大类别列表
    this.getParentCategories();

    // 获取小类别列表
    this.getCategories();
  },
  methods: {
    async getParentCategories() {
      try {
        const response = await axios.get('http://localhost:8080/get_all_parent_categories_with_news_count');
        this.parentCategories = response.data;
      } catch (error) {
        console.error('Error fetching parent categories:', error);
      }
    },

    previewNews() {
      this.isPreviewVisible = true; // 显示预览区域
      console.log("1111")
    },
    async getCategories() {
      try {
        // 发起获取小类别数据的请求
        const response = await axios.get('http://localhost:8080/get_all_categories_with_news_count');
        // 将小类别数据填充到categories数组中
        this.categories = response.data;
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    },
    async saveEditedNews() {
      // 打印调试信息，以查看变量的值
      console.log('parentCategoryName:', this.parentCategoryName);
      console.log('categoryName:', this.categoryName);
      console.log('subTitle:', this.subTitle); // 打印副标题的值

      const requestData = {
        title: this.title,
        content: this.content,
        parentCategoryName: this.parentCategoryName, // 直接使用绑定的变量
        categoryName: this.categoryName, // 直接使用绑定的变量
        newsId: this.$route.query.newsId,
        publicTime: this.publicTime,
        subTitle: this.subTitle // 将副标题添加到请求数据中
      };


      try {
        const response = await axios.post('http://localhost:8080/Alter_news', requestData);
        console.log('Response:', response);
        console.log(response.data.message);

        // 更新成功后清除 Session Storage
        sessionStorage.removeItem('editNewsContent');

        // 跳转回管理员页面或其他页面
        this.$router.push('/back');
      } catch (error) {
        console.error('Error saving edited news:', error);
      }
    }
  }
};
</script>

<style scoped>
.edit-news {
  display: flex;
  justify-content: space-around;
  align-items: center;
  min-height: 100vh;
  /* 使容器佔滿整個視窗高度 */
}



.pp {
  display: flex;
  justify-content: center;
  margin-bottom: 3rem;
}

.edit-form {
  width: 100%;
  max-width: 500px;
  /* 控制编辑表单的最大宽度 */
}

.input-field {
  width: 100%;
}

.input-field2 {
  width: 100%;
  height: 200px;
}

.btn {
  margin-top: 1rem;
}

.input-field3 {
  width: 500px;
  /* 設置寬度為容器的寬度 */
}</style>

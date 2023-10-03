<template>
  <div>
    <div class="container">
      <div class="oo">
        <h2>新增最新消息</h2>
        <label for="parentCategory">大類別：</label>
<select v-model="parentCategoryName" id="parentCategoryName" class="input-field2">
  <option v-for="category in parentCategories" :value="category.parentCategoryName" :key="category">
    {{ category.parentCategoryName  }}
  </option>
</select><br>
<label for="category">小類別：</label>
<select v-model="categoryName" id="categoryName" class="input-field2">
  <option v-for="category in categories" :value="category.categoryName" :key="category">
    {{ category.categoryName  }}
  </option>
</select><br>

        <!-- 日期选择器 -->
        <label for="publicTime">選擇日期：</label>
        <input v-model="publicTime" id="publicTime" type="datetime-local" class="input-field2" required><br>



        <label for="title">標題：</label>
        <input v-model="title" id="title" type="text" class="input-field2" placeholder="請輸入標題"><br>
        <label for="subTitle">副標題：</label>
        <input v-model="subTitle" id="subTitle" type="text" class="input-field2" placeholder="請輸入副標題"><br>
        <label for="content">內容：</label>
        <textarea v-model="content" id="content" class="input-field" placeholder="請輸入內容(字數500字以內)"></textarea><br>

        <div class="pp">
          <button @click="addNews" type="button" class="btn btn-danger">發布</button>
          <button @click="previewNews" type="button" class="btn btn-primary">預覽</button>
        </div>
      </div>

      <!-- 預覽區域 -->
      <div v-if="isPreviewVisible" class="container">
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
          <button @click="addNews" type="button" class="btn btn-danger">發布</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      title: '',
      subTitle: '',
      content: '',
      parentCategoryName: '',
      categoryName: '',
      publicTime:'',
      isPreviewVisible: false, // 初始化为 false，表示初始状态下隐藏预览区域
      today: new Date().toISOString().split('T')[0], // 获取今天的日期
      parentCategories: [], // 存储大类别选项
      categories: [], // 存储小类别选项
    };
  },
  created() {
    // 获取大类别和小类别选项
    this.getParentCategories();
    this.getCategories();
    const timeZoneOffsetHours = 8; 
    const currentUTC = new Date();
    const localTime = new Date(currentUTC.getTime() + timeZoneOffsetHours * 60 * 60 * 1000);
    this.publicTime = localTime.toISOString().slice(0, 16);
    
  },
  methods: {
    async getParentCategories() {
      try {
        // 发起获取大类别数据的请求，假设后端提供了获取大类别的接口
        const response = await axios.get('http://localhost:8080/get_all_parent_categories_with_news_count');
        this.parentCategories = response.data;
      } catch (error) {
        console.error('Error fetching parent categories:', error);
      }
    },
    async getCategories() {
      try {
        // 发起获取小类别数据的请求，假设后端提供了获取小类别的接口
        const response = await axios.get('http://localhost:8080/get_all_categories_with_news_count');
        this.categories = response.data;
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    },
    async addNews() {
      if (this.title.trim() === '' || this.content.trim() === '' || this.publicTime === ''|| this.parentCategoryName === ''|| this.categoryName === '') {
        window.alert('標題、內容和日期且類別不得為空');
        return;
      }

      try {
        // 发起添加新闻的请求，同时发送选择的大小类别
        const response = await axios.post('http://localhost:8080/Add_news', {
          title: this.title,
          subTitle: this.subTitle,
          content: this.content,
          parentCategoryName: this.parentCategoryName,
          categoryName: this.categoryName,
          publicTime: this.publicTime,
        });
        console.log(this.publicTime);
        console.log(this.parentCategoryName);
        console.log(response.data.message);
        this.title = '';
        this.subTitle = '';
        this.content = '';
        this.parentCategoryName = '';
        this.categoryName = ''; 
        this.publicTime = ''; 

        this.$router.push('/back');
      } catch (error) {
        console.error('Error adding news:', error);
      }
    },
    previewNews() {
      this.isPreviewVisible = true; // 显示预览区域
      console.log("1111")
    },
  },
};
</script>

<style lang="scss" scoped>
.container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh; /* 使容器佔滿整個視窗高度 */
}

.oo {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.input-field {
  width: 500px; /* 設置寬度為容器的寬度 */
  height: 200px;
}

.input-field2 {
  width: 500px; /* 設置寬度為容器的寬度 */
}

.pp {
  display: flex;
}
</style>

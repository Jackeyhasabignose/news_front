<template>
  <div class="ooo">
    <router-link to="/back">上一頁</router-link>
  </div>
  <div class="container"> 
    <div class="oo"> 
      <h2>新增最新消息</h2>
      <label for="parentCategory">大類別：</label>
      <select v-model="parentCategory" id="parentCategory" class="input-field2">
        <option value="國外">國外</option>
        <option value="國內">國內</option>
      </select><br>
      <label for="category">小類別：</label>
      <select v-model="category" id="category" class="input-field2">
        <option value="遊戲">遊戲</option>
        <option value="科技">科技</option>
        <option value="音樂">音樂</option>
      </select><br>
      <!-- 日期选择器 -->
      <label for="publicTime">選擇日期：</label>
      <input v-model="publicTime" id="publicTime" type="date" class="input-field2" :min="today" required><br>
      <label for="title">標題：</label>
      <input v-model="title" id="title" type="text" class="input-field2" placeholder="請輸入標題"><br>
      
      <label for="content">內容：</label>
      <textarea v-model="content" id="content" class="input-field" placeholder="請輸入內容(字數500字以內)"></textarea><br>
      
      

      <button @click="addNews" type="button" class="btn btn-danger">確定</button>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      title: '',
      content: '',
      parentCategory: '國外',
      category: '遊戲',
      publicTime: '', // 存储选择的日期
      today: new Date().toISOString().split('T')[0] // 获取今天的日期
    };
  },
  methods: {
    async addNews() {
      if (this.title.trim() === '' || this.content.trim() === '' || this.publicTime === '') {
        window.alert('標題、內容和日期不得為空');
        return;
      }

      try {
        const response = await axios.post('http://localhost:8080/Add_news', {
          title: this.title,
          content: this.content,
          parentCategory: this.parentCategory,
          category: this.category,
          publicTime: this.publicTime
        });
        console.log(response.data.message);
        this.title = '';
        this.content = '';
        this.category = '公告'; // 重置为默认值
        this.publicTime = ''; // 重置日期
        this.$router.push('/back');
      } catch (error) {
        console.error('Error adding news:', error);
      }
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
</style>

<template>
  <div class="ooo">
    <router-link to="/back">上一頁</router-link>
  </div>
  <div class="container"> 
    <div class="oo"> 
      <h2>新增最新消息</h2>
      <label for="title">標題：</label>
      <input v-model="title" id="title" type="text" class="input-field2" placeholder="請輸入標題"><br>
      <label for="category">類別：</label>
      <select v-model="category" id="category" class="input-field2">
        <option value="公告">公告</option>
        <option value="轉發">轉發</option>
      </select><br>
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
      category: '公告' // 默认选择 "公告"
    };
  },
  methods: {
    async addNews() {
      if (this.title.trim() === '' || this.content.trim() === '') {
        window.alert('標題和內容不得為空');
        return;
      }

      try {
        const response = await axios.post('http://localhost:8080/Add_news', {
          title: this.title,
          content: this.content,
          category: this.category
        });
        console.log(response.data.message);
        this.title = '';
        this.content = '';
        this.category = '公告'; // 重置为默认值
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

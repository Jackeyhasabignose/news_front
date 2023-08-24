<template>
  <div class="oo">
    <h2>Edit News</h2>
    <label for="title">標題：</label>
    <input v-model="title" id="title" type="text" class="input-field" readonly><br>
    <label for="content">內容：</label>
    <textarea v-model="content" id="content" class="input-field2">{{ editedContent }}</textarea><br>
    <button @click="saveEditedNews" type="button" class="btn btn-primary">儲存</button>
  </div>
</template>
  
<script>
import axios from 'axios';

export default {
  data() {
    return {
      title: '',
      content: '',
      editedContent: ''
    };
  },
  created() {
    this.editedContent = sessionStorage.getItem('editNewsContent');
    this.title = this.$route.query.title || '';
    this.content = this.$route.query.content || '';
  },
  methods: {
    async saveEditedNews() {
      const requestData = {
        content: this.content,
        newsId: this.$route.query.newsId // 从路由参数中获取newsId
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
.oo {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.input-field {
  width: 500px; /* 設置寬度為容器的寬度 */
 
}
.input-field2 {
  width: 500px; /* 設置寬度為容器的寬度 */
  height: 200px;
 
}
</style>
  
<template>
  <div>
    <router-link to="/back" class="back-link">上一頁</router-link>
    <div class="news-content">
      <div class="news-header">
        <h2>{{ newsItem ? "[" + newsItem.category + "] " + newsItem.title : '' }}</h2>
        <p>{{ newsItem ? newsItem.publicTime : '' }}</p>
      </div>
      <div class="news-body">
        <p>{{ newsItem ? newsItem.content : '' }}</p>
        <!-- 顯示修改和刪除按鈕，僅在管理者頁面中顯示 -->
      </div>
    </div>
  </div>
  <div class="oo">
    <button v-if="$route.name === 'NewsContentAdmin'" @click="editNews" class="btn btn-primary">修改</button>
    <button v-if="$route.name === 'NewsContentAdmin'" @click="deleteNews" class="btn btn-danger">刪除</button>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  props: ['newsId'],
  data() {
    return {
      newsItem: null
    };
  },
  watch: {
    newsId: {
      immediate: true,
      handler() {
        if (this.newsId) {
          this.fetchNewsContent();
        }
      }
    }
  },
  methods: {
    async fetchNewsContent() {
      try {
        this.newsItem = {};
        const response = await axios.post('http://localhost:8080/Find_news_by_id', { newsId: this.newsId });
        this.newsItem = response.data;
      } catch (error) {
        console.error('Error fetching news content:', error);
      }
    },
    editNews() {
      // 将需要编辑的内容存入 Session Storage
      sessionStorage.setItem('editNewsContent', this.newsItem.content);

      // 導航到 EditNews 頁面，只傳遞 title 和 content
      this.$router.push({
        name: 'EditNews',
        query: {
          title: this.newsItem.title,
          content: this.newsItem.content,
          newsId: this.newsId // 将newsId传递给编辑页面
        }
      });
    },
    async deleteNews() {
      try {
        const response = await axios.post('http://localhost:8080/Delete_news', {
          newsId: this.newsId
        });

        console.log(response.data.message);

        // 刪除成功後導航回 /back 頁面
        this.$router.push('/back');
      } catch (error) {
        console.error('Error deleting news:', error);
      }
    }
  },
};
</script>

<style scoped>
.news-content {
  margin: 0px 20px 0px 20px;
  padding: 10px;
  border: 1px solid #ccc;
  height: 370px;
}

.news-header {
  margin-bottom: 10px;
  color: #333;
}

.news-body {
  color: #666;
}

.oo {
  padding-left: 20px;
  padding-top: 30px;
}
</style>

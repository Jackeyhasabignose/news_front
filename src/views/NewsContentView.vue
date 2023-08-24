<template>
  <div>
    <router-link to="/" class="back-link">首頁</router-link>
    <div class="news-content">
      <div class="news-header">
        <h2>{{ newsItem ? "[" + newsItem.category + "] " + newsItem.title : '' }}</h2>
        <p>{{ newsItem ? newsItem.publicTime : '' }}</p>
      </div>
      <div class="news-body">
        <p>{{ newsItem ? newsItem.content : '' }}</p>
      </div>
    </div>
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
        this.newsItem = {}; // 在發送請求前先將 newsItem 設為空的物件
        const response = await axios.post('http://localhost:8080/Find_news_by_id', { newsId: this.newsId });
        this.newsItem = response.data;
      } catch (error) {
        console.error('Error fetching news content:', error);
      }
    }
  }
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
  /* 標題和時間的樣式設定 */
  margin-bottom: 10px;
  color: #333;
}

.news-body {
  /* 內容的樣式設定 */
  color: #666;
}
</style>

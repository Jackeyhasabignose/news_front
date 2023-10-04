<template>
  <div>
    <router-link to="/" class="back-link">首頁</router-link>
    <div class="news-content">
      <div class="news-header">
        <h2>{{ newsItem ? "[" + newsItem.parentCategory + "] " + "[" + newsItem.category + "] " + newsItem.title +
          (newsItem.subTitle ? " - " + newsItem.subTitle : '') : '' }} </h2>
        <p>{{ newsItem ? formatDateTime(newsItem.publicTime) : '' }}</p>
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
    },
    formatDateTime(dateTime) {
      // 将传入的日期时间字符串处理成你想要的格式，去掉时间部分的 "T" 和后面的时分秒
      const date = new Date(dateTime);
      return date.toLocaleDateString(); // 这里使用toLocaleDateString()来格式化日期部分
    },
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

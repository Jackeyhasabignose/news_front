<template>
  <div class="oo">
    <router-link to="/">使用者頁面</router-link>
  </div>
  <router-link to="/add" class="btn btn-primary me-md-2">新增最新消息</router-link>
  <div class="news-list">
    <div class="news-item" v-for="item in reversedNewsItems" :key="item.newsId">
      <div class="news-header" @click="navigateToNewsDetail(item.newsId)">
        <h2>{{ item.category }} - {{ item.title }}</h2>
        <p>{{ item.publicTime }}</p>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      newsItems: []
    };
  },
  created() {
    this.fetchNewsData();
  },
  methods: {
    async fetchNewsData() {
      try {
        const response = await axios.get('http://localhost:8080/Find_all_news');
        this.newsItems = response.data;
      } catch (error) {
        console.error('Error fetching news data:', error);
      }
    },
    navigateToNewsDetail(newsId) {
      this.$router.push({ name: 'NewsContentAdmin', params: { newsId } });
    }
  },
  computed: {
    reversedNewsItems() {
      // 將消息列表反轉，讓最新的消息顯示在最上面
      return this.newsItems.slice().reverse();
    }
  }
};
</script>

<style scoped>
.news-list {
  display: flex;
  flex-direction: column;
}

.news-item {
  margin: 0px 200px 0px 200px;
  padding: 10px;
  border: 1px solid #ccc;
  cursor: pointer;
}

.news-header {
  display: flex;
  flex-direction: column;
  cursor: pointer;
}

</style>

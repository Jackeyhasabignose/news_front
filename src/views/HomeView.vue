<template>
  <div class="oo">
    <router-link to="/back">管理者頁面</router-link>
  </div>
  <div class="news-list">
    <div class="news-item" v-for="item in reversedNewsItems" :key="item.newsId">
      <h2 @click="navigateToNewsDetail(item.newsId)">
        {{ item.category }} - {{ item.title }}
      </h2>
      <p>{{ item.publicTime }}</p>
    </div>
    <news-content v-if="selectedNewsId" :newsId="selectedNewsId" />
  </div>
</template>

<script>
import NewsContent from './NewsContentView.vue';
import axios from 'axios';

export default {
  components: {
    NewsContent
  },
  data() {
    return {
      newsItems: [],
      selectedNewsId: null
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
      this.$router.push({ name: 'content', params: { newsId } });
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
</style>

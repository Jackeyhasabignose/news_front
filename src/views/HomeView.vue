<template>
  <div class="oo">
    <router-link to="/back">管理者頁面</router-link>
  </div>
  <div class="news-list">
    <div class="news-item" v-for="item in displayedNewsItems" :key="item.newsId">
      <h2 @click="navigateToNewsDetail(item.newsId)">
        {{ item.parentCategory }} - {{ item.category }} - {{ item.title }}
      </h2>
      <p>{{ item.publicTime }}</p>
    </div>
    <news-content v-if="selectedNewsId" :newsId="selectedNewsId" />
  </div>
  <div class="pagination">
    <span v-for="page in totalPages" :key="page" @click="currentPage = page">
      {{ page }}
    </span>
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
      selectedNewsId: null,
      currentPage: 1,
      itemsPerPage: 10 // 每页显示的新闻数量
      
    };
  },
  created() {
    this.fetchNewsData();
  },
  methods: {
    async fetchNewsData() {
      try {
        const response = await axios.get('http://localhost:8080/Find_all_news');
        // 过滤只显示状态为 "已發布" 的新闻
        this.newsItems = response.data.filter(item => item.status === '已發布');
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
      // 将消息列表反转，让最新的消息显示在最上面
      return this.newsItems.slice().reverse();
    },
    displayedNewsItems() {
  const startIndex = (this.currentPage - 1) * this.itemsPerPage;
  const endIndex = startIndex + this.itemsPerPage;
  return this.newsItems.slice().reverse().slice(startIndex, endIndex);
},
    // 计算总页数
    totalPages() {
      return Math.ceil(this.newsItems.length / this.itemsPerPage);
    }
  },
  
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
.pagination {
  margin-top: 20px;
  display: flex;
  justify-content: center;
}
.pagination span {
  margin: 0 5px;
  cursor: pointer;
}
</style>

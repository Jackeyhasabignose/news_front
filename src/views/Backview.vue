<template>
  <div class="oo">
    <router-link to="/">使用者頁面</router-link>
  </div>
  <div class="search">
    <!-- 标题搜索 -->
    <input v-model="searchTitle" type="text" placeholder="搜尋標題" @input="filterNews" />
    
   <!-- 开始日期搜索 -->
  <label for="startDate">開始日期：</label>
  <input v-model="startDate" id="startDate" type="date" @input="filterNews" />

  <!-- 结束日期搜索 -->
  <label for="endDate">結束日期：</label>
  <input v-model="endDate" id="endDate" type="date" @input="filterNews" />


    <!-- 分类搜索 -->
    <select v-model="searchParentCategory" @change="filterNews">
      <option value="">選擇大類別</option>
      <option value="國外">國外</option>
      <option value="國內">國內</option>
    </select>
    
    <select v-model="searchCategory" @change="filterNews">
      <option value="">選擇小類別</option>
      <option value="遊戲">遊戲</option>
      <option value="科技">科技</option>
      <option value="音樂">音樂</option>
    </select>
    
    <button @click="deleteSelectedNews" class="btn btn-danger ">一併刪除</button>
    <router-link to="/add" class="btn btn-primary me-md-2">新增最新消息</router-link>
  
  </div>
  
  
  <div class="news-list">
    <!-- 新闻列表 -->
    <div class="news-item" v-for="item in displayedNewsItems" :key="item.newsId">
      <div class="news-header">
  <input type="checkbox" v-model="selectedNewsIds" :value="item.newsId" />
  <h2 @click="navigateToNewsDetail(item.newsId)">{{ item.parentCategory }} - {{ item.category }} - {{ item.title }}({{ item.status }})</h2>
  <p>{{ item.publicTime }}</p>
</div>

    </div>
    
  </div>
  <!-- 添加按钮，用于删除选定的新闻 -->

  <!-- 分页控件 -->
  <div class="pagination">
    <span v-for="page in totalPages" :key="page" @click="currentPage = page">
      {{ page }}
    </span>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      newsItems: [],
      currentPage: 1,
      itemsPerPage: 10,
      searchTitle: '',        // 标题搜索条件
      startDate: '',          // 开始日期搜索条件
      endDate: '',            // 结束日期搜索条件
      searchParentCategory: '', // 大类别搜索条件
      searchCategory: '',     // 小类别搜索条件
      selectedNewsIds: []  // 存储选定新闻的newsId
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
        // 初始化页面后，应用搜索条件
        this.filterNews();
      } catch (error) {
        console.error('Error fetching news data:', error);
      }
    },
    navigateToNewsDetail(newsId) {
      this.$router.push({ name: 'NewsContentAdmin', params: { newsId } });
    },
    filterNews() {
  // 使用筛选条件对新闻数据进行过滤
  this.newsItems = this.newsItems.filter((item) => {
    const titleMatch = item.title.toLowerCase().includes(this.searchTitle.toLowerCase());
    const dateMatch = (!this.startDate || item.publicTime >= this.startDate) &&
                      (!this.endDate || item.publicTime <= this.endDate);
    const parentCategoryMatch = !this.searchParentCategory || item.parentCategory === this.searchParentCategory;
    const categoryMatch = !this.searchCategory || item.category === this.searchCategory;
    return titleMatch && dateMatch && parentCategoryMatch && categoryMatch;
  });
},

    searchNews() {
      this.filterNews();
    },
    deleteSelectedNews() {
      // 发送请求以删除选定的新闻
      axios.post('http://localhost:8080/Delete_news', { newsIds: this.selectedNewsIds })
        .then((response) => {
          console.log(response.data.message);
          // 删除成功后刷新新闻列表
          this.fetchNewsData();
          // 清空选定的新闻列表
          this.selectedNewsIds = [];
        })
        .catch((error) => {
          console.error('Error deleting selected news:', error);
        });
    }
  },
  computed: {
    // 计算当前页应该显示的新闻数据
    displayedNewsItems() {
      const startIndex = (this.currentPage - 1) * this.itemsPerPage;
      const endIndex = startIndex + this.itemsPerPage;
      return this.newsItems.slice(startIndex, endIndex);
    },
    // 计算总页数
    totalPages() {
      return Math.ceil(this.newsItems.length / this.itemsPerPage);
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

.pagination {
  margin-top: 20px;
  display: flex;
  justify-content: center;
}

.pagination span {
  margin: 0 5px;
  cursor: pointer;
}

.search {
  margin: 20px 0;
  display: flex;
  align-items: center;
}

input[type="text"],
input[type="date"],
select {
  margin-right: 10px;
}

</style>

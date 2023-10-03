<template>
  <div class="oo">
    <router-link to="/">使用者頁面</router-link>
  </div>
  <div class="search">
    <!-- 标题搜索 -->
    <input v-model="searchTitle" type="text" placeholder="搜尋標題" @input="reloadData" />
    
   <!-- 开始日期搜索 -->
  <label for="startDate">開始日期：</label>
  <input v-model="startDate" id="startDate" type="date" @input="reloadData" />

  <!-- 结束日期搜索 -->
  <label for="endDate">結束日期：</label>
  <input v-model="endDate" id="endDate" type="date" @input="reloadData" />

  <!-- 分类搜索 -->
  <label for="parentCategory">大類別：</label>
  <select v-model="searchParentCategory" id="parentCategoryName" @change="filterNews" class="input-field2">
    <option value="">所有</option>
    <option v-for="category in parentCategories" :value="category.parentCategoryName" :key="category">
      {{ category.parentCategoryName  }}
    </option>
  </select><br>
  <label for="category">小類別：</label>
  <select v-model="searchCategory" id="categoryName" class="input-field2" @change="filterNews">
    <option value="">所有</option> 
    <option v-for="category in categories" :value="category.categoryName" :key="category">
      {{ category.categoryName  }}
    </option>
  </select>

  <!-- 添加排序方式选择 -->
  <select v-model="sortOrder" @change="sortNews">
    <option value="latest">以發布最新時間排序</option>
    <option value="oldest">以發布最早時間排序</option>
  </select>
  
  <button @click="confirmDelete" class="btn btn-danger">一鍵刪除</button>
  <router-link to="/add" class="btn btn-primary me-md-2">新增最新消息</router-link>
</div>
  
<div class="news-list">
  <!-- 新闻列表 -->
  <div class="news-item" v-for="item in displayedNewsItems" :key="item.newsId">
    <div class="news-header">
      <input type="checkbox" v-model="selectedNewsIds" :value="item.newsId" />
      <h2 @click="navigateToNewsDetail(item.newsId)">({{ item.parentCategoryName }}) - ({{ item.categoryName }}) - {{ item.title }}- ({{ item.subTitle }})({{ item.status }})</h2>
      <p>{{ formatDateTime(item.publicTime) }}</p>
      <!-- 在这里添加修改按钮，仅在管理者页面时显示 -->
      <button v-if="true" @click="editNews(item.newsId)" class="btn btn-primary small-button">修改</button>
    </div>
  </div>

  <!-- 分页控件 -->
  <div class="pagination">
    <span v-for="page in totalPages" :key="page" @click="currentPage = page">{{ page }}</span>
  </div>
</div>
<label for="itemsPerPage">顯示最新消息筆數：</label>
<select v-model="itemsPerPage" id="itemsPerPage" @change="updateDisplayedNews">
  <option value="10">10 筆</option>
  <option value="50">50 筆</option>
  <option value="100">100 筆</option>
</select>

</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      newsItems: [],
      parentCategories: [], // 存储大类别选项
      categories: [], // 存储小类别选项
      currentPage: 1,
      itemsPerPage: 10,
      searchTitle: '',        // 标题搜索条件
      startDate: '',          // 开始日期搜索条件
      endDate: '',            // 结束日期搜索条件
      searchParentCategory: '', // 大类别搜索条件
      searchCategory: '',     // 小类别搜索条件
      sortOrder: 'latest', // 默认按最新时间排序
      selectedNewsIds: [],
      showCategorySelect: false,  // 控制小类别选项的显示/隐藏
      originalNewsItems: [], // 存储原始新闻数据备份
      itemsPerPage: 10, // 默认每页显示 10 篇新闻
    };
  },
  created() {
    this.fetchNewsData();
    this.getParentCategories();
    this.getCategories();
  },
  methods: {
    async fetchNewsData() {
      try {
        const response = await axios.get('http://localhost:8080/Find_all_news');
        this.originalNewsItems = response.data; // 备份原始数据
        this.newsItems = [...this.originalNewsItems]; // 使用备份数据初始化当前显示的数据

        // 数据加载完成后，应用搜索条件
        this.filterNews();
      } catch (error) {
        console.error('Error fetching news data:', error);
      }
    },
    updateDisplayedNews() {
    // 重新计算当前显示的新闻
    this.currentPage = 1; // 重置当前页为第一页
    this.sortNews(); // 重新排序
  },
    async getParentCategories() {
      try {
        const response = await axios.get('http://localhost:8080/get_all_parent_categories_with_news_count');
        this.parentCategories = response.data;
      } catch (error) {
        console.error('Error fetching parent categories:', error);
      }
    },
    async getCategories() {
      try {
        const response = await axios.get('http://localhost:8080/get_all_categories_with_news_count');
        this.categories = response.data;
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    },
    editNews(newsId) {
      const newsItem = this.newsItems.find(item => item.newsId === newsId);

      if (newsItem) {
        const parentCategory = newsItem.parentCategory || '';
        const requestData = {
          title: newsItem.title,
          content: newsItem.content,
          parentCategoryName: newsItem.parentCategoryName,
          categoryName: newsItem.categoryName,
          subTitle: newsItem.subTitle,
          newsId: newsId
        };

        // 導航到 EditNews 頁面，傳遞 requestData
        this.$router.push({
          name: 'EditNews',
          query: requestData
        });
      } else {
        console.error('News item not found for newsId:', newsId);
      }
    },
    navigateToNewsDetail(newsId) {
      this.$router.push({ name: 'NewsContentAdmin', params: { newsId } });
    },
    filterNews() {
      // 使用备份数据进行筛选
      this.newsItems = this.originalNewsItems.filter((item) => {
        const titleMatch = this.searchTitle.trim() === '' || item.title.toLowerCase().includes(this.searchTitle.toLowerCase());
        const dateMatch = (!this.startDate || item.publicTime >= this.startDate) &&
                          (!this.endDate || item.publicTime <= this.endDate);
        const parentCategoryMatch = !this.searchParentCategory || item.parentCategoryName === this.searchParentCategory;
        const categoryMatch = !this.searchCategory || item.categoryName === this.searchCategory;

        return titleMatch && dateMatch && parentCategoryMatch && categoryMatch;
      });

      this.sortNews();
    },
    sortNews() {
      // 根据排序方式对新闻数据进行排序
      if (this.sortOrder === 'latest') {
        this.newsItems.sort((a, b) => new Date(b.publicTime) - new Date(a.publicTime));
      } else if (this.sortOrder === 'oldest') {
        this.newsItems.sort((a, b) => new Date(a.publicTime) - new Date(b.publicTime));
      }
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
    },
    confirmDelete() {
      // 使用 confirm() 方法来弹出确认对话框
      const isConfirmed = window.confirm('確定要刪除所選新聞嗎？');

      if (isConfirmed) {
        // 用户点击了"确定"
        this.deleteSelectedNews();
      }
    },
    async reloadData() {
      // 更新开始日期和结束日期的值
      this.startDate = document.getElementById('startDate').value;
      this.endDate = document.getElementById('endDate').value;
    
      // 调用fetchNewsData方法重新加载数据
      await this.fetchNewsData();
    },
    formatDateTime(dateTime) {
      // 将传入的日期时间字符串处理成你想要的格式，去掉时间部分的 "T" 和后面的时分秒
      const date = new Date(dateTime);
      return date.toLocaleDateString(); // 这里使用toLocaleDateString()来格式化日期部分
    }
  },
  computed: {
    displayedNewsItems() {
      const startIndex = (this.currentPage - 1) * this.itemsPerPage;
      const endIndex = startIndex + this.itemsPerPage;
      return this.newsItems.slice(startIndex, endIndex);
    },
    displayedNewsItems() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return this.newsItems.slice(startIndex, endIndex);
  },
    totalPages() {
      return Math.ceil(this.newsItems.length / this.itemsPerPage);
    },
    newsCountByParentCategory() {
      const counts = {};
      for (const item of this.newsItems) {
        if (!counts[item.parentCategory]) {
          counts[item.parentCategory] = 0;
        }
        counts[item.parentCategory]++;
      }
      return counts;
    },
    newsCountByCategory() {
      const counts = {};
      for (const item of this.newsItems) {
        if (!counts[item.category]) {
          counts[item.category] = 0;
        }
        counts[item.category]++;
      }
      return counts;
    },
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

.small-button {
  font-size: 12px; 
  padding: 5px 10px; 
}
</style>

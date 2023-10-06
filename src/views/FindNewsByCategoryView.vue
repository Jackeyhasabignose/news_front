<template>
    <div class="pp">
        <router-link to="/category">返回上一頁</router-link>
        <select v-model="sortOrder" @change="sortNews">
            <option value="latest">以發布最新時間排序</option>
            <option value="oldest">以發布最早時間排序</option>
        </select>
    </div>

    <div class="news-container">
        <!-- 遍历并渲染每则新闻的数据 -->
        <div v-for="newsItem in displayedNewsItems" :key="newsItem.newsId" class="news-item">
            <div class="news-header">
                <h2 @click="navigateToNewsContent(newsItem.newsId)">
                    [{{ newsItem.categoryName }}] {{ newsItem.title }}
                    {{ newsItem.subTitle ? ' - ' + newsItem.subTitle : '' }}
                    <p>發布日期: {{ newsItem ? formatDateTime(newsItem.publicTime) : '' }}</p>
                    <p>狀態: {{ newsItem.status }}</p>
                </h2>
                <!-- 其他属性的显示 -->
            </div>
        </div>
    </div>
    <!-- 分页控件 -->
    <div class="pagination">
        <span v-for="page in totalPages" :key="page" @click="currentPage = page">{{ page }}</span>
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
            newsList: [], // 存储新闻列表数据
            itemsPerPage: 10,
            currentPage: 1,
            sortOrder: 'latest', // 默认按最新时间排序
        };
    },
    created() {
        // 此处应该从后端或其他数据源获取新闻列表数据并赋值给 newsList
        this.getFilteredNews();
    },
    methods: {
        async getFilteredNews() {
            try {
                const response = await axios.post('http://localhost:8080/Find_news_by_category_name', {
                    categoryName: this.$route.params.categoryName        
                });
                console.log('API 响应数据:', response.data); // 输出响应数据
                console.log('前端路由参数值:', this.$route.params.categoryName);

                this.newsList = response.data;
                // 数据加载后进行排序
                this.sortNews();
            } catch (error) {
                console.error('获取筛选后的新闻时出错：', error);
            }
        },

        navigateToNewsContent(newsId) {
            this.$router.push({ name: 'ParentCategoryContent', params: { newsId } });
        },

        sortNews() {
            console.log('Sort order:', this.sortOrder);

            // 根据排序方式对新闻数据进行排序
            if (this.sortOrder === 'latest') {
                this.newsList.sort((a, b) => new Date(b.publicTime) - new Date(a.publicTime));
            } else if (this.sortOrder === 'oldest') {
                this.newsList.sort((a, b) => new Date(a.publicTime) - new Date(b.publicTime));
            }
        },

        updateDisplayedNews() {
            // 重新计算当前显示的新闻
            this.currentPage = 1; // 重置当前页为第一页
            this.sortNews(); // 重新排序
        },

        formatDateTime(dateTime) {
            // 将传入的日期时间字符串处理成你想要的格式，去掉时间部分的 "T" 和后面的时分秒
            const date = new Date(dateTime);
            return date.toLocaleDateString(); // 这里使用toLocaleDateString()来格式化日期部分
        },
    },
    computed: {
        displayedNewsItems() {
            const startIndex = (this.currentPage - 1) * this.itemsPerPage;
            const endIndex = startIndex + this.itemsPerPage;
            return this.newsList.slice(startIndex, endIndex);
        },

        totalPages() {
            const totalPages = Math.ceil(this.newsList.length / this.itemsPerPage);
            console.log('totalPages:', totalPages); // 打印 totalPages 的值
            return totalPages;
        },
    },
};
</script>
  
<style>
/* 样式设置 */
.news-container {
    max-width: 800px;
    /* 设置容器的最大宽度 */
    margin: 0 auto;
    /* 居中容器 */
    padding: 0 20px;
    /* 在两侧添加空白 */
}

.news-item {
    margin-top: 2rem;
    border: 1px solid #ccc;
    padding: 10px;
    margin-bottom: 2rem;
    /* 添加其他样式属性以控制新闻项的外观 */
}

.news-header h2 {
    font-size: 24px;
    /* 调整字体大小，可以根据需要更改像素值 */
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

.pp {
    display: flex;
    justify-content: space-between;
}
</style>
  
<template>
    <div class="oo">
        <div>
            <router-link to="/back">回首頁</router-link>
        </div>
        <div>
            <button @click="confirmDelete" class="btn btn-danger me-md-2">一鍵刪除</button>
            <router-link to="/addParentcategory" class="btn btn-primary me-md-2">新增大類別</router-link>
            <router-link to="/alterParentcategory" class="btn btn-secondary me-md-2">修改大類別</router-link>


        </div>
    </div>
    <div class="container">
        <div v-for="category in parentCategories" :key="category.parentCategoryId" class="category-block">
            <!-- 使用 router-link 將類別名稱作為連結，但保持外觀不變 -->
            <input type="checkbox" v-model="category.isSelected">
            <router-link :to="'/findNewsByParentCategory/' + category.parentCategoryName" class="category-link">
                <!-- <input type="checkbox" v-model="category.isSelected"> -->
                <span class="category-name">{{ category.parentCategoryName }} (最新消息數量: {{ category.newsCount }})</span>
                <span class="category-title" :class="{ 'active': category.showTitle }"></span>
            </router-link>
        </div>
    </div>
</template>
  
<script>
import axios from 'axios';

export default {
    data() {
        return {
            parentCategories: [], // 存儲大類別選項
        };
    },
    created() {
        // 獲取大類別和新聞數量
        this.getAllParentCategoriesWithNewsCount();
    },
    methods: {
        async getAllParentCategoriesWithNewsCount() {
            try {
                // 發起獲取大類別數據的請求，假設後端提供了獲取大類別的API
                const response = await axios.get('http://localhost:8080/get_all_parent_categories_with_news_count');
                this.parentCategories = response.data.map(category => ({ ...category, showTitle: false, isSelected: false }));
            } catch (error) {
                console.error('獲取大類別時出錯：', error);
            }
        },
        async confirmDelete() {
            // 找出被勾選的親類別
            const selectedCategories = this.parentCategories.filter(category => category.isSelected);

            if (selectedCategories.length === 0) {
                alert('請先選擇要刪除的親類別');
                return;
            }

            // 提示用戶確認是否刪除
            const userConfirmed = window.confirm('確定要刪除所選的項目嗎？');

            if (!userConfirmed) {
                return; // 如果用戶取消了操作，不執行刪除操作
            }

            // 檢查選中的項目是否擁有最新消息數量為 0
            const categoriesWithZeroNews = selectedCategories.filter(category => category.newsCount === 0);

            if (categoriesWithZeroNews.length !== selectedCategories.length) {
                alert('最新消息中包含此大類別，無法刪除');
                return;
            }

            // 打印選中的親類別ID數組
            console.log('選中的親類別ID數組:', selectedCategories.map(category => category.parentCategoryId));

            try {
                // 在前端刪除被選中的項目
                this.parentCategories = this.parentCategories.filter(category => !category.isSelected);

                // 發送刪除親類別的請求到後端
                const response = await axios.post('http://localhost:8080/Delete_parent_category', {
                    parentCategoryIds: selectedCategories.map(category => category.parentCategoryId),
                });

                // 處理後端的響應，檢查消息字段
                if (response.data.message === "add successfully.") {
                    alert('刪除成功'); // 刪除成功，顯示刪除成功的警告
                } else {
                    alert('刪除失敗');
                }
            } catch (error) {
                console.error('刪除親類別時出錯：', error);
            }
        },








    },
};
</script>
  
<style scoped>
.container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 100vh;
    /* 使容器佔滿整個視窗高度 */
    background-color: #f0f0f0;
    /* 背景顏色 */
}

.category-block {
    background-color: #fff;
    /* 區塊背景顏色 */
    margin: 10px 0;
    /* 上下間距 */
    padding: 10px;
    /* 內邊距 */
    border-radius: 5px;
    /* 圓角邊框 */
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    /* 陰影效果 */
    display: flex;
    align-items: center;
    /* 垂直置中 */
    justify-content: center;
    /* 水平置中 */
}

.category-title {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    color: #fff;
    /* 大類別標題文字顏色 */
    padding: 5px;
    /* 內邊距 */
    border-radius: 5px;
    /* 圓角邊框 */
    opacity: 0;
    /* 初始設置為透明 */
    transition: all 0.3s ease;
    /* 添加動畫效果 */
}

.category-link {
    text-decoration: none;
    color: inherit;
    cursor: pointer;
    display: contents;
}

.active {
    opacity: 1;
    /* 啟用時設置為不透明 */
}

.oo {
    display: flex;
    justify-content: space-between;
}
</style>
  
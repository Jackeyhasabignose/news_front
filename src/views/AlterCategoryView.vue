<template>
    <router-link to="/parentCategory">返回上一頁</router-link>
    <div class="center-container">
        <div>
            <!-- 下拉框来选择要修改的大类别 -->
            <select v-model="selectedCategoryId" >
                <option v-for="category in parentCategories" :key="category.categoryId"
                    :value="category.categoryId">
                    {{ category.categoryName }}
                </option>
            </select>
            <!-- 输入框用于编辑大类别名称 -->
            <input v-model="newCategoryName" placeholder="編輯大類別名稱" />
            <button class="btn btn-primary" @click="alterParentCategory">修改</button>
        </div>
    </div>
</template>
  

<script>
export default {
    data() {
        return {
            parentCategories: [], // 存储大类别列表
            selectedCategoryId: null, // 选择要修改的大类别的ID
            newCategoryName: "", // 用于编辑大类别名称
        };
    },
    created() {
        // 获取大类别列表
        this.getAllParentCategoriesWithNewsCount();
    },
    methods: {
        async getAllParentCategoriesWithNewsCount() {
            // 通过GET请求获取大类别列表
            try {
                const response = await this.$axios.get('http://localhost:8080/get_all_categories_with_news_count');
                this.parentCategories = response.data;
            } catch (error) {
                console.error('获取大类别时出错：', error);
            }
        },
        async alterParentCategory() {
            // 检查是否选择了大类别
            if (!this.selectedCategoryId) {
                alert("請先選擇要修改的小類別並且輸入修改後的名稱");
                return;
            }

            // 检查输入是否为空
            if (!this.newCategoryName.trim()) {
                alert("請先選擇要修改的小類別並且輸入修改後的名稱");
                return;
            }

            // 获取选中的大类别
            const selectedCategory = this.parentCategories.find(category => category.categoryId === this.selectedCategoryId);

            // 检查新名称是否与旧名称相同
            if (selectedCategory && selectedCategory.categoryName === this.newCategoryName.trim()) {
                alert("新名稱不能跟就名稱重複");
                return;
            }

            // 构造要发送的 JSON 数据
            const requestData = {
                categoryId: this.selectedCategoryId,
                categoryName: this.newCategoryName.trim(),
            };

            try {
                const response = await this.$axios.post('http://localhost:8080/Alter_category', requestData);
                // 处理后端响应
                console.log(response.data);

                // 检查后端返回的消息并显示相应提示
                if (response.data.message === "It's InvalidCategory.") {
                    alert("类别已存在");
                } else if (response.data.message === "add successfully.") {
                    // 显示成功提示
                    alert("修改成功");
                    // 重定向到 /parentCategory 页面
                    this.$router.push('/category');
                } else {
                    alert("修改失败");
                }
            } catch (error) {
                // 处理错误响应
                console.error(error);

                // 检查错误响应的消息内容
                if (error.response && error.response.data && error.response.data.message) {
                    // 从后端响应中获取错误消息并显示
                    alert(error.response.data.message);
                } else {
                    // 显示默认的错误提示
                    alert("修改失败");
                }
            }
        },

    },
};


</script>
  

<style>
.center-container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    /* 让容器占据整个视口高度 */
}

.center-content {
    text-align: center;
    /* 水平居中文本内容 */
}
</style>


<template>
    <div class="news-item">
      <h2>{{ title }}</h2>
      <p>{{ publishTime }}</p>
    </div>
  </template>
  
  <script>
  export default {
    props: ['title', 'publishTime']
  };
  </script>
  
  <style scoped>
  .news-item {
    margin: 10px;
    padding: 10px;
    border: 1px solid #ccc;
  }
  </style>
  
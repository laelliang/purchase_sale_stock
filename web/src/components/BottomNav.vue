<template>
  <div class="bottom-nav">
    <router-link to="/" class="btn" :class="{'active': router.path === '/'}">首页</router-link>
    <router-link to="/action" class="btn" :class="{'active': router.path === '/action'}">操作</router-link>
    <router-link to="/history" class="btn" :class="{'active': router.path === '/history'}">历史</router-link>
  </div>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'
const router = useRoute()
</script>

<style scoped lang="scss">
.active {
  
  color: #1989fa!important;
}

.bottom-nav {
  display: flex;
  justify-content: space-around;
  background-color: #ffffff;
  a {
    display: inline-block;
    padding: 20px;
    color: black;
    text-decoration: none;
  }
}

</style>
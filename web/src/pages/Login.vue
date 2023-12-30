<template>
  <div class="login-page">
    <van-form @submit="onSubmit">
      <van-cell-group inset>
        <van-field
          v-model="userName"
          label="用户名"
          placeholder="请输入用户名"
          :rules="[{ validator: userNameValidator }]"
        />
        <van-field
          v-model="password"
          type="password"
          label="密码"
          placeholder="请输入密码"
          :rules="[{ validator: passwordValidator }]"
        />
      </van-cell-group>
      <div class="form-bottom">
        <van-button type="primary" block native-type="submit">登录</van-button>
      </div>
    </van-form>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { login } from '@/api'
import { useRouter } from 'vue-router'
const router = useRouter()

const userName = ref('')
const password = ref('')

const onSubmit = () => {
  const params = {
    user_name: userName.value,
    password: password.value
  }
  login(params)
  .then(() => (
    router.push('/')
  ))
}

const userNameValidator = (val: string) => {
  if (!val) {
    return '用户名不得为空'
  }
  
  if (val.length > 25) {
    return '用户名最多25位长度'
  }
  return true
}

const passwordValidator = (val: string) => {
  if (val.length < 6) {
    return '密码最低为6位'
  }
  return true
}

</script>
<style scoped lang="scss">
.login-page {
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  flex-grow: 1;
  .form-bottom {
    margin-top: 20px;
    margin-left: 16px;
    margin-right: 16px;
  }
}

</style>
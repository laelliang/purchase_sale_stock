<template>
  <table class="min-table">
    <thead>
      <tr>
        <th v-for="val in props.headerArr">{{ val.name }}</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="obj in props.dataArr">
        <td v-for="val in props.headerArr">{{ obj[val.key] }}</td>
      </tr>
    </tbody>


  </table>
  
</template>

<script setup lang="ts">
const props = defineProps({
  dataArr: Array<any>,
  headerArr: Array<any>
})

</script>

<style scoped lang="scss">
.min-table{
  border-collapse: collapse;
  width: 100%;
  thead {
    text-align: left;
  }
  th,td {
    border: 1px solid #eeeeee;
  }
}
</style>
<!--
    Administrator
    2018/9/14 17:05
 -->
<template>
  <div class="app-container">
    <el-form ref="dataForm" :rules="rules" :model="temp" label-position="right" label-width="120px" style="width: 100%;">
      <el-form-item :label="$t('table.opentime')">
        <el-date-picker
          v-model="value4"
          class="filter-item"
          size="small"
          type="datetimerange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"/>
      </el-form-item>
      <el-form-item label="LOGO">
        <el-upload
          :auto-upload="false"
          action="https://jsonplaceholder.typicode.com/posts/"
          list-type="picture-card">
          <i class="el-icon-plus"/>
        </el-upload>
      </el-form-item>
      <el-form-item :label="$t('table.copyright')">
        <el-input v-model="temp.title" type="text"/>
      </el-form-item>
      <el-form-item :label="$t('table.nameOfLink')">
        <el-input v-model="temp.title" type="text"/>
      </el-form-item>
      <el-form-item :label="$t('table.linkWebsite')">
        <el-input v-model="temp.title" type="text"/>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: 'SystemSetup',
  data() {
    return {
      value4: '',
      temp: {},
      rules: {}
    }
  }
}
</script>

<style>

</style>

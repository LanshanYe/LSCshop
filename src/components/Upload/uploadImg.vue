<!--
    Administrator
    2018/9/20 17:12
 -->
<template>
  <el-upload
    :show-file-list="false"
    :headers="usertoken"
    :on-success="handleAvatarSuccess"
    :before-upload="handleAvatarbeforeupload"
    :on-error="handleAvatarError"
    :limit="limit"
    :action="upurl + url"
    name="image"
    accept="image/*"
    class="avatar-uploader">
    <img v-if="imgsrc" :src="imgsrc.indexOf($imgSrc) >= 0?imgsrc:$imgSrc + imgsrc" class="avatar">
    <i v-else class="el-icon-plus avatar-uploader-icon"/>
  </el-upload>
</template>

<script>
import { getToken } from '@/utils/auth'
import store from '@/store'
export default {
  name: 'UploadImg',
  props: {
    limit: {
      type: Number,
      default: 5
    },
    url: {
      type: String,
      default: 'http://lianshangche.ydxxtech.com/admin/uploadImages/car_cover'
    },
    imgsrc: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      usertoken: {
        Authorization: 'Bearer ' + getToken()
      },
      upurl: store.getters.url
    }
  },
  methods: {
    handleAvatarSuccess(res, file) {
      this.$emit('upSuccess', res)
    },
    handleAvatarError() {
      this.$emit('upError', 'error')
    },
    handleAvatarbeforeupload() {
      this.$emit('upBefore', 'beforeUp')
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .avatar-uploader-icon:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    border-radius: 6px;
    border: 1px dashed #d9d9d9;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    height: 200px;
    display: block;
  }
</style>

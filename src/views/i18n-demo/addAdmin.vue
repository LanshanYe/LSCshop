<!--
    Administrator
    2018/9/15 15:05
 -->
<template>
  <div class="app-container">
    <el-form ref="dataForm" :rules="rules" :model="temp" label-position="right" label-width="120px" style="width: 100%;">
      <el-form-item :label="$t('table.adminName')" prop="name">
        <el-input v-model="temp.name" type="text" placeholder="如：admin"/>
      </el-form-item>
      <el-form-item :label="$t('table.showName')" prop="display_name">
        <el-input v-model="temp.display_name" type="text" placeholder="如：管理员"/>
      </el-form-item>
      <el-form-item :label="$t('table.nameinfo')" prop="description">
        <el-input v-model="temp.description" type="text" placeholder="如：该管理员的权限范围"/>
      </el-form-item>
      <el-form-item :label="$t('table.permission')" prop="permissions">
        <el-row class="border" style="border-top: 1px solid #DCDFE6">
          <el-col :span="4">
            主菜单
          </el-col>
          <el-col :span="20" style="border-left: 1px solid #DCDFE6;;padding: 0 10px">
            子菜单
          </el-col>
        </el-row>
        <el-row v-for="(it, index) in addRouters" v-show="index < addRouters.length - 1" :key="index" class="border">
          <el-row>
            <el-col :span="4">
              <el-checkbox-group v-model="temp.permissions">
                <el-checkbox :label="it.promiss" :key="index">{{ it.zhname }}</el-checkbox>
              </el-checkbox-group>
            </el-col>
            <el-col v-if="it.children && it.children.length > 1" :span="20" style="border-left: 1px solid #DCDFE6;padding: 0 10px">
              <el-checkbox-group v-model="temp.permissions" @change="getchecked">
                <el-checkbox v-for="it2 in it.children" :label="it2.promiss" :key="it2.path">{{ it2.zhname }}</el-checkbox>
              </el-checkbox-group>
            </el-col>
          </el-row>
        </el-row>
      </el-form-item>
      <div style="text-align: center">
        <el-button type="primary" @click="submit">{{ $t('table.add') }}</el-button>
      </div>
    </el-form>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import treeTable from '@/components/TreeTable'
import request from '@/utils/request'
export default {
  name: 'AddAdmin',
  components: {
    treeTable
  },
  data() {
    const checkPermissions = (rule, value, callback) => {
      if (value.length === 0) {
        return callback(new Error(this.$t('rules.permissions')))
      } else {
        callback()
      }
    }
    return {
      temp: {
        name: '',
        display_name: '',
        description: '',
        permissions: []
      },
      rules: {
        name: [{ required: true, message: this.$t('rules.name'), trigger: 'blur' }],
        display_name: [{ required: true, message: this.$t('rules.display_name'), trigger: 'blur' }],
        description: [{ required: true, message: this.$t('rules.description'), trigger: 'blur' }],
        permissions: [{ required: true, validator: checkPermissions, trigger: 'change' }]
      }
    }
  },
  computed: {
    ...mapGetters([
      'addRouters'
    ])
  },
  created() {
    console.log(this.$route.params)
    if (this.$route.params.type) {
      if (this.$route.params.id) {
        request({
          method: 'get',
          url: '/role/' + this.$route.params.id
        }).then(re => {
          console.log(re)
          this.temp = re.data.result
        }).catch(errs => console.log(errs))
      }
    }
  },
  methods: {
    submit() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.temp)
          request({
            method: 'post',
            url: '/role',
            data: tempData
          }).then((re) => {
            console.log(re)
            if (re.data.status === 'success') {
              this.$notify({
                title: '成功',
                message: '添加成功',
                type: 'success'
              })
              this.resetTemp()
              this.$nextTick(() => {
                this.$refs['dataForm'].clearValidate()
              })
            } else {
              this.$notify.error({
                title: '失败',
                message: re.data.msg
              })
            }
          }).catch(errs => {
            console.log(errs)
          })
        }
      })
    },
    getchecked(d) {
      console.log(d)
    },
    resetTemp() {
      this.temp = {
        name: '',
        display_name: '',
        description: '',
        permissions: []
      }
    }
  }
}
</script>

<style scoped>
  .border{
    border-bottom: 1px solid #DCDFE6;
    border-left: 1px solid #DCDFE6;
    border-right: 1px solid #DCDFE6;
    padding: 0 10px;
  }
</style>

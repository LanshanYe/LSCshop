<template>
  <query ref="querycomponent" :list-query="listQuery" :api="api" :temp="temp">
    <div slot="queryFilter">
      <el-button v-waves class="filter-item" size="small" type="primary" icon="el-icon-edit" @click="handleCreate">{{ $t('table.add') }}</el-button>
    </div>
    <el-table-column slot="tableColumn" :label="$t('table.adminName')" prop="display_name" align="center"/>
    <el-table-column slot="tableColumn" :label="$t('table.avatar')" prop="avatar" align="center"/>
    <el-table-column slot="tableColumn" :label="$t('table.username')" prop="name" align="center"/>
    <el-table-column slot="tableColumn" :label="$t('table.createTime')" prop="created_at" align="center"/>
    <el-table-column slot="tableColumn" :label="$t('table.actions')" align="center" width="230" class-name="small-padding fixed-width">
      <template slot-scope="scope">
        <el-button type="primary" size="mini" @click="handleUpdate(scope.row.role_id)">{{ $t('table.edit') }}</el-button>
        <el-button size="mini" type="danger" @click="deleteData(scope.row.role_id)">{{ $t('table.delete') }}
        </el-button>
      </template>
    </el-table-column>
    <div slot="dataForms">
      <el-form-item :label="$t('table.username')">
        <el-input v-model="temp.username" type="text"/>
      </el-form-item>
      <el-form-item :label="$t('table.avatar')">
        <input type="file">
      </el-form-item>
      <el-form-item :label="$t('table.realname')">
        <el-input v-model="temp.realname" type="text"/>
      </el-form-item>
      <el-form-item :label="$t('table.adminName')">
        <el-checkbox-group v-model="checkList">
          <el-checkbox v-for="(it, index) in permissiondata" :label="it.label" :key="index">{{ it.value }}</el-checkbox>
        </el-checkbox-group>
      </el-form-item>
    </div>
  </query>
</template>

<script>
import query from '@/components/queryTable'
import waves from '@/directive/waves' // 水波纹指令

export default {
  name: 'I18n',
  directives: {
    waves
  },
  components: {
    query
  },
  data() {
    return {
      permissiondata: [
        { label: '1', value: '管理员' },
        { label: '2', value: '普通用户' }
      ],
      api: {
        fetch: 'role',
        info: 'role'
      },
      checkList: [],
      list: null,
      total: null,
      value4: '',
      listLoading: true,
      listQuery: {
        page: 1
      },
      statusOptions: ['published', 'draft', 'deleted'],
      showReviewer: false,
      temp: {},
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '修改',
        create: '新增'
      },
      dialogPvVisible: false,
      pvData: [],
      rules: {
        type: [{ required: true, message: 'type is required', trigger: 'change' }],
        timestamp: [{ type: 'date', required: true, message: 'timestamp is required', trigger: 'change' }],
        title: [{ required: true, message: 'title is required', trigger: 'blur' }]
      },
      downloadLoading: false
    }
  },
  methods: {
    deleteData(id) {
      this.$refs.querycomponent.deleteData(id)
    },
    handleFilter() {
      this.$refs.querycomponent.handleFilter()
    },
    resetTemp() {
      this.$refs.querycomponent.resetTemp()
    },
    handleCreate() {
      this.$refs.querycomponent.handleCreate()
    },
    createData() {
      this.$refs.querycomponent.createData()
    },
    handleUpdate(id) {
      this.$r.get(this.api.info, id).then(re => {
        console.log(re)
        this.temp = re.data.result
        this.$refs.querycomponent.handleUpdate()
      }).catch(errs => {
        console.log(errs)
      })
    },
    updateData() {
      this.$refs.querycomponent.updateData()
    },
    handleDownload() {
      this.$refs.querycomponent.handleDownload()
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>

</style>

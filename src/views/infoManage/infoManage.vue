<template>
  <query ref="querycomponent" :list-query="listQuery" :api="queryapi">
    <div slot="queryFilter">
      <el-button v-waves class="filter-item" size="small" type="primary" icon="el-icon-edit" @click="handleCreate">{{ $t('table.add') }}</el-button>
    </div>
    <el-table-column slot="tableColumn" :label="$t('table.title')" prop="title" align="center"/>
    <el-table-column slot="tableColumn" :label="$t('table.type')" align="center">
      <template slot-scope="scope">
        <span>{{ scope.row.type | filterType }}</span>
      </template>
    </el-table-column>
    <el-table-column slot="tableColumn" :label="$t('table.releaseDate')" prop="created_at" align="center"/>
    <el-table-column slot="tableColumn" :label="$t('table.actions')" align="center" width="230" class-name="small-padding fixed-width">
      <template slot-scope="scope">
        <el-button type="primary" size="mini" @click="handleUpdate(scope.row.notice_id)">{{ $t('table.edit') }}</el-button>
        <el-button size="mini" type="danger" @click="deleteData(scope.row.notice_id)">{{ $t('table.delete') }}
        </el-button>
      </template>
    </el-table-column>
    <div slot="dataForms">
      <el-form-item :label="$t('table.type')">
        <el-select v-model="temp.importance" :placeholder="$t('table.status')" size="small" clearable>
          <el-option v-for="item in typedata" :key="item.value" :label="item.label" :value="item.value"/>
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('table.title')">
        <el-input v-model="temp.title" type="text"/>
      </el-form-item>
      <el-form-item :label="$t('table.content')">
        <el-input v-model="temp.content" type="textarea"/>
      </el-form-item>
    </div>
  </query>
</template>

<script>
import query from '@/components/queryTable'
import waves from '@/directive/waves' // 水波纹指令
const typedata = [
  { value: 1, label: '通知公告' },
  { value: 2, label: '资讯动态' }
]

export default {
  name: 'InfoManage',
  directives: {
    waves
  },
  components: {
    query
  },
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: 'success',
        draft: 'info',
        deleted: 'danger'
      }
      return statusMap[status]
    },
    filterType(t) {
      return typedata[t - 1].label
    }
  },
  data() {
    return {
      tableKey: 0,
      list: null,
      queryapi: {
        add: '/notice',
        edit: '/notice',
        fetch: '/notice',
        info: '/notice',
        delete: '/notice'
      },
      total: null,
      value4: '',
      typedata: typedata,
      listLoading: true,
      listQuery: {
        page: 1,
        type: 2
      },
      statusOptions: ['published', 'draft', 'deleted'],
      showReviewer: false,
      temp: {
        id: undefined,
        importance: 1,
        remark: '',
        timestamp: new Date(),
        title: '',
        type: '',
        status: 'published'
      },
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
      this.$refs.querycomponent.handleUpdate(id)
    },
    updateData() {
      this.$refs.querycomponent.updateData()
    },
    handleDelete(row) {
      this.$refs.querycomponent.handleDelete(row)
    },
    handleDownload() {
      this.$refs.querycomponent.handleDownload()
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>

</style>

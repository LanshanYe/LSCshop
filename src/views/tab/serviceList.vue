<template>
  <query ref="querycomponent" :list-query="listQuery" :dialog-width="'1000px'">
    <div slot="queryFilter">
      <el-button v-waves class="filter-item" size="small" type="primary" icon="el-icon-edit" @click="handleCreate">{{ $t('table.add') }}</el-button>
    </div>
    <el-table-column slot="tableColumn" :label="$t('table.serviceType')" align="center">
      <template slot-scope="scope">
        <span>{{ scope.row.id }}</span>
      </template>
    </el-table-column>
    <el-table-column slot="tableColumn" :label="$t('table.contentValidity')" align="center">
      <template slot-scope="scope">
        <span>{{ scope.row.timestamp | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
      </template>
    </el-table-column>
    <el-table-column slot="tableColumn" :label="$t('table.photo')">
      <template slot-scope="scope">
        <span class="link-type" @click="handleUpdate(scope.row)">{{ scope.row.title }}</span>
        <el-tag>{{ scope.row.type | typeFilter }}</el-tag>
      </template>
    </el-table-column>
    <el-table-column slot="tableColumn" :label="$t('table.actions')" align="center" width="230" class-name="small-padding fixed-width">
      <template slot-scope="scope">
        <el-button type="primary" size="mini" @click="handleUpdate(scope.row)">{{ $t('table.edit') }}</el-button>
        <el-button size="mini" type="danger" @click="handleModifyStatus(scope.row,'deleted')">{{ $t('table.delete') }}
        </el-button>
      </template>
    </el-table-column>
    <div slot="dataForms">
      <el-form-item :label="$t('table.serviceType')">
        <el-select v-model="temp.importance" :placeholder="$t('table.serviceType')" size="small" clearable>
          <el-option v-for="item in typedata" :key="item.value" :label="item.label" :value="item.value"/>
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('table.activetheme')" prop="title">
        <el-input v-model="temp.title" type="textarea" />
      </el-form-item>
      <el-form-item :label="$t('table.contentValidity')" prop="title">
        <el-upload
          :auto-upload="false"
          action="https://jsonplaceholder.typicode.com/posts/"
          list-type="picture-card">
          <i class="el-icon-plus"/>
        </el-upload>
      </el-form-item>
    </div>
  </query>
</template>

<script>
import query from '@/components/queryTable'
import waves from '@/directive/waves' // 水波纹指令

const calendarTypeOptions = [
  { key: 'CN', display_name: 'China' },
  { key: 'US', display_name: 'USA' },
  { key: 'JP', display_name: 'Japan' },
  { key: 'EU', display_name: 'Eurozone' }
]

// arr to obj ,such as { CN : "China", US : "USA" }
const calendarTypeKeyValue = calendarTypeOptions.reduce((acc, cur) => {
  acc[cur.key] = cur.display_name
  return acc
}, {})

export default {
  name: 'Tab',
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
    typeFilter(type) {
      return calendarTypeKeyValue[type]
    }
  },
  data() {
    return {
      tableKey: 0,
      list: null,
      total: null,
      value4: '',
      typedata: [
        { lable: '读者须知', value: 1 },
        { lable: '办证指南', value: 2 },
        { lable: '服务时间', value: 3 },
        { lable: '服务区布局', value: 4 },
        { lable: '借阅服务', value: 5 },
        { lable: '阅读推广服务', value: 6 },
        { lable: '你读书我买单服务', value: 7 },
        { lable: '移动平台服务', value: 8 }
      ],
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 10,
        importance: undefined,
        title: undefined,
        type: undefined,
        sort: '+id'
      },
      calendarTypeOptions,
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
    handleModifyStatus(row, status) {
      this.$refs.querycomponent.handleModifyStatus(row, status)
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
    handleUpdate(row) {
      this.$refs.querycomponent.handleUpdate(row)
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

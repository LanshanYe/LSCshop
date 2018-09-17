<template>
  <query ref="querycomponent" :list-query="listQuery">
    <div slot="queryFilter">
      <el-input :placeholder="$t('table.bookname')" v-model="listQuery.title" size="small" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter"/>
      <el-input :placeholder="$t('table.press')" v-model="listQuery.name" size="small" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter"/>
      <el-input :placeholder="$t('table.borrower')" v-model="listQuery.title2" size="small" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter"/>
      <el-input :placeholder="$t('table.phone')" v-model="listQuery.title3" size="small" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter"/>
      <el-select v-model="listQuery.importance" :placeholder="$t('table.settleState')" class="filter-item" size="small" clearable>
        <el-option v-for="item in settledata" :key="item.value" :label="item.label" :value="item.value"/>
      </el-select>
      <el-date-picker
        v-model="value4"
        class="filter-item"
        size="small"
        type="datetimerange"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"/>
      <el-button v-waves class="filter-item" size="small" type="primary" icon="el-icon-search" @click="handleFilter">{{ $t('table.search') }}</el-button>
    </div>
    <el-table-column slot="tableColumn" :label="$t('table.id')" type="index" align="center"/>
    <el-table-column slot="tableColumn" :label="$t('table.bookname')" align="center">
      <template slot-scope="scope">
        <span>{{ scope.row.timestamp | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
      </template>
    </el-table-column>
    <el-table-column slot="tableColumn" :label="$t('table.press')">
      <template slot-scope="scope">
        <span class="link-type" @click="handleUpdate(scope.row)">{{ scope.row.title }}</span>
        <el-tag>{{ scope.row.type | typeFilter }}</el-tag>
      </template>
    </el-table-column>
    <el-table-column slot="tableColumn" :label="$t('table.price')" align="center">
      <template slot-scope="scope">
        <span>{{ scope.row.author }}</span>
      </template>
    </el-table-column>
    <el-table-column slot="tableColumn" :label="$t('table.borrower')" align="center">
      <template slot-scope="scope">
        <span>{{ scope.row.author }}</span>
      </template>
    </el-table-column>
    <el-table-column slot="tableColumn" :label="$t('table.readCard')" align="center">
      <template slot-scope="scope">
        <el-button type="primary">{{ $t('table.registration') }}</el-button>
      </template>
    </el-table-column>
    <el-table-column slot="tableColumn" :label="$t('table.phone')" align="center">
      <template slot-scope="scope">
        <el-button type="primary">{{ $t('table.registration') }}</el-button>
      </template>
    </el-table-column>
    <el-table-column slot="tableColumn" :label="$t('table.borrowDate')" align="center">
      <template slot-scope="scope">
        <el-button type="primary">{{ $t('table.registration') }}</el-button>
      </template>
    </el-table-column>
    <el-table-column slot="tableColumn" :label="$t('table.settleState')" align="center">
      <template slot-scope="scope">
        <el-button type="primary">{{ $t('table.registration') }}</el-button>
      </template>
    </el-table-column>
    <el-table-column slot="tableColumn" :label="$t('table.actions')" align="center" width="230" class-name="small-padding fixed-width">
      <template slot-scope="scope">
        <el-button type="primary" size="mini" @click="handleUpdate(scope.row)">{{ $t('table.edit') }}</el-button>
        <el-button size="mini" type="danger" @click="handleModifyStatus(scope.row,'deleted')">{{ $t('table.delete') }}
        </el-button>
      </template>
    </el-table-column>
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
  name: 'Clipboard',
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
      settledata: [
        { label: '已结算', value: 1 },
        { label: '未结算', value: 2 }
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

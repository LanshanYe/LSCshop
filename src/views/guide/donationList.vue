<template>
  <query ref="querycomponent" :list-query="listQuery">
    <div slot="queryCount">
      <el-input readonly class="queryInput" size="large" value="132">
        <template slot="prepend">捐赠人数</template>
      </el-input>
      <el-input readonly class="queryInput" size="large" value="1232">
        <template slot="prepend">捐赠图书数量</template>
      </el-input>
      <el-input readonly class="queryInput" size="large" value="1312">
        <template slot="prepend">捐赠总价</template>
      </el-input>
    </div>
    <div slot="queryFilter">
      <el-input :placeholder="$t('table.name')" v-model="listQuery.title" size="small" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter"/>
      <el-input :placeholder="$t('table.phone')" v-model="listQuery.title" size="small" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter"/>
      <el-input :placeholder="$t('table.bookname')" v-model="listQuery.title" size="small" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter"/>
      <el-input :placeholder="$t('table.press')" v-model="listQuery.title" size="small" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter"/>
      <el-date-picker
        v-model="value4"
        class="filter-item"
        size="small"
        type="datetimerange"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"/>
      <el-button v-waves class="filter-item" size="small" type="primary" icon="el-icon-search" @click="handleFilter">{{ $t('table.search') }}</el-button>
      <el-button v-waves class="filter-item" size="small" type="primary" icon="el-icon-edit" @click="handleCreate">{{ $t('table.add') }}</el-button>
    </div>
    <el-table-column slot="tableColumn" :label="$t('table.name')" align="center">
      <template slot-scope="scope">
        <span>{{ scope.row.id }}</span>
      </template>
    </el-table-column>
    <el-table-column slot="tableColumn" :label="$t('table.phone')" align="center">
      <template slot-scope="scope">
        <span>{{ scope.row.timestamp | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
      </template>
    </el-table-column>
    <el-table-column slot="tableColumn" :label="$t('table.bookname')">
      <template slot-scope="scope">
        <span class="link-type" @click="handleUpdate(scope.row)">{{ scope.row.title }}</span>
        <el-tag>{{ scope.row.type | typeFilter }}</el-tag>
      </template>
    </el-table-column>
    <el-table-column slot="tableColumn" :label="$t('table.press')" align="center">
      <template slot-scope="scope">
        <span>{{ scope.row.author }}</span>
      </template>
    </el-table-column>
    <el-table-column slot="tableColumn" :label="$t('table.price')" prop="author" align="center"/>
    <el-table-column slot="tableColumn" :label="$t('table.number')" prop="author" align="center"/>
    <el-table-column slot="tableColumn" :label="$t('table.donationDate')" prop="author" align="center"/>
    <div slot="dataForms">
      <el-form-item :label="$t('table.name')" prop="timestamp">
        <el-input v-model="temp.title"/>
      </el-form-item>
      <el-form-item :label="$t('table.phone')" prop="title">
        <el-input v-model="temp.title"/>
      </el-form-item>
      <el-form-item :label="$t('table.bookname')" prop="title">
        <el-input v-model="temp.title"/>
      </el-form-item>
      <el-form-item :label="$t('table.press')" prop="title">
        <el-input v-model="temp.title"/>
      </el-form-item>
      <el-form-item :label="$t('table.price')" prop="title">
        <el-input v-model="temp.title"/>
      </el-form-item>
      <el-form-item :label="$t('table.number')" prop="title">
        <el-input v-model="temp.title"/>
      </el-form-item>
      <el-form-item :label="$t('table.donationDate')">
        <el-date-picker v-model="temp.timestamp" type="datetime"/>
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
  name: 'DonationList',
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

<template>
  <query ref="querycomponent" :list-query="listQuery" :api="api">
    <div slot="queryFilter">
      <el-input :placeholder="$t('table.name')" v-model="listQuery.NAME" size="small" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter"/>
      <el-input :placeholder="$t('table.bookname')" v-model="listQuery.TITLE" size="small" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter"/>
      <el-select v-model="listQuery.TYPENAME" :placeholder="$t('table.status')" size="small" clearable style="width: 90px" class="filter-item">
        <el-option v-for="item in statusdata" :key="item.value" :label="item.label" :value="item.label"/>
      </el-select>
      <el-date-picker
        v-model="listQuery.REGTIME"
        class="filter-item"
        size="small"
        type="date"
        placeholder="选择日期"
        value-format="yyyy-MM-dd"/>
      <el-button v-waves class="filter-item" size="small" type="primary" icon="el-icon-search" @click="handleFilter">{{ $t('table.search') }}</el-button>
    </div>
    <el-table-column slot="tableColumn" :label="$t('table.readCard')" prop="DATA2" align="center"/>
    <el-table-column slot="tableColumn" :label="$t('table.bookname')" prop="TITLE" align="center"/>
    <el-table-column slot="tableColumn" :label="$t('table.time')" prop="REGTIME" align="center"/>
    <el-table-column slot="tableColumn" :label="$t('table.status')" prop="TYPENAME" align="center"/>
    <el-table-column slot="tableColumn" :label="$t('table.actions')" align="center" width="230" class-name="small-padding fixed-width">
      <template slot-scope="scope">
        <el-button type="primary" size="mini" @click="handleUpdate(scope.row.DATA2)">{{ $t('table.edit') }}</el-button>
        <el-button size="mini" type="danger" @click="deleteData(scope.row.DATA2)">{{ $t('table.delete') }}
        </el-button>
      </template>
    </el-table-column>
  </query>
</template>

<script>
import query from '@/components/queryTable'
import waves from '@/directive/waves' // 水波纹指令

export default {
  name: 'Documentation',
  directives: {
    waves
  },
  components: {
    query
  },
  data() {
    return {
      tableKey: 0,
      list: null,
      total: null,
      imageUrl: '',
      api: {
        fetch: 'userborrow',
        info: 'userborrow'
      },
      statusdata: [
        { label: '预约', value: 1 },
        { label: '在借', value: 2 },
        { label: '续借', value: 3 },
        { label: '已还', value: 4 },
        { label: '逾期', value: 5 }
      ],
      value4: '',
      listLoading: true,
      listQuery: {
        page: 1,
        rdid: '123',
        rows: 10,
        rdidl: '',
        startDate: '',
        endDate: '',
        typename: ''
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
    deleteData(status) {
      this.$refs.querycomponent.deleteData(status)
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

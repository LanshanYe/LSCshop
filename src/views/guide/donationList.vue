<template>
  <div>
    <query ref="querycomponent" :list-query="listQuery" :api="api">
      <div slot="queryCount">
        <el-input :value="queryInputdata.people" readonly class="queryInput" size="large">
          <template slot="prepend">捐赠人数</template>
        </el-input>
        <el-input :value="queryInputdata.book" readonly class="queryInput" size="large">
          <template slot="prepend">捐赠图书数量</template>
        </el-input>
        <el-input :value="queryInputdata.money" readonly class="queryInput" size="large">
          <template slot="prepend">捐赠总价</template>
        </el-input>
      </div>
      <div slot="queryFilter">
        <el-input :placeholder="$t('table.name')" v-model="listQuery.real_name" size="small" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter"/>
        <el-input :placeholder="$t('table.phone')" v-model="listQuery.phone" size="small" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter"/>
        <el-input :placeholder="$t('table.bookname')" v-model="listQuery.book_name" size="small" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter"/>
        <el-input :placeholder="$t('table.press')" v-model="listQuery.book_press" size="small" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter"/>
        <el-date-picker
          v-model="value4"
          class="filter-item"
          size="small"
          type="datetimerange"
          range-separator="至"
          value-format="yyyy-MM-dd HH:mm:ss"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          @change="timechange"/>
        <el-button v-waves class="filter-item" size="small" type="primary" icon="el-icon-search" @click="handleFilter">{{ $t('table.search') }}</el-button>
        <el-button v-waves class="filter-item" size="small" type="primary" icon="el-icon-edit" @click="handleCreate">{{ $t('table.add') }}</el-button>
      </div>
      <el-table-column slot="tableColumn" :label="$t('table.name')" align="center" prop="real_name"/>
      <el-table-column slot="tableColumn" :label="$t('table.phone')" align="center" prop="phone"/>
      <el-table-column slot="tableColumn" :label="$t('table.bookname')" align="center" prop="book_name"/>
      <el-table-column slot="tableColumn" :label="$t('table.press')" align="center" prop="book_press"/>
      <el-table-column slot="tableColumn" :label="$t('table.price')" prop="book_price" align="center"/>
      <el-table-column slot="tableColumn" :label="$t('table.number')" prop="book_num" align="center"/>
      <el-table-column slot="tableColumn" :label="$t('table.donationDate')" prop="donate_time" align="center"/>
    </query>
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" width="80%" min-width="1200px">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="right" label-width="80px" style="width: 100%;">
        <el-form-item :label="$t('table.name')">
          <el-input v-model="temp.real_name"/>
        </el-form-item>
        <el-form-item :label="$t('table.phone')">
          <el-input v-model="temp.phone"/>
        </el-form-item>
        <el-form-item :label="$t('table.bookname')">
          <el-input v-model="temp.book_name"/>
        </el-form-item>
        <el-form-item :label="$t('table.press')">
          <el-input v-model="temp.book_press"/>
        </el-form-item>
        <el-form-item :label="$t('table.price')">
          <el-input v-model="temp.book_price"/>
        </el-form-item>
        <el-form-item :label="$t('table.number')">
          <el-input v-model="temp.book_num"/>
        </el-form-item>
        <el-form-item :label="$t('table.donationDate')">
          <el-date-picker v-model="temp.donate_time" value-format="yyyy-MM-dd" placeholder="选择日期" type="date"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">{{ $t('table.cancel') }}</el-button>
        <el-button v-if="dialogStatus=='create'" type="primary" @click="createData">{{ $t('table.confirm') }}</el-button>
        <el-button v-else type="primary" @click="updateData">{{ $t('table.confirm') }}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import query from '@/components/queryTable'
import waves from '@/directive/waves' // 水波纹指令

export default {
  name: 'DonationList',
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
      api: {
        fetch: '/donate/search',
        add: '/donate-book/add'
      },
      value4: '',
      listLoading: true,
      queryInputdata: {
        people: '',
        book: '',
        money: ''
      },
      listQuery: {
        page: 1
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
  mounted() {
    this.$refs.querycomponent.getList()
    this.$r.get('/donate_index').then(re => {
      console.log(re)
      this.queryInputdata = re.data.result
    }).catch(errs => console.log(errs))
  },
  methods: {
    handleModifyStatus(row, status) {
      this.$refs.querycomponent.handleModifyStatus(row, status)
    },
    handleFilter() {
      this.$refs.querycomponent.handleFilter()
    },
    resetTemp() {
      this.temp = {}
    },
    handleCreate() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    createData() {
      console.log(this.api.add, this.temp)
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.$r.post(this.api.add, this.temp).then((re) => {
            console.log(re)
            if (re.data.status === 'success') {
              this.dialogFormVisible = false
              this.$refs.querycomponent.getList()
              this.$notify({
                title: '成功',
                message: '创建成功',
                type: 'success',
                duration: 2000
              })
            } else {
              this.$notify.error({
                title: '失败',
                message: '创建失败',
                duration: 2000
              })
            }
          }).catch(errs => { console.log(errs) })
        }
      })
    },
    handleUpdate(row) {
      this.$refs.querycomponent.handleUpdate(row)
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.temp)
          this.$r.post(this.api.edit, tempData).then((re) => {
            console.log(re)
            this.dialogFormVisible = false
            this.$notify({
              title: '成功',
              message: '更新成功',
              type: 'success',
              duration: 2000
            })
          }).catch(errs => { console.log(errs) })
        }
      })
    },
    handleDelete(row) {
      this.$refs.querycomponent.handleDelete(row)
    },
    handleDownload() {
      this.$refs.querycomponent.handleDownload()
    },
    timechange(d) {
      if (d) {
        this.listQuery.start = d[0]
        this.listQuery.end = d[1]
      } else {
        this.listQuery.start = ''
        this.listQuery.end = ''
      }
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>

</style>

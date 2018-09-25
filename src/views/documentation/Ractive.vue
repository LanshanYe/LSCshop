<template>
  <div v-loading="listLoading">
    <div v-show="!dialogFormVisible">
      <query ref="querycomponent" key="query1" :list-query="listQuery" :api="api">
        <div slot="queryFilter">
          <el-input :placeholder="$t('table.theme')" v-model="listQuery.title" size="small" style="width: 200px;" class="filter-item" clearable @keyup.enter.native="handleFilter"/>
          <el-input :placeholder="$t('table.address')" v-model="listQuery.activity_place" size="small" style="width: 200px;" class="filter-item" clearable @keyup.enter.native="handleFilter"/>
          <el-input :placeholder="$t('table.hostUnit')" v-model="listQuery.host_unit" size="small" style="width: 200px;" class="filter-item" clearable @keyup.enter.native="handleFilter"/>
          <el-date-picker
            v-model="listQuery.start_time"
            class="filter-item"
            size="small"
            value-format="yyyy-MM-dd HH:mm:ss"
            type="datetime"
            placeholder="选择日期时间"/>
          <el-select v-model="listQuery.type" size="small" clearable class="filter-item">
            <el-option :label="$t('table.activity')" value="1"/>
            <el-option :label="$t('table.speaking')" value="2"/>
          </el-select>
          <el-button v-waves class="filter-item" size="small" type="primary" icon="el-icon-search" @click="handleFilter">{{ $t('table.search') }}</el-button>
          <el-button v-waves class="filter-item" size="small" type="primary" icon="el-icon-edit" @click="handleCreate">{{ $t('table.add') }}</el-button>
        </div>
        <el-table-column slot="tableColumn" :label="$t('table.activetheme')" align="center" prop="title"/>
        <el-table-column slot="tableColumn" :label="$t('table.type')" align="center" prop="type">
          <template slot-scope="scope">
            <span>{{ scope.row.type === 1 ? '活动' : '讲座' }}</span>
          </template>
        </el-table-column>
        <el-table-column slot="tableColumn" :label="$t('table.contentValidity')" align="center" prop="description"/>
        <el-table-column slot="tableColumn" :label="$t('table.hostUnit')" align="center" prop="host_unit"/>
        <el-table-column slot="tableColumn" :label="$t('table.time')" align="center" prop="start_time"/>
        <el-table-column slot="tableColumn" :label="$t('table.address')" align="center" prop="activity_place"/>
        <el-table-column slot="tableColumn" :label="$t('table.registNum')" align="center" prop="sign_num"/>
        <el-table-column slot="tableColumn" :label="$t('table.registration')" align="center" prop="sign_num">
          <template slot-scope="scope">
            <el-button type="primary" size="mini" @click="showSign(scope.row.activity_id)">查看报名情况</el-button>
          </template>
        </el-table-column>
        <el-table-column slot="tableColumn" :label="$t('table.actions')" align="center" width="230" class-name="small-padding fixed-width">
          <template slot-scope="scope">
            <el-button type="primary" size="mini" @click="handleUpdate(scope.row.activity_id)">{{ $t('table.edit') }}</el-button>
            <el-button size="mini" type="danger" @click="handleModifyStatus(scope.row.activity_id)">{{ $t('table.delete') }}
            </el-button>
          </template>
        </el-table-column>
      </query>
    </div>
    <div v-show="dialogFormVisible" class="app-container">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="right" label-width="80px" style="width: 100%;">
        <el-form-item :label="$t('table.activetheme')">
          <el-input v-model="temp.title"/>
        </el-form-item>
        <el-form-item :label="$t('table.type')">
          <el-radio-group v-model="temp.type">
            <el-radio :label="1">{{ $t('table.activity') }}</el-radio>
            <el-radio :label="2">{{ $t('table.speaking') }}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item :label="$t('table.photo')">
          <uploadimg :imglist="imgList" @getimg="getImgurl"/>
        </el-form-item>
        <el-form-item :label="$t('table.phone')">
          <el-input v-model="temp.link_phone"/>
        </el-form-item>
        <el-form-item :label="$t('table.peopleCount')">
          <el-input v-model="temp.limit_num"/>
        </el-form-item>
        <el-form-item :label="$t('table.contentValidity')">
          <el-input v-model="temp.description"/>
        </el-form-item>
        <el-form-item :label="$t('table.hostUnit')">
          <el-input v-model="temp.host_unit"/>
        </el-form-item>
        <el-form-item :label="$t('table.activityer')">
          <el-input v-model="temp.object_oriented"/>
        </el-form-item>
        <el-form-item :label="$t('table.address')">
          <el-input v-model="temp.activity_place"/>
        </el-form-item>
        <el-form-item :label="$t('table.time')">
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
        </el-form-item>
        <el-form-item :label="$t('table.activeinner')">
          <tinymce ref="tiny" :height="400" v-model="temp.body"/>
        </el-form-item>
      </el-form>
      <div class="filter-container">
        <el-button @click="dialogFormVisible = false">{{ $t('table.cancel') }}</el-button>
        <el-button v-if="dialogStatus=='create'" type="primary" @click="createData">{{ $t('table.confirm') }}</el-button>
        <el-button v-else type="primary" @click="updateData">{{ $t('table.confirm') }}</el-button>
      </div>
    </div>
    <el-dialog
      ref="dialogs"
      :visible.sync="signs"
      title="提示"
      width="60%">
      <query ref="qwe" key="query2" :list-query="listQuery2" :api="api2">
        <el-table-column slot="tableColumn" :label="$t('table.name')" align="center" prop="name"/>
        <el-table-column slot="tableColumn" :label="$t('table.phone')" align="center" prop="phone"/>
        <el-table-column slot="tableColumn" :label="$t('table.qq')" align="center" prop="qq"/>
        <el-table-column slot="tableColumn" :label="$t('table.remarks')" align="center" prop="remark"/>
        <el-table-column slot="tableColumn" :label="$t('table.signtime')" align="center" prop="created_at"/>
        <el-table-column slot="tableColumn" :label="$t('table.registtype')" align="center" prop="sign_status">
          <template slot-scope="scope">
            <span>{{ scope.row.sign_status===1?'已报名':'已取消' }}</span>
          </template>
        </el-table-column>
        <el-table-column slot="tableColumn" :label="$t('table.jointype')" align="center" prop="join_status">
          <template slot-scope="scope">
            <span>{{ scope.row.join_status===1?'已参与':'待参与' }}</span>
          </template>
        </el-table-column>
      </query>
      <span slot="footer" class="dialog-footer">
        <el-button @click="signs = false">关 闭</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import query from '@/components/queryTable'
import Tinymce from '@/components/Tinymce'
import uploadimg from '@/components/Upload/uploadImg'
import waves from '@/directive/waves' // 水波纹指令

export default {
  name: 'Ractive',
  directives: {
    waves
  },
  components: {
    query,
    Tinymce,
    uploadimg
  },
  data() {
    return {
      tableKey: 0,
      list: null,
      total: null,
      value4: [],
      imgList: [],
      imageUrl: '',
      listLoading: false,
      api: {
        add: '/activity',
        fetch: '/activity',
        info: '/activity',
        edit: '/activity',
        delete: '/activity'
      },
      api2: {
        fetch: ''
      },
      listQuery: {},
      listQuery2: {},
      statusOptions: ['published', 'draft', 'deleted'],
      showReviewer: false,
      temp: {
        type: 1
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '修改',
        create: '新增'
      },
      signdata: {},
      signs: false,
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
  },
  methods: {
    handleModifyStatus(row) {
      this.$refs.querycomponent.deleteData(row)
    },
    handleFilter() {
      this.$refs.querycomponent.handleFilter()
    },
    resetTemp() {
      this.temp = {
        type: 1
      }
    },
    handleCreate() {
      this.resetTemp()
      this.$refs.tiny.setContent('')
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
          var formData = new FormData()
          for (var j in this.temp) {
            formData.append(j, this.temp[j])
          }
          const config = {
            headers: { 'Content-Type': 'multipart/form-data' }
          }
          this.$r.post(this.api.add, formData, config).then((re) => {
            if (re.data.status === 'success') {
              this.$refs.querycomponent.getList(1)
              this.dialogFormVisible = false
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
      this.listLoading = true
      this.dialogStatus = 'update'
      this.$r.get(this.api.info + '/' + row).then(re => {
        console.log(re)
        if (re.data.status === 'success') {
          this.dialogFormVisible = true
          this.temp = re.data.result
          this.$refs.tiny.setContent(re.data.result.body)
          this.value4[0] = re.data.result.start_time || ''
          this.value4[1] = re.data.result.end_time || ''
          this.value4 = this.value4.concat()
        } else {
          this.$notify.error({
            title: '失败',
            message: '获取失败',
            duration: 2000
          })
        }
        this.listLoading = false
      }).catch(errs => {
        this.listLoading = false
        console.log(errs)
      })
    },
    showSign(id) {
      this.api2.fetch = '/activity/' + id + '/people'
      this.signs = true
      this.$nextTick(() => {
        this.$refs.qwe.handleFilter()
      })
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.listLoading = true
          const tempData = Object.assign({}, this.temp)
          var formData = new FormData()
          for (var j in tempData) {
            formData.append(j, tempData[j])
          }
          const config = {
            headers: { 'Content-Type': 'multipart/form-data' }
          }
          this.$r.post(this.api.add, formData, config).then((re) => {
            if (re.data.status === 'success') {
              this.$refs.querycomponent.getList()
              console.log(re)
              this.dialogFormVisible = false
              this.$notify({
                title: '成功',
                message: '更新成功',
                type: 'success',
                duration: 2000
              })
            } else {
              this.$notify.error({
                title: '失败',
                message: '修改失败',
                duration: 2000
              })
            }
            this.listLoading = false
          }).catch(errs => {
            this.listLoading = false
            console.log(errs)
          })
        }
      })
    },
    getImgurl(d) {
      this.temp.image = d
    },
    timechange(d) {
      console.log(d)
      if (d) {
        this.temp.start_time = d[0]
        this.temp.end_time = d[1]
      } else {
        this.temp.start_time = ''
        this.temp.end_time = ''
      }
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>

</style>

<template>
  <div>
    <div v-show="!dialogFormVisible">
      <query ref="querycomponent" :list-query="listQuery" :api="api">
        <div slot="queryFilter">
          <el-button v-waves class="filter-item" size="small" type="primary" icon="el-icon-search" @click="handleFilter">{{ $t('table.search') }}</el-button>
        </div>
        <el-table-column slot="tableColumn" label="买家ID" prop="buyer_id" align="center"/>
        <el-table-column slot="tableColumn" label="买家名称" prop="buyer_name" align="center"/>
        <el-table-column slot="tableColumn" label="店铺ID" prop="shop_id" align="center"/>
        <el-table-column slot="tableColumn" label="店铺名称" prop="shop_name" align="center"/>
        <el-table-column slot="tableColumn" label="收货地址ID" prop="address_id" align="center"/>
        <el-table-column slot="tableColumn" label="支付的金额" prop="pay_money" align="center"/>
        <el-table-column slot="tableColumn" label="总金额" prop="total_price" align="center"/>
        <el-table-column slot="tableColumn" label="订单状态" prop="order_status" align="center">
          <template slot-scope="scope">
            <span>{{ statusdata[scope.row.order_status] }}</span>
          </template>
        </el-table-column>
        <el-table-column slot="tableColumn" label="操作" align="center" width="200" class-name="small-padding fixed-width">
          <template slot-scope="scope">
            <el-button type="success" size="mini" @click="handleSend(scope.row)">发货</el-button>
            <el-button type="primary" size="mini" @click="handleUpdate(scope.row.order_id)">详情</el-button>
            <!--<el-button size="mini" type="danger" @click="deleteData(scope.row.demand_id)">{{ $t('table.delete') }}</el-button>-->
          </template>
        </el-table-column>
      </query>
    </div>
    <el-dialog
      :visible.sync="dialogVisible"
      :title="dialogtitle"
      @close="Closed">
      <el-form ref="dataForm2" :rules="rules2" :model="temp2" label-position="right" label-width="120px" style="width: 100%;">
        <el-form-item label="物流公司" prop="logistics_company">
          <el-input v-model="temp2.logistics_company" type="text"/>
        </el-form-item>
        <el-form-item label="物流编号" prop="logistics_num">
          <el-input v-model="temp2.logistics_num" type="text"/>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button :loading="addloading" type="primary" @click="createData">确 定</el-button>
      </span>
    </el-dialog>
    <div v-show="dialogFormVisible" class="app-container">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="right" label-width="120px" style="width: 100%;">
        <el-row :gutter="40">
          <el-col :xs="24" :sm="12" :lg="8">
            <el-form-item :label="$t('table.nickname')">
              <el-input v-model="temp.nickname" type="text"/>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :lg="8">
            <el-form-item :label="$t('table.realname')">
              <el-input v-model="temp.real_name" type="text"/>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :lg="8">
            <el-form-item :label="$t('table.phone')">
              <el-input v-model="temp.phone" type="text"/>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div class="filter-container">
        <el-button @click="dialogFormVisible = false">返回</el-button>
        <!--<el-button v-if="dialogStatus==='create'" :loading="addloading" type="primary" @click="createData">{{ $t('table.confirm') }}</el-button>-->
        <!--<el-button v-else :loading="editloading" type="primary" @click="updateData">{{ $t('table.confirm') }}</el-button>-->
      </div>
    </div>
  </div>
</template>

<script>
import query from '@/components/queryTable'
import upimg from '@/components/Upload/uploadImg'
import { getToken } from '@/utils/auth'
import waves from '@/directive/waves' // 水波纹指令

export default {
  name: 'Order',
  directives: {
    waves
  },
  components: {
    query,
    upimg
  },
  data() {
    return {
      tableKey: 0,
      list: null,
      addloading: false,
      editloading: false,
      usertoken: {
        Authorization: 'Bearer ' + getToken()
      },
      api: {
        add: '/order',
        edit: '/order',
        fetch: '/order',
        info: '/order',
        delete: '/order'
      },
      total: null,
      value4: '',
      dialogtitle: '发货',
      listLoading: true,
      dialogVisible: false,
      statusdata: ['', '待支付', '待发货', '待收货', '已收货', '已完成', '已退款'],
      imglist: [],
      branddata: [],
      seriesdata: [],
      listQuery: {},
      statusOptions: ['published', 'draft', 'deleted'],
      showReviewer: false,
      temp: {
        avatar: ''
      },
      temp2: {},
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '修改',
        create: '新增'
      },
      dialogPvVisible: false,
      configdata: [],
      rules: {
        nickname: [{ required: true, message: '此项为必填项', trigger: 'blur' }]
      },
      rules2: {
        nickname: [{ required: true, message: '此项为必填项', trigger: 'blur' }]
      },
      downloadLoading: false
    }
  },
  mounted() {
    this.$refs.querycomponent.getList()
  },
  methods: {
    deleteData(id) {
      this.$confirm('您确定删除所选项?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$r.delete(this.api.delete + '/' + id).then((re) => {
          if (re.data.status === 'success') {
            this.$refs.querycomponent.getList()
            this.$notify({
              title: '成功',
              message: '删除成功',
              type: 'success',
              duration: 2000
            })
          } else {
            this.$notify.error({
              title: '失败',
              message: '删除失败'
            })
          }
        }).catch(errs => console.log(errs))
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    handleFilter() {
      this.$refs.querycomponent.handleFilter()
    },
    resetTemp() {
      this.temp2 = {}
    },
    handleSend() {
      this.resetTemp()
      this.dialogVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm2'].clearValidate()
      })
    },
    createData() {
      this.$refs['dataForm2'].validate((valid) => {
        if (valid) {
          this.addloading = true
          this.$r.post('/send-goods', this.temp2).then((re) => {
            if (re.data.status === 'success') {
              this.$refs.querycomponent.getList()
              this.dialogVisible = false
              this.$notify({
                title: '成功',
                message: '创建成功',
                type: 'success'
              })
            } else {
              this.$notify.error({
                title: '失败',
                message: re.data.msg
              })
            }
            this.addloading = false
          }).catch(errs => {
            this.addloading = false
            console.log(errs)
          })
        }
      })
    },
    handleUpdate(row) {
      this.$r.get(this.api.info + '/' + row).then(re => {
        if (re.data.status === 'success') {
          this.dialogStatus = 'update'
          this.temp = re.data.result
          this.dialogFormVisible = true
          this.$nextTick(() => {
            this.$refs['dataForm'].clearValidate()
          })
        } else {
          this.$notify.error({
            title: '失败',
            message: re.data.msg
          })
        }
      }).catch(errs => console.log(errs))
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.editloading = true
          var tempData = Object.assign({}, this.temp)
          this.$r.put(this.api.edit + '/' + tempData.id, tempData).then((re) => {
            if (re.data.status === 'success') {
              this.dialogFormVisible = false
              this.$refs.querycomponent.getList()
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
            this.editloading = false
          }).catch(errs => {
            this.editloading = false
            console.log(errs)
          })
        }
      })
    },
    typechange(d) {
      this.$refs.querycomponent.getList(1)
    },
    handleDelete(row) {
      this.$refs.querycomponent.handleDelete(row)
    },
    handleDownload() {
      this.$refs.querycomponent.handleDownload()
    },
    handleAvatarSuccess(res, file) {
      console.log(res)
      if (res.status === 'success') {
        this.temp.avatar = res.msg
      }
      this.editloading = false
      this.addloading = false
    },
    handleAvatarError() {
      this.editloading = false
      this.addloading = false
    },
    handleAvatarbeforeupload() {
      this.editloading = true
      this.addloading = true
    },
    Closed() {
      console.log('close')
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
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
</style>

<template>
  <div>
    <div v-show="!dialogFormVisible">
      <query ref="querycomponent" :list-query="listQuery" :api="api">
        <div slot="queryFilter">
          <el-radio-group v-model="listQuery.type" class="filter-item" size="small" @change="typechange">
            <el-radio-button :label="1">普通商品</el-radio-button>
            <el-radio-button :label="2">积分商品</el-radio-button>
          </el-radio-group>
          <el-button v-waves class="filter-item" size="small" type="primary" icon="el-icon-edit" @click="handleCreate">{{ $t('table.add') }}</el-button>
          <span v-show="listQuery.pid !== 0" style="font-size: 16px; margin-right: 10px">父级分类名称：{{ catetitle }}</span>
          <el-button v-waves v-show="listQuery.pid !== 0" class="filter-item" size="small" type="primary" icon="el-icon-arrow-left" @click="handleReturn">返回</el-button>
        </div>
        <el-table-column slot="tableColumn" label="分类名称" prop="name" align="center"/>
        <el-table-column slot="tableColumn" :label="$t('table.sort')" prop="sort" align="center"/>
        <template v-if="listQuery.pid===0">
          <el-table-column slot="tableColumn" label="查看" align="center">
            <template slot-scope="scope">
              <el-button type="success" size="mini" @click="showList(scope.row.id, scope.row.name)">查看子分类</el-button>
            </template>
          </el-table-column>
        </template>
        <el-table-column slot="tableColumn" :label="$t('table.actions')" align="center" width="230" class-name="small-padding fixed-width">
          <template slot-scope="scope">
            <el-button type="primary" size="mini" @click="handleUpdate(scope.row.id)">{{ $t('table.edit') }}</el-button>
            <el-button size="mini" type="danger" @click="deleteData(scope.row.id)">{{ $t('table.delete') }}
            </el-button>
          </template>
        </el-table-column>
      </query>
    </div>
    <el-dialog
      :visible.sync="dialogVisible"
      :title="dialogTitle"
      @close="Closedialog">
      <span>这是一段信息</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
    <div v-show="dialogFormVisible" class="app-container">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="right" label-width="120px" style="width: 100%;">
        <el-row :gutter="40">
          <el-col :xs="24" :sm="12" :lg="8">
            <el-form-item label="分类类型">
              <el-radio-group v-model="temp.purchase_type">
                <el-radio-button label="1">普通商品</el-radio-button>
                <el-radio-button label="2">积分商品</el-radio-button>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :lg="8">
            <el-form-item label="分类名称">
              <el-input v-model="temp.name" type="text"/>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :lg="8">
            <el-form-item label="分类排序" prop="body">
              <el-input v-model="temp.sort" type="text"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="40">
          <el-col :xs="24" :sm="12" :lg="8">
            <el-form-item label="上传图片">
              <uploadimg :imgsrc="temp.icon" url="/uploadImages/cate_icon" @upSuccess="handleAvatarSuccess" @upError="handleAvatarError" @upBefore="handleAvatarbeforeupload"/>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div class="filter-container">
        <el-button @click="dialogFormVisible = false">{{ $t('table.cancel') }}</el-button>
        <el-button v-if="dialogStatus==='create'" :loading="addloading" type="primary" @click="createData">{{ $t('table.confirm') }}</el-button>
        <el-button v-else :loading="editloading" type="primary" @click="updateData">{{ $t('table.confirm') }}</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import query from '@/components/queryTable'
import { getToken } from '@/utils/auth'
import uploadimg from '@/components/Upload/uploadImg'
import waves from '@/directive/waves' // 水波纹指令

export default {
  name: 'GoodsCategory',
  directives: {
    waves
  },
  components: {
    query,
    uploadimg
  },
  data() {
    return {
      tableKey: 0,
      qiniuUploadUrl: 'http://lianshangche.ydxxtech.com/admin/uploadImages',
      list: null,
      checkList: [],
      addloading: false,
      editloading: false,
      api: {
        add: '/category',
        edit: '/category',
        fetch: '/category',
        info: '/category',
        delete: '/category'
      },
      usertoken: {
        Authorization: 'Bearer ' + getToken()
      },
      total: null,
      value4: '',
      catetitle: '',
      imageUrl: '',
      dialogTitle: '',
      listLoading: true,
      dialogVisible: false,
      imglist: [],
      imglist2: [],
      branddata: [],
      seriesdata: [],
      nowPid: 0,
      listQuery: {
        type: 1,
        pid: 0
      },
      statusOptions: ['published', 'draft', 'deleted'],
      showReviewer: false,
      temp: {
        purchase_type: '1'
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '修改',
        create: '新增'
      },
      dialogPvVisible: false,
      configdata: [],
      rules: {
        title: [{ required: true, message: '此项为必填项', trigger: 'blur' }],
        description: [{ required: true, message: '此项为必填项', trigger: 'blur' }]
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
      this.temp = {
        purchase_type: '1'
      }
    },
    handleCreate() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.imglist = []
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.addloading = true
          this.temp.pid = this.nowPid
          this.$r.post(this.api.add, this.temp).then((re) => {
            if (re.data.status === 'success') {
              this.$refs.querycomponent.getList()
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
                message: re.data.msg,
                duration: 2000
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
      this.imglist = []
      this.$r.get(this.api.info + '/' + row).then(re => {
        if (re.data.status === 'success') {
          this.dialogStatus = 'update'
          this.temp = re.data.result
          this.dialogFormVisible = true
          if (re.data.result.images) {
            re.data.result.images.map(it => {
              this.imglist.push({ name: re.data.result.title, url: it })
            })
          }
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
                message: re.data.msg,
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
    handleReturn() {
      this.listQuery.pid = 0
      this.catetitle = ''
      this.nowPid = 0
      this.$refs.querycomponent.handleFilter()
    },
    showList(id, name) {
      this.listQuery.pid = id
      this.nowPid = id
      this.catetitle = name
      this.$refs.querycomponent.handleFilter()
      // this.$r.get(this.api.info + '?type=' + this.listQuery.type + '&pid=' + id).then(re => {
      //   console.log(re)
      //   if (re.data.result.data.length === 0) {
      //     this.$message({ type: 'warning', message: '此分类下没有子类' })
      //   } else {
      //     this.dialogVisible = true
      //   }
      // }).catch(errs => {
      //   console.log(errs)
      // })
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
        this.temp.icon = res.msg
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
    Closedialog() {
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

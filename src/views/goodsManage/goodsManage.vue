<template>
  <div>
    <div v-show="!dialogFormVisible">
      <query ref="querycomponent" :list-query="listQuery" :api="api">
        <div slot="queryFilter">
          <el-button v-waves class="filter-item" size="small" type="primary" icon="el-icon-edit" @click="handleCreate">{{ $t('table.add') }}</el-button>
        </div>
        <el-table-column slot="tableColumn" :label="$t('table.photo')" width="150" prop="car_name" align="center">
          <template slot-scope="scope">
            <img :src="scope.row.cover || ''" style="width: 100%;" >
          </template>
        </el-table-column>
        <el-table-column slot="tableColumn" :label="$t('table.goodsname')" prop="title" align="center"/>
        <el-table-column slot="tableColumn" :label="$t('table.simpledescription')" prop="description" align="center"/>
        <el-table-column slot="tableColumn" :label="$t('table.description')" prop="body" align="center"/>
        <el-table-column slot="tableColumn" :label="$t('table.price')" prop="price" align="center"/>
        <el-table-column slot="tableColumn" :label="$t('table.stock_num')" prop="stock_num" align="center"/>
        <el-table-column slot="tableColumn" :label="$t('table.actions')" align="center" width="230" class-name="small-padding fixed-width">
          <template slot-scope="scope">
            <el-button type="primary" size="mini" @click="handleUpdate(scope.row.base_id)">{{ $t('table.edit') }}</el-button>
            <el-button size="mini" type="danger" @click="deleteData(scope.row.base_id)">{{ $t('table.delete') }}
            </el-button>
          </template>
        </el-table-column>
      </query>
    </div>
    <div v-show="dialogFormVisible" class="app-container">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="right" label-width="120px" style="width: 100%;">
        <el-row :gutter="40">
          <el-col :xs="24" :sm="12" :lg="8">
            <el-form-item :label="$t('table.goodsname')" prop="title">
              <el-input v-model="temp.title" type="text"/>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :lg="8">
            <el-form-item :label="$t('table.simpledescription')" prop="description">
              <el-input v-model="temp.description" type="text"/>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :lg="8">
            <el-form-item :label="$t('table.description')" prop="body">
              <el-input v-model="temp.body" type="text"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="40">
          <el-col :xs="24" :sm="12" :lg="8">
            <el-form-item label="商品分类" prop="category_id">
              <el-input v-model="temp.category_id" clearable type="text"/>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :lg="8">
            <el-form-item label="店铺分类" prop="shop_cate">
              <el-input v-model="temp.shop_cate" clearable type="text"/>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :lg="8">
            <el-form-item label="积分" prop="t_integral">
              <el-input v-model="temp.t_integral" clearable type="text"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="40">
          <el-col :xs="24" :sm="12" :lg="8">
            <el-form-item label="是否推荐" prop="is_recommend">
              <el-radio v-model="temp.is_recommend" :label="0" border>推荐</el-radio>
              <el-radio v-model="temp.is_recommend" :label="1" border>不推荐</el-radio>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :lg="8">
            <el-form-item label="排序" prop="sort">
              <el-input v-model="temp.sort" clearable type="text"/>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :lg="8">
            <el-form-item label="价格" prop="price">
              <el-input v-model="temp.price" clearable type="text"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="40">
          <el-col :xs="24" :sm="12" :lg="8">
            <el-form-item label="上下架" prop="is_on_sale">
              <el-radio v-model="temp.is_on_sale" :label="1" border>上架</el-radio>
              <el-radio v-model="temp.is_on_sale" :label="0" border>下架</el-radio>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :lg="8">
            <el-form-item label="库存" prop="stock_num">
              <el-input v-model="temp.stock_num" clearable type="text"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="封面图" prop="cover">
          <el-upload
            :show-file-list="false"
            :headers="usertoken"
            :on-success="handleAvatarSuccess"
            :before-upload="handleAvatarbeforeupload"
            :on-error="handleAvatarError"
            :action="qiniuUploadUrl"
            name="image"
            class="avatar-uploader">
            <img v-if="temp.cover" :src="temp.cover.indexOf('http://phi8e7fdq.bkt.clouddn.com/') >= 0?temp.cover:'http://phi8e7fdq.bkt.clouddn.com/' + temp.cover" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"/>
          </el-upload>
        </el-form-item>
        <el-form-item label="轮播图">
          <el-upload
            :headers="usertoken"
            :on-success="handleAvatarSuccess3"
            :before-upload="handleAvatarbeforeupload"
            :on-error="handleAvatarError"
            :on-remove="handleRemove"
            :limit="5"
            :file-list="imglist"
            accept="image"
            action="http://lianshangche.ydxxtech.com/admin/uploadImages"
            list-type="picture-card"
            name="image">
            <i class="el-icon-plus"/>
          </el-upload>
        </el-form-item>
        <!--<el-form-item :label="$t('table.photo')">-->
        <!--<uploadimg ref="imgs" :imglist="imglist"/>-->
        <!--</el-form-item>-->
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
  name: 'GoodsManage',
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
      addloading: false,
      editloading: false,
      api: {
        add: '/goods',
        edit: '/goods',
        fetch: '/goods',
        info: '/goods',
        delete: '/goods'
      },
      usertoken: {
        Authorization: 'Bearer ' + getToken()
      },
      total: null,
      value4: '',
      imageUrl: '',
      listLoading: true,
      imglist: [],
      imglist2: [],
      branddata: [],
      seriesdata: [],
      listQuery: {},
      statusOptions: ['published', 'draft', 'deleted'],
      showReviewer: false,
      temp: {
        cover: '',
        is_recommend: 0,
        is_on_sale: 1
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
        description: [{ required: true, message: '此项为必填项', trigger: 'blur' }],
        body: [{ required: true, message: '此项为必填项', trigger: 'blur' }],
        category_id: [{ required: true, message: '此项为必填项', trigger: 'blur' }],
        shop_cate: [{ required: true, message: '此项为必填项', trigger: 'blur' }],
        t_integral: [{ required: true, message: '此项为必填项', trigger: 'blur' }],
        is_recommend: [{ required: true, message: '此项为必填项', trigger: 'change' }],
        sort: [{ required: true, message: '此项为必填项', trigger: 'blur' }],
        cover: [{ required: true, message: '此项为必填项', trigger: 'blur' }],
        image: [{ required: true, message: '此项为必填项', trigger: 'blur' }],
        is_on_sale: [{ required: true, message: '此项为必填项', trigger: 'blur' }],
        stock_num: [{ required: true, message: '此项为必填项', trigger: 'blur' }],
        price: [{ required: true, message: '此项为必填项', trigger: 'blur' }]
      },
      downloadLoading: false
    }
  },
  mounted() {
    this.$refs.querycomponent.getList()
    this.$r.get('/car_brand').then(re => {
      console.log(re)
      this.branddata = re.data.result
    })
  },
  methods: {
    brandchange(e) {
      this.temp.series_id = ''
      this.$r.get('/car_series?brand_id=' + e).then(re => {
        console.log(re)
        this.seriesdata = re.data.result
      })
    },
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
        cover: '',
        is_recommend: 0,
        is_on_sale: 1
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
                message: '创建失败',
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
            re.data.result.images.split(';').map(it => {
              this.imglist.push({ name: re.data.result.title, url: it })
            })
          }
          console.log(this.imglist)
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
          this.$r.put(this.api.edit + '/' + tempData.base_id, tempData).then((re) => {
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
    handleRemove(file, filelist) {
      console.log(filelist)
      var imgs = []
      filelist.map(it => {
        if (it.response) {
          if (it.response.status === 'success') {
            imgs.push(it.response.msg)
          }
        } else {
          if (it.status === 'success') {
            imgs.push(it.url)
          }
        }
      })
      this.temp.images = imgs.join(';')
    },
    handleAvatarSuccess3(res, file, filelist) {
      console.log(res)
      var imgs = []
      filelist.map(it => {
        if (it.response.status === 'success') {
          imgs.push(it.response.msg)
        }
      })
      this.temp.images = imgs.join(';')
      this.editloading = false
      this.addloading = false
    },
    handleAvatarSuccess(res, file) {
      console.log(res)
      if (res.status === 'success') {
        this.temp.cover = res.msg
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

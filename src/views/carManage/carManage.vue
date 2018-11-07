<template>
  <div>
    <div v-show="!dialogFormVisible">
      <query ref="querycomponent" :list-query="listQuery" :api="api">
        <div slot="queryFilter">
          <el-button v-waves class="filter-item" size="small" type="primary" icon="el-icon-search" @click="handleFilter">{{ $t('table.search') }}</el-button>
          <el-button v-waves class="filter-item" size="small" type="primary" icon="el-icon-edit" @click="handleCreate">{{ $t('table.add') }}</el-button>
        </div>
        <el-table-column slot="tableColumn" :label="$t('table.photo')" width="200" prop="car_name" align="center">
          <template slot-scope="scope">
            <img :src="scope.row.cover || ''" style="width: 100%;" >
          </template>
        </el-table-column>
        <el-table-column slot="tableColumn" :label="$t('table.title')" prop="title" align="center"/>
        <el-table-column slot="tableColumn" :label="$t('table.guidance_price')" prop="guide_price" align="center"/>
        <el-table-column slot="tableColumn" :label="$t('table.releaseDate')" prop="created_at" align="center"/>
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
            <el-form-item label="标题" prop="title">
              <el-input v-model="temp.title" clearable/>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :lg="8">
            <el-form-item label="车型" prop="model_id">
              <el-select v-model="temp.model_id" clearable class="width100">
                <el-option v-for="item in configdata.model" :key="item.id" :label="item.name" :value="item.id"/>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :lg="8">
            <el-form-item label="座位数" prop="pedestal">
              <el-select v-model="temp.pedestal" clearable class="width100">
                <el-option :value="2" label="2"/>
                <el-option :value="4" label="4"/>
                <el-option :value="5" label="5"/>
                <el-option :value="7" label="7"/>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="40">
          <el-col :xs="24" :sm="12" :lg="8">
            <el-form-item label="品牌" prop="brand_id">
              <el-select v-model="temp.brand_id" filterable clearable class="width100" @change="brandchange">
                <el-option v-for="item in branddata" :key="item.brand_id" :label="item.brand_name" :value="item.brand_id"/>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :lg="8">
            <el-form-item label="系列" prop="series_id">
              <el-select v-model="temp.series_id" filterable clearable class="width100">
                <el-option v-for="item in seriesdata" :key="item.series_id" :label="item.series_name" :value="item.series_id"/>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :lg="8">
            <el-form-item label="指导价" prop="guide_price">
              <el-input v-model="temp.guide_price" type="text" clearable/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="40">
          <el-col :xs="24" :sm="12" :lg="8">
            <el-form-item label="变速箱" prop="transmission">
              <el-select v-model="temp.transmission" filterable clearable class="width100">
                <el-option :value="0" label="不限"/>
                <el-option :value="1" label="手动"/>
                <el-option :value="2" label="自动"/>
                <el-option :value="3" label="半自动"/>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :lg="8">
            <el-form-item label="排量(L)" prop="displacement">
              <el-input v-model="temp.displacement" type="text" clearable/>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :lg="8">
            <el-form-item label="发动机">
              <el-input v-model="temp.engine" type="text" clearable/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="40">
          <el-col :xs="24" :sm="12" :lg="8">
            <el-form-item label="燃料类型" prop="fuel_type">
              <el-select v-model="temp.fuel_type" filterable clearable class="width100">
                <el-option :value="0" label="其他"/>
                <el-option :value="1" label="汽油"/>
                <el-option :value="2" label="柴油"/>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :lg="8">
            <el-form-item label="环保标准">
              <el-select v-model="temp.emission_standard" filterable clearable class="width100">
                <el-option value="g4" label="国4"/>
                <el-option value="g5" label="国5"/>
                <el-option value="g6" label="国6"/>
                <el-option value="g0" label="其他"/>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :lg="8">
            <el-form-item label="推荐指数">
              <el-radio v-model="temp.is_recommend" :label="0" border>不推荐</el-radio>
              <el-radio v-model="temp.is_recommend" :label="1" border>推荐</el-radio>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="40">
          <el-col :xs="24" :sm="12" :lg="8">
            <el-form-item label="颜色" prop="color">
              <el-select v-model="temp.color" clearable class="width100">
                <el-option v-for="item in configdata.color" :key="item.id" :label="item.name" :value="item.id"/>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="汽车封面图">
          <el-upload
            :show-file-list="false"
            :headers="usertoken"
            :on-success="handleAvatarSuccess"
            :before-upload="handleAvatarbeforeupload"
            :on-error="handleAvatarError"
            name="image"
            action="http://lianshangche.ydxxtech.com/admin/uploadImages/car_cover"
            class="avatar-uploader">
            <div slot="tip" class="el-upload__tip">（请上传车辆左前45度的封面图）</div>
            <img v-if="temp.cover" :src="temp.cover.indexOf('http://phi8e7fdq.bkt.clouddn.com/') >= 0?temp.cover:'http://phi8e7fdq.bkt.clouddn.com/' + temp.cover" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"/>
          </el-upload>
        </el-form-item>
        <el-form-item label="汽车详情轮播图">
          <el-upload
            :headers="usertoken"
            :on-success="handleAvatarSuccess3"
            :before-upload="handleAvatarbeforeupload"
            :on-error="handleAvatarError"
            :on-remove="handleRemove"
            :limit="5"
            :file-list="imglists"
            action="http://lianshangche.ydxxtech.com/admin/uploadImages/car_image"
            list-type="picture-card"
            name="image">
            <i class="el-icon-plus"/>
          </el-upload>
        </el-form-item>
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
import waves from '@/directive/waves' // 水波纹指令

export default {
  name: 'CarManage',
  directives: {
    waves
  },
  components: {
    query
  },
  data() {
    return {
      tableKey: 0,
      usertoken: {
        Authorization: 'Bearer ' + getToken()
      },
      list: null,
      addloading: false,
      editloading: false,
      imglists: [],
      api: {
        add: '/car',
        edit: '/car',
        fetch: '/car',
        info: '/car',
        delete: '/car'
      },
      total: null,
      value4: '',
      listLoading: true,
      imglist: [],
      branddata: [],
      seriesdata: [],
      listQuery: {},
      statusOptions: ['published', 'draft', 'deleted'],
      showReviewer: false,
      temp: {
        series_id: '',
        brand_id: '',
        shop_id: 1,
        cover: '',
        is_recommend: 0,
        model_id: 5,
        pedestal: 5,
        fuel_type: 1,
        emission_standard: 'g4',
        transmission: 0,
        color: 2
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '修改',
        create: '新增'
      },
      dialogPvVisible: false,
      configdata: {},
      rules: {
        title: [{ required: true, message: '此项为必填项', trigger: 'blur' }],
        brand_id: [{ required: true, message: '此项为必填项', trigger: 'change' }],
        series_id: [{ required: true, message: '此项为必填项', trigger: 'change' }],
        price: [{ required: true, message: '此项为必填项', trigger: 'blur' }],
        model_id: [{ required: true, message: '此项为必填项', trigger: 'change' }],
        transmission: [{ required: true, message: '此项为必填项', trigger: 'change' }],
        car_age: [{ required: true, message: '此项为必填项', trigger: 'blur' }],
        mileage: [{ required: true, message: '此项为必填项', trigger: 'blur' }],
        displacement: [{ required: true, message: '此项为必填项', trigger: 'blur' }],
        engine: [{ required: true, message: '此项为必填项', trigger: 'change' }],
        emission_standard: [{ required: true, message: '此项为必填项', trigger: 'change' }],
        color: [{ required: true, message: '此项为必填项', trigger: 'change' }],
        fuel_type: [{ required: true, message: '此项为必填项', trigger: 'change' }],
        vendor_type: [{ required: true, message: '此项为必填项', trigger: 'change' }],
        pedestal: [{ required: true, message: '此项为必填项', trigger: 'change' }],
        is_recommed: [{ required: true, message: '此项为必填项', trigger: 'change' }],
        drive: [{ required: true, message: '此项为必填项', trigger: 'change' }],
        down_payments: [{ required: true, message: '此项为必填项', trigger: 'blur' }],
        monthly_supply: [{ required: true, message: '此项为必填项', trigger: 'blur' }],
        guide_price: [{ required: true, message: '此项为必填项', trigger: 'blur' }]
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
    this.$r.get('/car_configure').then(re => {
      console.log(re)
      re.data.result.map(it => {
        this.configdata[it.type] = it.children
      })
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
        this.$r.post(this.api.delete, { _method: 'delete', ids: id }).then((re) => {
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
              message: re.data.msg
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
        series_id: '',
        brand_id: '',
        shop_id: 1,
        cover: '',
        is_recommend: 0,
        model_id: 5,
        pedestal: 5,
        color: 2,
        fuel_type: 1,
        emission_standard: 'g4',
        transmission: 0
      }
    },
    handleCreate() {
      this.resetTemp()
      this.imglists = []
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
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
      this.imglists = []
      this.$r.get(this.api.info + '/' + row).then(re => {
        if (re.data.status === 'success') {
          this.dialogStatus = 'update'
          this.temp = re.data.result
          if (re.data.result.images) {
            re.data.result.images.split(';').map(it => {
              this.imglists.push({ name: '1', url: this.$imgSrc + it })
            })
          }
          this.$r.get('/car_series?brand_id=' + re.data.result.brand_id).then(re => {
            console.log(re)
            this.seriesdata = re.data.result
          })
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
          this.$r.put(this.api.edit, tempData).then((re) => {
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
      this.editloading = false
      this.addloading = false
      var imgs = []
      filelist.map(it => {
        imgs.push(it.response.msg)
      })
      this.temp.images = imgs.join(';')
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
  .avatar-uploader .avatar-uploader-icon:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    border-radius: 6px;
    border: 1px dashed #d9d9d9;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    height: 200px;
    display: block;
  }
</style>

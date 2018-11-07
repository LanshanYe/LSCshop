<template>
  <div>
    <div v-show="!dialogFormVisible">
      <query ref="querycomponent" :list-query="listQuery" :api="api">
        <div slot="queryFilter">
          <el-button v-waves class="filter-item" size="small" type="primary" icon="el-icon-edit" @click="handleCreate">{{ $t('table.add') }}</el-button>
        </div>
        <el-table-column slot="tableColumn" :label="$t('table.logo')" width="100" prop="logo" align="center">
          <template slot-scope="scope">
            <img :src="scope.row.logo || ''" style="width: 100%;" >
          </template>
        </el-table-column>
        <el-table-column slot="tableColumn" :label="$t('table.shop_cover')" width="200" prop="shop_cover" align="center">
          <template slot-scope="scope">
            <img :src="scope.row.shop_cover || ''" style="width: 100%;" >
          </template>
        </el-table-column>
        <el-table-column slot="tableColumn" :label="$t('table.shop_name')" prop="shop_name" align="center"/>
        <el-table-column slot="tableColumn" :label="$t('table.actions')" align="center" width="230" class-name="small-padding fixed-width">
          <template slot-scope="scope">
            <el-button type="primary" size="mini" @click="handleUpdate(scope.row.shop_id)">{{ $t('table.edit') }}</el-button>
            <el-button size="mini" type="danger" @click="deleteData(scope.row.shop_id)">{{ $t('table.delete') }}
            </el-button>
          </template>
        </el-table-column>
      </query>
    </div>
    <div v-show="dialogFormVisible" class="app-container">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="right" label-width="120px" style="width: 100%;">
        <el-row :gutter="40">
          <el-col :xs="24" :sm="12" :lg="8">
            <el-form-item :label="$t('table.shop_name')" prop="shop_name">
              <el-input v-model="temp.shop_name" type="text"/>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :lg="8">
            <el-form-item label="店内联系电话">
              <el-input v-model="temp.shop_phone" type="text"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="40">
          <el-col :xs="24" :sm="12" :lg="8">
            <el-form-item label="店长ID" prop="owner_id">
              <el-input v-model="temp.owner_id" type="text"/>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :lg="8">
            <el-form-item label="经营人电话" prop="link_phone">
              <el-input v-model="temp.link_phone" type="text"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="40">
          <el-col :xs="24" :sm="12" :lg="8">
            <el-form-item label="营业执照">
              <upimg :imgsrc="temp.business_licence" url="/uploadImages/shop_business" @upSuccess="handleAvatarSuccess5" @upError="handleAvatarError" @upBefore="handleAvatarbeforeupload"/>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :lg="8">
            <el-form-item label="店铺LOGO">
              <upimg :imgsrc="temp.logo" url="/uploadImages/shop_logo" @upSuccess="handleAvatarSuccess" @upError="handleAvatarError" @upBefore="handleAvatarbeforeupload"/>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :lg="8">
            <el-form-item label="封面图">
              <upimg :imgsrc="temp.shop_cover" url="/uploadImages/shop_cover" @upSuccess="handleAvatarSuccess2" @upError="handleAvatarError" @upBefore="handleAvatarbeforeupload"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="店内环境">
          <el-upload
            :headers="usertoken"
            :on-success="handleAvatarSuccess3"
            :before-upload="handleAvatarbeforeupload"
            :on-error="handleAvatarError"
            :on-remove="handleRemove"
            :limit="5"
            :file-list="imglists"
            action="http://lianshangche.ydxxtech.com/admin/uploadImages/shop_image"
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
import upimg from '@/components/Upload/uploadImg'
import { getToken } from '@/utils/auth'
import waves from '@/directive/waves' // 水波纹指令

export default {
  name: 'Shop',
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
        add: '/shop',
        edit: '/shop',
        fetch: '/shop',
        info: '/shop',
        delete: '/shop'
      },
      imglists: [],
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
        shop_cover: '',
        logo: '',
        business_licence: ''
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
      this.temp = {
        shop_cover: '',
        logo: '',
        business_licence: ''
      }
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
      this.imglists = []
      this.$r.get(this.api.info + '/' + row).then(re => {
        if (re.data.status === 'success') {
          this.dialogStatus = 'update'
          this.temp = re.data.result
          if (re.data.result.shop_images) {
            re.data.result.shop_images.map(it => {
              this.imglists.push({ name: '1', url: this.$imgSrc + it })
            })
          }
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
          this.$r.put(this.api.edit + '/' + tempData.shop_id, tempData).then((re) => {
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
      this.temp.shop_images = imgs.join(';')
    },
    handleAvatarSuccess5(res) {
      if (res.status === 'success') {
        this.temp.business_licence = res.msg
      }
      this.editloading = false
      this.addloading = false
    },
    handleAvatarSuccess(res) {
      if (res.status === 'success') {
        this.temp.logo = res.msg
      }
      this.editloading = false
      this.addloading = false
    },
    handleAvatarSuccess2(res) {
      if (res.status === 'success') {
        this.temp.shop_cover = res.msg
      }
      this.editloading = false
      this.addloading = false
    },
    handleAvatarSuccess3(res, file, filelist) {
      var imgs = []
      filelist.map(it => {
        if (it.response.status === 'success') {
          imgs.push(it.response.msg)
        }
      })
      this.temp.shop_images = imgs.join(';')
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
</style>

<template>
  <div>
    <div v-show="!dialogFormVisible">
      <query ref="querycomponent" :list-query="listQuery" :api="api">
        <div slot="queryFilter">
          <el-button v-waves class="filter-item" size="small" type="primary" icon="el-icon-edit" @click="handleCreate">{{ $t('table.add') }}</el-button>
        </div>
        <el-table-column slot="tableColumn" label="商品图片" width="100" align="center">
          <template slot-scope="scope">
            <img :src="scope.row.goods.cover" width="100%" alt="">
          </template>
        </el-table-column>
        <el-table-column slot="tableColumn" label="活动名称" prop="name" align="center"/>
        <el-table-column slot="tableColumn" label="活动价格" prop="price" align="center"/>
        <el-table-column slot="tableColumn" :formatter="timeformate" width="200" label="开始时间" prop="start_time" align="center"/>
        <el-table-column slot="tableColumn" :formatter="timeformate" width="200" label="结束时间" prop="end_time" align="center"/>
        <el-table-column slot="tableColumn" label="最大人数" prop="collage_num" align="center"/>
        <el-table-column slot="tableColumn" label="库存" prop="collage_inventory" align="center"/>
        <el-table-column slot="tableColumn" label="商户ID" prop="shop_id" align="center"/>
        <el-table-column slot="tableColumn" label="期数" prop="periods" align="center"/>
        <el-table-column slot="tableColumn" label="状态" prop="status" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.status===1?'上架':'下架' }}</span>
          </template>
        </el-table-column>
        <el-table-column slot="tableColumn" :label="$t('table.actions')" align="center" width="230" class-name="small-padding fixed-width">
          <template slot-scope="scope">
            <el-button type="primary" size="mini" @click="handleUpdate(scope.row.id)">{{ $t('table.edit') }}</el-button>
            <el-button size="mini" type="danger" @click="deleteData(scope.row.id)">{{ $t('table.delete') }}</el-button>
          </template>
        </el-table-column>
      </query>
    </div>
    <div v-show="dialogFormVisible" class="app-container">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="right" label-width="120px" style="width: 100%;">
        <el-row :gutter="40">
          <el-col :xs="24" :sm="12" :lg="8">
            <el-form-item label="活动名称" prop="name">
              <el-input v-model="temp.name" type="text"/>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :lg="8">
            <el-form-item label="活动价格">
              <el-input v-model="temp.price" type="text"/>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :lg="8">
            <el-form-item label="时间">
              <el-date-picker
                v-model="value4"
                :editable="false"
                clearable
                value-format="timestamp"
                type="datetimerange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                @change="timeschange"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="40">
          <el-col :xs="24" :sm="12" :lg="8">
            <el-form-item label="最大人数" prop="collage_num">
              <el-input v-model="temp.collage_num" type="text"/>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :lg="8">
            <el-form-item label="库存" prop="collage_inventory">
              <el-input v-model="temp.collage_inventory" type="text"/>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :lg="8">
            <el-form-item label="商户ID" prop="shop_id">
              <el-input v-model="temp.shop_id" type="text"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="40">
          <el-col :xs="24" :sm="12" :lg="8">
            <el-form-item label="电话" prop="phone">
              <el-input v-model="temp.phone" type="text"/>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :lg="8">
            <el-form-item label="商品ID" prop="base_id">
              <el-input v-model="temp.base_id" type="text"/>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :lg="8">
            <el-form-item label="排序" prop="sort">
              <el-input v-model="temp.sort" type="text"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="40">
          <el-col :xs="24" :sm="12" :lg="8">
            <el-form-item label="期数" prop="periods">
              <el-input v-model="temp.periods" type="text"/>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :lg="8">
            <el-form-item label="类型" prop="type">
              <el-radio v-model="temp.type" :label="1" border>按时间</el-radio>
              <el-radio v-model="temp.type" :label="2" border>按人数</el-radio>
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="12" :lg="8">
            <el-form-item label="状态" prop="status">
              <el-radio v-model="temp.status" :label="0" border>下架</el-radio>
              <el-radio v-model="temp.status" :label="1" border>上架</el-radio>
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
import waves from '@/directive/waves' // 水波纹指令

export default {
  name: 'Collage',
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
      addloading: false,
      editloading: false,
      api: {
        add: '/collage',
        edit: '/collage',
        fetch: '/collage',
        info: '/collage',
        delete: '/collage'
      },
      imglists: [],
      total: null,
      value4: [],
      listLoading: true,
      imglist: [],
      branddata: [],
      seriesdata: [],
      listQuery: {},
      statusOptions: ['published', 'draft', 'deleted'],
      showReviewer: false,
      temp: {
        shop_cover: '',
        logo: ''
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
      this.value4 = []
      this.temp = {
        shop_cover: '',
        logo: ''
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
            re.data.result.shop_images.split(';').map(it => {
              this.imglists.push({ name: '1', url: it })
            })
          }
          this.value4 = [re.data.result.start_time * 1000, re.data.result.end_time * 1000]
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
    timeschange(e) {
      if (e) {
        this.temp.start_time = e[0] / 1000 + ''
        this.temp.end_time = e[1] / 1000 + ''
      } else {
        this.temp.start_time = ''
        this.temp.end_time = ''
      }
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
    timeformate(n, m, c) {
      const d = new Date(c * 1000).toLocaleString()
      return d
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

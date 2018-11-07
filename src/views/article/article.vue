<template>
  <div v-loading="listLoading">
    <div v-show="!dialogFormVisible">
      <query ref="querycomponent" :list-query="listQuery" :api="api">
        <div slot="queryFilter">
          <el-button v-waves class="filter-item" size="small" type="primary" icon="el-icon-edit" @click="handleCreate">{{ $t('table.add') }}</el-button>
          <el-button v-waves class="filter-item" size="small" type="primary" icon="el-icon-search" @click="handleFilter">{{ $t('table.search') }}</el-button>
        </div>
        <el-table-column slot="tableColumn" :label="$t('table.photo')" width="200px" prop="cover" align="center">
          <template slot-scope="scope">
            <img :src="scope.row.cover" style="max-width:100%" alt="">
          </template>
        </el-table-column>
        <el-table-column slot="tableColumn" :label="$t('table.description')" prop="title" align="center"/>
        <el-table-column slot="tableColumn" label="内容" prop="sort" align="center">
          <template slot-scope="scope">
            <div style="max-width: 400px;max-height: 200px;overflow: auto" v-html="scope.row.content"/>
          </template>
        </el-table-column>
        <el-table-column slot="tableColumn" :label="$t('table.sort')" prop="sort" align="center"/>
        <el-table-column slot="tableColumn" :label="$t('table.actions')" align="center" width="230" class-name="small-padding fixed-width">
          <template slot-scope="scope">
            <el-button type="primary" size="mini" @click="handleUpdate(scope.row.article_id)">{{ $t('table.edit') }}</el-button>
            <el-button size="mini" type="danger" @click="deleteData(scope.row.article_id)">{{ $t('table.delete') }}</el-button>
          </template>
        </el-table-column>
      </query>
    </div>
    <div v-show="dialogFormVisible" class="app-container">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="right" label-width="120px" style="width: 100%;">
        <el-form-item label="文章名称">
          <el-input v-model="temp.title" type="text"/>
        </el-form-item>
        <el-form-item label="系列">
          <el-select v-model="temp.series_id">
            <el-option v-for="(it, index) in seriesData" :label="it.title" :value="it.series_id" :key="index"/>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('table.sort')">
          <el-input v-model="temp.sort" placeholder="数字越大越在前"/>
        </el-form-item>
        <el-form-item label="封面图">
          <upimg :imgsrc="temp.cover" url="/uploadImages/article_cover" @upSuccess="handleAvatarSuccess" @upError="handleAvatarError" @upBefore="handleAvatarbeforeupload"/>
        </el-form-item>
        <el-form-item label="文章内容">
          <tinymce ref="tiny" :height="400" v-model="temp.content"/>
        </el-form-item>
      </el-form>
      <div class="filter-container">
        <el-button @click="dialogFormVisible = false">{{ $t('table.cancel') }}</el-button>
        <el-button v-if="dialogStatus=='create'" :loading="addloading" type="primary" @click="createData">{{ $t('table.confirm') }}</el-button>
        <el-button v-else :loading="editloading" type="primary" @click="updateData">{{ $t('table.confirm') }}</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import query from '@/components/queryTable'
import upimg from '@/components/Upload/uploadImg'
import Tinymce from '@/components/Tinymce'
import waves from '@/directive/waves' // 水波纹指令

export default {
  name: 'Article',
  directives: {
    waves
  },
  components: {
    query,
    upimg,
    Tinymce
  },
  data() {
    return {
      tableKey: 0,
      list: null,
      imglist: [],
      api: {
        add: '/article',
        edit: '/article',
        fetch: '/article',
        info: '/article',
        delete: '/article'
      },
      addloading: false,
      editloading: false,
      total: null,
      value4: '',
      listLoading: false,
      listQuery: {},
      statusOptions: ['published', 'draft', 'deleted'],
      showReviewer: false,
      temp: {
        cover: ''
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '修改',
        create: '新增'
      },
      dialogPvVisible: false,
      seriesData: [],
      rules: {
        image: [{ required: true, trigger: 'change' }]
      },
      downloadLoading: false
    }
  },
  mounted() {
    this.$refs.querycomponent.getList()
    this.$r.get('article-series').then(re => {
      this.seriesData = re.data.result
    })
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
        cover: ''
      }
    },
    handleCreate() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.$refs.tiny.setContent('')
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.listLoading = true
          this.addloading = true
          const tempData = Object.assign({}, this.temp)
          this.$r.post(this.api.edit, tempData).then((re) => {
            if (re.data.status === 'success') {
              this.$refs.querycomponent.getList()
              this.dialogFormVisible = false
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
            this.listLoading = false
            this.addloading = false
          }).catch(errs => {
            this.listLoading = false
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
          this.$refs.tiny.setContent(re.data.result.content || '')
          this.$nextTick(() => {
            this.$refs['dataForm'].clearValidate()
          })
        } else {
          this.$notify.error({
            title: '失败',
            message: re.data.msg || '获取失败'
          })
        }
      }).catch(errs => console.log(errs))
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.listLoading = true
          this.editloading = true
          const tempData = Object.assign({}, this.temp)
          this.$r.post(this.api.edit, tempData).then((re) => {
            console.log(re)
            if (re.data.status === 'success') {
              this.dialogFormVisible = false
              this.$refs.querycomponent.getList()
              this.$notify({
                title: '成功',
                message: re.data.msg || '更新成功',
                type: 'success',
                duration: 2000
              })
            } else {
              this.$notify.error({
                title: '失败',
                message: re.data.msg || '修改失败',
                duration: 2000
              })
            }
            this.listLoading = false
            this.editloading = false
          }).catch(errs => {
            this.listLoading = false
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

</style>

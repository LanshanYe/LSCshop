<template>
  <div>
    <div v-show="!dialogFormVisible">
      <query ref="querycomponent" :list-query="listQuery" :api="api">
        <div slot="queryFilter">
          <el-button v-waves class="filter-item" size="small" type="primary" icon="el-icon-search" @click="handleFilter">{{ $t('table.search') }}</el-button>
          <el-button v-waves class="filter-item" size="small" type="primary" icon="el-icon-edit" @click="handleCreate">{{ $t('table.add') }}</el-button>
        </div>
        <el-table-column slot="tableColumn" :label="$t('table.photo')" width="150" prop="car_name" align="center">
          <template slot-scope="scope">
            <img :src="scope.row.avatar || ''" style="width: 100%;" >
          </template>
        </el-table-column>
        <el-table-column slot="tableColumn" :label="$t('table.rid')" prop="id" align="center"/>
        <el-table-column slot="tableColumn" :label="$t('table.nickname')" prop="nickname" align="center"/>
        <el-table-column slot="tableColumn" :label="$t('table.parent')" prop="upper_id" align="center"/>
        <el-table-column slot="tableColumn" :label="$t('table.child_num')" prop="child_num" align="center"/>
        <el-table-column slot="tableColumn" :label="$t('table.money')" prop="money" align="center"/>
        <el-table-column slot="tableColumn" label="用户地址权限" prop="money" align="center">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.address_type===0" type="success">可更改</el-tag>
            <el-tag v-else type="danger">不可更改</el-tag>
          </template>
        </el-table-column>
        <el-table-column slot="tableColumn" :label="$t('table.actions')" align="center" width="230" class-name="small-padding fixed-width">
          <template slot-scope="scope">
            <!--<el-button type="primary" size="mini" @click="handleUpdate(scope.row.id)">{{ $t('table.edit') }}</el-button>-->
            <!--<el-button size="mini" type="danger" @click="deleteData(scope.row.id)">{{ $t('table.delete') }}</el-button>-->
            <el-dropdown trigger="click" @command="handleCommand">
              <el-button type="primary">
                <i class="el-icon-arrow-down"/>
              </el-button>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item v-for="(it, index) in dropdownItem" :key="index" :command="{row: scope.row, index: index}" divided>{{ it.name }}</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </template>
        </el-table-column>
      </query>
    </div>
    <el-dialog
      :visible.sync="dialogVisible"
      title="用户地址"
      width="80%">
      <div v-show="!dialogFormVisible2">
        <query ref="querycomponent2" :list-query="listQuery2" :api="api2">
          <div slot="queryFilter">
            <el-button v-waves class="filter-item" size="small" type="primary" icon="el-icon-refresh" @click="handleFilter2">刷新</el-button>
          </div>
          <el-table-column slot="tableColumn" label="联系人" prop="link_man" align="center"/>
          <el-table-column slot="tableColumn" label="联系电话" prop="link_phone" align="center"/>
          <el-table-column slot="tableColumn" label="省" prop="province" align="center"/>
          <el-table-column slot="tableColumn" label="市" prop="city" align="center"/>
          <el-table-column slot="tableColumn" label="区" prop="area" align="center"/>
          <el-table-column slot="tableColumn" label="地址详情" prop="address_detail" align="center"/>
          <el-table-column slot="tableColumn" label="默认地址" prop="is_default" align="center">
            <template slot-scope="scope">
              <template v-if="scope.row.is_default===1"><el-button type="success" icon="el-icon-check" circle/></template>
            </template>
          </el-table-column>
          <el-table-column slot="tableColumn" :label="$t('table.actions')" align="center" width="230" class-name="small-padding fixed-width">
            <template slot-scope="scope">
              <el-button type="primary" size="mini" @click="handleUpdate2(scope.row.id)">{{ $t('table.edit') }}</el-button>
            </template>
          </el-table-column>
        </query>
      </div>
      <div v-show="dialogFormVisible2" class="app-container">
        <el-form ref="dataForm2" :model="temp2" label-position="right" label-width="120px" style="width: 100%;">
          <el-row :gutter="40">
            <el-col :xs="24" :sm="12" :lg="8">
              <el-form-item label="联系人">
                <el-input v-model="temp2.link_man" type="text"/>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="12" :lg="8">
              <el-form-item label="联系电话">
                <el-input v-model="temp2.link_phone" type="text"/>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="12" :lg="8">
              <el-form-item label="详细地址">
                <el-input v-model="temp2.address_detail" type="text"/>
              </el-form-item>
            </el-col>
          </el-row>
          <el-form-item label="区">
            <!--<area-select :level="2" v-model="temp.city" type="text"/>-->
          </el-form-item>
        </el-form>
        <div class="filter-container">
          <el-button @click="dialogFormVisible2 = false">{{ $t('table.cancel') }}</el-button>
          <el-button :loading="editloading" type="primary" @click="updateData2">{{ $t('table.confirm') }}</el-button>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">关 闭</el-button>
      </span>
    </el-dialog>
    <div v-show="dialogFormVisible" class="app-container">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="right" label-width="120px" style="width: 100%;">
        <el-row :gutter="40">
          <el-col :xs="24" :sm="12" :lg="8">
            <el-form-item :label="$t('table.nickname')" prop="nickname">
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
        <el-form-item :label="$t('table.avatar')">
          <upimg :imgsrc="temp.avatar" url="/uploadImages/user" @upSuccess="handleAvatarSuccess" @upError="handleAvatarError" @upBefore="handleAvatarbeforeupload"/>
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
// import Vue from 'vue'
// import 'vue-area-linkage/dist/index.css'
// import VueAreaLinkage from 'vue-area-linkage'
import query from '@/components/queryTable'
import upimg from '@/components/Upload/uploadImg'
import { getToken } from '@/utils/auth'
import waves from '@/directive/waves' // 水波纹指令
// Vue.use(VueAreaLinkage)

export default {
  name: 'UserManage',
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
        add: '/user',
        edit: '/user',
        fetch: '/user',
        info: '/user_info',
        delete: '/user'
      },
      api2: {
        add: '/userAddress',
        edit: '/userAddress',
        fetch: '/userAddress',
        info: '/userAddress',
        delete: '/userAddress'
      },
      total: null,
      value4: '',
      listLoading: true,
      dialogVisible: false,
      imglist: [],
      branddata: [],
      seriesdata: [],
      listQuery: {},
      listQuery2: {},
      statusOptions: ['published', 'draft', 'deleted'],
      showReviewer: false,
      temp: {
        avatar: ''
      },
      temp2: {},
      dialogFormVisible: false,
      dialogFormVisible2: false,
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
      downloadLoading: false,
      dropdownItem: [
        { name: '修改上级ID' },
        { name: '修改用户地址权限' },
        { name: '修改用户地址信息' },
        { name: '设置T积分' },
        { name: '重置密码' },
        { name: '修改会员' },
        { name: '删除用户' }
      ]
    }
  },
  mounted() {
    this.$refs.querycomponent.getList()
  },
  methods: {
    handleCommand(n) {
      console.log(n)
      switch (n.index) {
        case 0:
          this.$prompt('当前上级ID为：' + n.row.upper_id, '修改上级ID', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            inputPlaceholder: '输入新的上级ID',
            inputPattern: /^[0-9]+$/,
            inputErrorMessage: 'ID格式不正确'
          }).then(({ value }) => {
            this.$r.post('/changeUpper', { user_id: n.row.id, upper_id: value }).then(re => {
              console.log(re)
              this.$refs.querycomponent.getList()
              if (re.data.status === 'success') {
                this.$notify({
                  title: '成功',
                  message: '修改成功',
                  type: 'success'
                })
              } else {
                this.$notify.error({
                  title: '失败',
                  message: re.data.msg || ''
                })
              }
            }).catch(errs => {
              console.log(errs)
            })
          }).catch(() => {
            return false
          })
          break
        case 1:
          this.$confirm('更改此用户地址权限为：' + (n.row.address_type === 1 ? '可更改' : '不可更改'), '更改用户地址权限', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.$r.put('/updateAddress', { ids: n.row.id, address_type: (n.row.address_type === 1 ? 0 : 1) }).then(re => {
              console.log(re)
              this.$refs.querycomponent.getList()
              if (re.data.status === 'success') {
                this.$notify({
                  title: '成功',
                  message: '修改成功',
                  type: 'success'
                })
              } else {
                this.$notify.error({
                  title: '失败',
                  message: re.data.msg || ''
                })
              }
            })
          }).catch(() => {
            return false
          })
          break
        case 2:
          this.api2.fetch = '/userAddress/' + n.row.id
          this.dialogVisible = true
          this.$nextTick(() => {
            this.$refs.querycomponent2.getList()
          })
          break
        case 3:
          break
        case 4:
          break
        case 5:
          break
        case 6:
          break
      }
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
              type: 'success'
            })
          } else {
            this.$notify.error({
              title: '失败',
              message: re.data.msg || ''
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
    handleFilter2() {
      this.$refs.querycomponent2.handleFilter()
    },
    resetTemp() {
      this.temp = {
        avatar: ''
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
                message: re.data.msg || ''
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
            message: re.data.msg || ''
          })
        }
      }).catch(errs => console.log(errs))
    },
    handleUpdate2(row) {
      this.$r.get(this.api2.info + '/' + row).then(re => {
        if (re.data.status === 'success') {
          this.temp2 = re.data.result
          this.dialogFormVisible2 = true
          this.$nextTick(() => {
            this.$refs['dataForm2'].clearValidate()
          })
        } else {
          this.$notify.error({
            title: '失败',
            message: re.data.msg || ''
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
                message: re.data.msg || ''
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
    updateData2() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.editloading = true
          var tempData = Object.assign({}, this.temp2)
          this.$r.put(this.api.edit + '/' + tempData.id, tempData).then((re) => {
            if (re.data.status === 'success') {
              this.dialogFormVisible2 = false
              this.$refs.querycomponent2.getList()
              this.$notify({
                title: '成功',
                message: '更新成功',
                type: 'success'
              })
            } else {
              this.$notify.error({
                title: '失败',
                message: re.data.msg || ''
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

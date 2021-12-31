<template>
  <div class="app-container">
    <div class="filter-container">
      <el-select v-model="listQuery.buildingsNo" placeholder="宿舍楼" style="width: 200px;margin-right: 10px" class="filter-item" @keyup.enter.native="handleFilter" >
        <el-option v-for="item in buildingsOption" :key="item.buildingId" :label="item.buildingName" :value="item.universityId" />
      </el-select>

      <el-select v-model="listQuery.floor" placeholder="楼层" clearable style="width: 90px;margin-right: 10px" class="filter-item">
        <el-option v-for="item in [1,2,3,4,5,6,7]" :key="item" :label="item" :value="item" />
      </el-select>

      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        {{ $t('table.search') }}

      </el-button>
  
     <div style="float: right">
        
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleCreate">
        {{ $t('table.add') }}
      </el-button>
      <el-button v-waves :loading="downloadLoading" class="filter-item" type="primary" icon="el-icon-download" @click="handleDownload">
        {{ $t('table.export') }}
      </el-button>
     </div>

    </div>

    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%;"
      @sort-change="sortChange"
    >
      <el-table-column :label="tableCol.id" prop="id" sortable="custom" align="center" width="80" :class-name="getSortClass('id')">
        <template slot-scope="{row}">
          <span>{{ row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="tableCol.buildingNo" width="120px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.buildingNo }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="tableCol.floor" width="80px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.floor }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="tableCol.roomNo" width="80px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.roomNo }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="tableCol.sex" align="center" width="80px">
        <template slot-scope="{row}">
          <span>{{ row.sex==0?"女":row.sex==1?"男":"未知" }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="tableCol.toFansDiff" class-name="status-col" width="100">
        <template slot-scope="{row}">
          <span>{{ row.toFansDiff }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="tableCol.comingTime" width="80px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.comingTime }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="tableCol.visitors" width="140px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.visitors }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="tableCol.remarks" width="190px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.remarks }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.actions')" align="center" width="230" class-name="small-padding fixed-width">
        <template slot-scope="{row,$index}">
          <el-button type="primary" size="mini" @click="handleUpdate(row)">
            {{ $t('table.edit') }}
          </el-button>
          <el-button v-if="row.status!='deleted'" size="mini" type="danger" @click="handleDelete(row,$index)">
            {{ $t('table.delete') }}
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="70px" style="width: 400px; margin-left:50px;">
        <el-form-item label="宿舍楼" >
          <el-select :disabled="dialogStatus==='create'?false:true" v-model="temp.buildingNo" class="filter-item" placeholder="请选择宿舍楼">
             <el-option v-for="item in buildingsOption" :key="item.buildingId" :label="item.buildingName" :value="item.universityId" />
          </el-select>
        </el-form-item>
        <el-form-item label="楼层" >
          <el-input :disabled="dialogStatus==='create'?false:true"  v-model="temp.floor" placeholder="请输入楼层  如（1层）" />
        </el-form-item>
        <el-form-item label="房号" >
          <el-input :disabled="dialogStatus==='create'?false:true"  v-model="temp.roomNo" placeholder="请输入房号 如（333）"/>
        </el-form-item>
        <!-- <el-form-item label="性别">
          <el-select v-model="temp.sex" class="filter-item" placeholder="请选择性别">
            <el-option v-for="item in sexOption" :key="item" :label="item" :value="item" />
          </el-select>
        </el-form-item> -->
         <el-form-item label="加粉难度">
          <el-select  v-model="temp.toFansDiff" class="filter-item" placeholder="默认一般">
            <el-option v-for="item in DiffOption" :key="item" :label="item" :value="item" />
          </el-select>
        </el-form-item>
        <el-form-item label="到访次数">
          <el-input disabled=true v-model="temp.comingTime" placeholder="不用输入，编辑后自动递增" />
        </el-form-item>
        <el-form-item label="到访人员">
          <el-input v-model="temp.visitors" placeholder="请输入你的姓名 " />
        </el-form-item>
        <el-form-item label="备注信息">
          <el-input v-model="temp.remarks" type="textarea" placeholder="有备注信息吗？" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          {{ $t('table.cancel') }}
        </el-button>
        <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">
          {{ $t('table.confirm') }}
        </el-button>
      </div>
    </el-dialog>

    <el-dialog :visible.sync="dialogPvVisible" title="Reading statistics">
      <el-table :data="pvData" border fit highlight-current-row style="width: 100%">
        <el-table-column prop="key" label="Channel" />
        <el-table-column prop="pv" label="Pv" />
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogPvVisible = false">{{ $t('table.confirm') }}</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
// import { fetchList, fetchPv, createArticle, updateArticle } from '@/api/article'
import { fetchList , getBuildingsByUniversityId} from '@/api/dormitory'
import waves from '@/directive/waves' // waves directive
import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination

export default {
  name:"DormitoryInfo",
  components: { Pagination },
  directives: { waves },
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: 'success',
        draft: 'info',
        deleted: 'danger'
      }
      return statusMap[status]
    },
    typeFilter(type) {
      return calendarTypeKeyValue[type]
    }
  },
  data() {
    return {
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,
      tableCol: {
        id: "id",
        buildingNo: "宿舍楼",
        floor: "楼层",
        roomNo: "房号",
        sex: "性别",
        toFansDiff: "加粉难度",
        comingTime: "到访次数",
        visitors: "到访人员",
        remarks: "备注信息"
      },
      temp:{
        buildingNo: "",
        floor: "",
        roomNo: "",
        sex: "",
        toFansDiff: "一般",
        comingTime: "",
        // TODO:从缓存中获取用户名
        visitors: "",
        remarks: ""
      },
      listQuery: {
        page: 1,
        limit: 20,
        buildingsNo: '',
        floor: '',
        sort: '+id'
      },
      buildingsOption:[],
      sexOption:["男","女","未知"],
      DiffOption:["简单","一般","困难"],
      sortOptions: [{ label: 'ID Ascending', key: '+id' }, { label: 'ID Descending', key: '-id' }],
      showReviewer: false,
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '编辑',
        create: '新建'
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
  created() {
    this.getList()
    this.getBuildings()
  },
  methods: {
    getList() {
      this.listLoading = true
      fetchList(this.listQuery).then(response => {
        this.list = response.data.items
        this.total = response.data.total

        // Just to simulate the time of the request
        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 1000)
      })
    },
    getBuildings(){
      getBuildingsByUniversityId(1).then(response =>{
        this.buildingsOption = response.data
      })
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    handleModifyStatus(row, status) {
      this.$message({
        message: '操作成功',
        type: 'success'
      })
      row.status = status
    },
    sortChange(data) {
      const { prop, order } = data
      if (prop === 'id') {
        this.sortByID(order)
      }
    },
    sortByID(order) {
      if (order === 'ascending') {
        this.listQuery.sort = '+id'
      } else {
        this.listQuery.sort = '-id'
      }
      this.handleFilter()
    },
    resetTemp() {
      this.temp = {
        buildingNo: "",
        floor: "",
        roomNo: "",
        sex: "",
        toFansDiff: "一般",
        comingTime: "",
        visitors: "",
        remarks: ""
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
          this.temp.id = parseInt(Math.random() * 100) + 1024 // mock a id
          this.temp.author = 'vue-element-admin'
          createArticle(this.temp).then(() => {
            this.list.unshift(this.temp)
            this.dialogFormVisible = false
            this.$notify({
              title: '成功',
              message: '创建成功',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    handleUpdate(row) {
      this.temp = Object.assign({}, row) // copy obj
      this.temp.timestamp = new Date(this.temp.timestamp)
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.temp)
          tempData.timestamp = +new Date(tempData.timestamp) // change Thu Nov 30 2017 16:41:05 GMT+0800 (CST) to 1512031311464
          updateArticle(tempData).then(() => {
            const index = this.list.findIndex(v => v.id === this.temp.id)
            this.list.splice(index, 1, this.temp)
            this.dialogFormVisible = false
            this.$notify({
              title: '成功',
              message: '更新成功',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    handleDelete(row, index) {
      this.$notify({
        title: '成功',
        message: '删除成功',
        type: 'success',
        duration: 2000
      })
      this.list.splice(index, 1)
    },
    handleFetchPv(pv) {
      fetchPv(pv).then(response => {
        this.pvData = response.data.pvData
        this.dialogPvVisible = true
      })
    },
    handleDownload() {
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = ['timestamp', 'title', 'type', 'importance', 'status']
        const filterVal = ['timestamp', 'title', 'type', 'importance', 'status']
        const data = this.formatJson(filterVal)
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: 'table-list'
        })
        this.downloadLoading = false
      })
    },
    formatJson(filterVal) {
      return this.list.map(v => filterVal.map(j => {
        if (j === 'timestamp') {
          return parseTime(v[j])
        } else {
          return v[j]
        }
      }))
    },
    getSortClass: function(key) {
      const sort = this.listQuery.sort
      return sort === `+${key}` ? 'ascending' : 'descending'
    }
  }
}
</script>

<style>

</style>
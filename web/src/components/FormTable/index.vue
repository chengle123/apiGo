<template>
  <div>
    <el-table
      key="FormTable"
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%;"
      :height="tableHeight"
      @sort-change="$emit('sortChange',$event)"
      @selection-change="handleSelectionChange"
    >
      <slot />
    </el-table>
    <pagination v-show="count>0" class="text-right mt-0" :total="count" :page.sync="searchParams.skipCount" :limit.sync="searchParams.pageSize" @pagination="changePG" />
  </div>
</template>

<script>
/**
 * 表格
 * fetchParam {object} 请求参数
 * countNum {number} 数据总数 用法:countNum.sync="count"
 * getApi {function} 请求接口
 * formatData {function} 返回参数格式化
 * sortChange {function} 排序事件函数
 * setHeight {string || number} 表格高度
 * selectionChange {function} 选择监听
 */
import Pagination from '@/components/Pagination'
export default {
  name: 'FormTable',
  components: { Pagination },
  model: {
    event: 'sortChange'
  },
  props: {
    fetchParam: { // 上传时附带的参数
      default: () => {
        return {}
      },
      type: Object
    },
    countNum: { // 总数
      default: 0,
      type: Number
    },
    getApi: Function,
    formatData: Function,
    setHeight: {
      default: '',
      type: String
    },
  },
  data() {
    return {
      list: null,
      count: this.countNum,
      searchParams: {
        ...this.fetchParam,
        pageSize: 20,
        skipCount: 1
      },
      listLoading: false,
      tableHeight: this.setHeight ? this.setHeight : 'auto'
    }
  },
  watch: {
    fetchParam: {
      deep: true,
      immediate: true,
      handler() {
        this.searchParams = {
          ...this.searchParams,
          ...this.fetchParam
        }
      }
    }
  },
  methods: {
    changePG(pages) {
      this.getList()
    },
    getList(params) {
      this.searchParams = Object.assign(this.searchParams, params)

      let ops = {};
      for(var key in this.searchParams){
        if(this.searchParams[key] !== '' && this.searchParams[key] !== null && this.searchParams[key] !== undefined ){
          ops[key] = this.searchParams[key]
        }
      }

      const { pageSize, skipCount } = ops
      
      this.listLoading = true
      this.getApi({
        ...ops,
        pageSize: pageSize,
        skipCount: (skipCount - 1) * pageSize
      }).then(response => {
        if (response.result === 'success') {
          if (this.formatData) {
            this.list = this.formatData(response.data)
          } else {
            this.list = response.data
          }
          this.count = response.count
        } else {
          this.$message.error(response.msg)
        }
        this.$emit('update:countNum', this.count)
        this.listLoading = false
      }, err => {
        this.listLoading = false
      })
    },
    handleSelectionChange(val){
      this.$emit('selectionChange',Array.from(val))
    }
  }
}
</script>

<style lang="scss">

</style>

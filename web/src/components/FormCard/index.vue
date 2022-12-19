<template>
  <div>
    <div
      key="FormTable"
      v-loading="listLoading"
      style="width: 100%;"
    >
      <slot />
    </div>
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
 */
import Pagination from '@/components/Pagination'
export default {
  name: 'FormCard',
  components: { Pagination },
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
    formatData: Function
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
      listLoading: false
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

      const { pageSize, skipCount } = this.searchParams

      this.listLoading = true
      this.getApi({
        ...this.searchParams,
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
    }

  }
}
</script>

<style lang="scss">

</style>

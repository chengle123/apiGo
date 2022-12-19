<template>
  <div class="show_file_box">
    <div style="height: 0; overflow: hidden;">
      <el-image
        ref="previewImg"
        :src="dialogImageUrl"
        :preview-src-list="formFileList.map(item=>bgImg(item))"
      />
    </div>
    <div class="">
      <div class="show_file_operation" v-for="(item, index) in fileUrl" :key="index">
        <div class="show_file_bg" :style="`background: url(${bgImg(item)}) no-repeat 50% 50%; background-size: contain;`" />
        <span class="el-show-list__item-actions">
          <span
            class="el-show-list__item-preview"
            @click="handlePictureCardPreview(item)"
          >
            <i class="el-icon-zoom-in" />
          </span>
          <span
            class="el-show-list__item-delete"
            @click="handleDownload(item)"
          >
            <i class="el-icon-download" />
          </span>
        </span>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import axios from 'axios'
import CSV from '@/assets/fileImages/CSV.png'
import EXCEL from '@/assets/fileImages/EXCEL.png'
import PDF from '@/assets/fileImages/PDF.png'
import PPT from '@/assets/fileImages/PPT.png'
import RAR from '@/assets/fileImages/RAR.png'
import WORD from '@/assets/fileImages/WORD.png'
import ZIP from '@/assets/fileImages/ZIP.png'

export default {
  props: {
    fileUrl: { // 文件数组
      default: [],
      type: Array
    },
  },
  data() {
    return {
      formFileList: [], // 显示上传文件
      dialogImageUrl: '',
    }
  },
  computed: {
    ...mapGetters([
      'userInfo'
    ])
  },
  watch: {
    fileUrl: {
      deep: true,
      immediate: true,
      handler() {
        this.formFileList = this.fileUrl
      }
    }
  },
  methods: {
    // 缩略图展示
    bgImg(file) {
      let type = ''
      const types = {
        IMG: '',
        WORD: WORD,
        EXCEL: EXCEL,
        PDF: PDF,
        CSV: CSV,
        RAR: RAR,
        ZIP: ZIP,
        PPT: PPT
      }
      
      if (file.raw) {
        type = this.fileFormat(file.name)
      } else {
        type = this.fileFormat(file.url)
      }

      if (type === 'IMG') {
        return file.url
      } else {
        return types[type]
      }
    },
    // 文件格式
    fileFormat(name) {
      const images = 'bmp|jpg|jpeg|png|gif|svg|webp|JPG|JPEG|PNG'
      const word = 'doc|docx|DOC|DOCX'
      const excel = 'xls|xlsx|XLS|XLSX'
      const pdf = 'pdf|PDF'
      const csv = 'csv|CSV'
      const rar = 'rar|RAR'
      const zip = 'zip|ZIP'
      const ppt = 'pptx|PPTX'

      const pattern_images = new RegExp('.(' + images + ')$')
      const pattern_word = new RegExp('.(' + word + ')$')
      const pattern_excel = new RegExp('.(' + excel + ')$')
      const pattern_pdf = new RegExp('.(' + pdf + ')$')
      const pattern_csv = new RegExp('.(' + csv + ')$')
      const pattern_rar = new RegExp('.(' + rar + ')$')
      const pattern_zip = new RegExp('.(' + zip + ')$')
      const pattern_ppt = new RegExp('.(' + ppt + ')$')

      if (name.indexOf('?') > -1) {
        name = name.split('?')[0]
      }

      if (pattern_images.test(name)) {
        return 'IMG'
      } else if (pattern_word.test(name)) {
        return 'WORD'
      } else if (pattern_excel.test(name)) {
        return 'EXCEL'
      } else if (pattern_pdf.test(name)) {
        return 'PDF'
      } else if (pattern_csv.test(name)) {
        return 'CSV'
      } else if (pattern_rar.test(name)) {
        return 'RAR'
      } else if (pattern_zip.test(name)) {
        return 'ZIP'
      } else if (pattern_ppt.test(name)) {
        return 'PPT'
      }
    },

    handlePictureCardPreview(file) {
      let type, url
      if (file.raw) {
        type = this.fileFormat(file.name)
        url = file.response.data[0].attachmenturl
      } else {
        type = this.fileFormat(file.url)
        url = file.url
      }

      if (type === 'IMG') {
        this.dialogImageUrl = file.url
        this.$refs.previewImg.showViewer = true
      } else if (type === 'PDF') {
        window.open('https://www.hellogil.com/web/contractPreview.html?url=' + url.replace('http://', 'https://'))
      } else if (type === 'WORD' || type === 'EXCEL' || type === 'CSV' || type === 'PPT') {
        window.open(`https://www.hellogil.cn:8012/onlinePreview?watermarkTxt=${this.userInfo.userName}${this.userInfo.jobCard}&url=` + url.replace('http://', 'https://'))
      } else {
        this.$message({
          message: '该文件不支持预览!',
          type: 'warning'
        })
      }
    },
    handleDownload(file) {
      console.log(file)
      var name
      if (file.name) {
        name = file.name
        if (!name.indexOf('.') > -1) {
          var a = file.url.split('/')
          var b = a[a.length - 1]
          name = file.name + '.' + b.split('.')[1]
        }
      } else {
        var a = file.url.split('/')
        name = a[a.length - 1]
      }
      axios({
        method: 'post',
        url: process.env.VUE_APP_BASE_API + '/huilianApi/uploader/downloadZipFiles',
        data: 'fileUrls=' + JSON.stringify([{
          imgName: name.replace(/\&/g, '-').replace(/\?/g, '-').replace(/\%/g, '-'),
          dataImg: file.url
        }]),
        responseType: 'blob' // 加上这个是重点
      }).then(res => {
        this.downloadFile(res.data, name)
      })
    },
    downloadFile(data, name) {
      const url = window.URL.createObjectURL(new Blob([data]))
      const link = document.createElement('a')
      link.style.display = 'none'
      link.href = url
      link.setAttribute('download', name)
      document.body.appendChild(link)
      link.click()
      URL.revokeObjectURL(link.href)
      document.body.removeChild(link)
      this.$message({
        message: '下载成功',
        type: 'success'
      })
    },
  }
}
</script>

<style lang="scss">
.show_file_box{
  &::after{
    content: '';
    display: block;
    clear: both;
  }
  .show_file_operation{
      width: 104px;
      height: 104px;
      border: 1px solid #C0CCDA;
      border-radius: 4px;
      position: relative;
      line-height: 104px;
      float: left;
      margin-right: 10px;
      margin-bottom: 10px;
      .show_file_bg{
          width: 100%;
          height: 100%;
      }
      .el-show-list__item-actions{
        position: absolute;
        width: 100%;
        height: 100%;
        left: 0;
        top: 0;
        cursor: default;
        text-align: center;
        color: #fff;
        opacity: 0;
        font-size: 20px;
        background-color: rgba(0,0,0,.5);
        transition: opacity .3s;
        span{
          cursor: pointer;
          font-size: inherit;
          color: inherit;
        }
        .el-show-list__item-delete{
          position: static;
          top: 0;
          margin-left: 20px;
        }
      }
      &:hover{
        .el-show-list__item-actions{
          opacity: 1;
        }
      }
  }
}
</style>

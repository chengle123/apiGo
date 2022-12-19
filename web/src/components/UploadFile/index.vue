<template>
  <div class="upload_file_box">
    <div style="height: 0; overflow: hidden;">
      <el-image
        ref="previewImg"
        :src="dialogImageUrl"
        :preview-src-list="formFileList.map(item=>bgImg(item))"
      />
    </div>
    <el-upload
      :action="attachment"
      list-type="picture-card"
      :limit="limit"
      :multiple="multiple"
      :data="formData"
      :accept="fileType.join(',')"
      :disabled="fileDisabled"
      :file-list="formFileList"
      :on-exceed="formHandleExceed"
      :before-upload="beforeUploadForm"
      :on-change="handleUploadForm"
      :on-remove="formHandleRemove"
      :on-success="handleSuccess"
      :on-error="handleError"
    >
      <i slot="default" class="el-icon-plus" />
      <div slot="file" slot-scope="{file}" class="upload_file_operation">
        <div class="upload_file_bg" :style="`background: url(${bgImg(file)}) no-repeat 50% 50%; background-size: contain;`" />
        <span class="el-upload-list__item-actions">
          <span
            class="el-upload-list__item-preview"
            @click="handlePictureCardPreview(file)"
          >
            <i class="el-icon-zoom-in" />
          </span>
          <span
            class="el-upload-list__item-delete"
            @click="handleDownload(file)"
          >
            <i class="el-icon-download" />
          </span>
          <span
            v-if="!fileDisabled"
            class="el-upload-list__item-delete"
            @click="formHandleRemove(file)"
          >
            <i class="el-icon-delete" />
          </span>
        </span>
        <span v-if="file.status !== 'success'" style="opacity: 1;" class="el-upload-list__item-actions">
          <i class="el-icon-loading"></i>
        </span>
      </div>
    </el-upload>
  </div>
</template>

<script>
import { attachment } from '@/api/publicApi'
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
    limit: { // 限制文件个数
      default: 1,
      type: Number
    },
    multiple: { // 上传多个文件
      default: false,
      type: Boolean
    },
    formMaxSize: { // 限制文件大小
      default: 10, //  M
      type: Number
    },
    fileUrl: { // 文件数组
      default: [],
      type: Array
    },
    formData: { // 上传时附带的额外参数
      default: () => {
        return {
          attachmenType: 'VOUCHER'
        }
      },
      type: Object
    },
    fileType: { // 限制选择文件类型
      // default: '.pptx,.csv,.zip,.rar,image/*,application/msexcel,application/msword,application/pdf,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.openxmlformats-officedocument.wordprocessingml.document, text/plain',
      default: () => {
        return ['.pptx', '.csv', '.zip', '.rar', '.jpg', '.jpeg', '.png', '.doc', '.docx', '.pdf', '.PDF', '.xls', '.xlsx']
      },
      type: Array
    },
    fileDisabled: {
      default: false,
      type: Boolean
    }
  },
  data() {
    return {
      attachment,
      formFileList: [], // 显示上传文件
      dialogImageUrl: '',
      loading: '',
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
    // 开始上传前验证
    beforeUploadForm(file) {
      // 验证文件大小
      if (file.size / 1024 / 1024 > this.formMaxSize) {
        setTimeout(()=>{
          this.$message({
            message: `上传文件 “${file.name}” 大小不能超过${this.formMaxSize}M!`,
            type: 'warning'
          })
        },1)
        return false
      }
      // 中文乱码处理
      // if (file.raw) {
      //   let reader = new FileReader(); // 读取文件内容
      //   reader.readAsText(file.raw, "gb2312"); // 防止中文乱码问题，不加reader.onload方法都不会触发
      //   reader.onload = function(e) {
      //     this.contentHtml = e.target.result; // txt文本内容，接下来就可以对其进行校验处理了
      //   };
      // }
      // 验证文件类型
      if (!this.fileType.includes('.' + file.name.split('.')[1])) {
        setTimeout(()=>{
          this.$message({
            message: `上传文件 “${file.name}” 格式错误!`,
            type: 'warning'
          })
        },1)
        return false
      }
    },
    formHandleRemove(file, formFileList) {
      if (file.status !== 'ready') {
        this.formFileList.splice(this.formFileList.indexOf(file), 1)
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
    // 允许上传文件个数验证
    formHandleExceed(files, formFileList) {
      this.$message.warning(
        `最多上传 ${this.limit} 个文件！`
      )
    },
    // 上传文件
    handleUploadForm(file, fileList) {
      // console.log(file.status)
      // if (file.status === 'ready') {
      //   this.loading = this.$loading({
      //     lock: true,
      //     text: '上传中，请稍候...',
      //     spinner: 'el-icon-loading',
      //     background: 'rgba(0, 0, 0, 0.7)'
      //   })
      // } else {
      //   // this.loading.close()
      // }
    },
    // 上传成功
    handleSuccess(response, file, fileList) {
      var num = 0;
      for(var i = 0; i<fileList.length; i++){
        if(fileList[i].status === 'success'){
          num++
        }
      }
      if(num === fileList.length ){
        // this.formFileList = [];
        // for(var i = 0; i<fileList.length; i++){
        //   this.formFileList.push(fileList[i])
        // }
        this.formFileList = fileList;
        this.$emit('update:fileUrl',this.formFileList);
      }
      
    },
    // 上传失败
    handleError(err, file, fileList) {
      console.log(err)
      // this.loading.close()
    }
  }
}
</script>

<style lang="scss">
.upload_file_box{
  .el-upload-list--picture-card{
    .el-upload-list__item{
      width: 104px;
      height: 104px;
    }
  }
  .el-upload--picture-card{
    width: 104px;
    height: 104px;
    line-height: 104px;
  }
  .upload_file_operation{
      width: 100%;
      height: 100%;
      .upload_file_bg{
          width: 100%;
          height: 100%;
      }
  }
}
</style>

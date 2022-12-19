<template>
  <div class="navbar">
    <hamburger id="hamburger-container" :is-active="sidebar.opened" class="hamburger-container" @toggleClick="toggleSideBar" />

    <!-- <breadcrumb id="breadcrumb-container" class="breadcrumb-container" /> -->
    <!-- <nav-menu class="nav-menu-container" /> -->

    <div class="right-menu">
      <template v-if="device!=='mobile'">
        <search id="header-search" class="right-menu-item" />

        <!-- <error-log class="errLog-container right-menu-item hover-effect" /> -->

        <screenfull id="screenfull" class="right-menu-item hover-effect" />

        <el-tooltip content="布局大小" effect="dark" placement="bottom">
          <size-select id="size-select" class="right-menu-item hover-effect" />
        </el-tooltip>

      </template>

      <!-- 组织 -->
      <el-tooltip v-if="userInfo.userOrgPros" content="所属组织" effect="dark" placement="bottom">
        <el-dropdown class=" right-menu-item hover-effect" trigger="click" @command="handleSetUserOrg">
          <div>
            <svg-icon icon-class="peoples" />
          </div>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item v-for="(item, i) of userInfo.userOrgPros" :key="item.professionCode + i" :disabled="userOrg===item.professionCode" :command="item.professionCode">
              {{ item.organizationName }}-{{ item.professionName }}
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </el-tooltip>

      <!-- 个人 -->
      <el-dropdown class="avatar-container right-menu-item hover-effect" trigger="click">
        <div class="avatar-wrapper">
          <img :src="userInfo.headPortrait ? userInfo.headPortrait : headImg" class="user-avatar">
          <i class="el-icon-caret-bottom" />
        </div>
        <el-dropdown-menu slot="dropdown">
          <!-- <router-link to="/profile/index"> -->
          <el-dropdown-item>
            {{ userInfo.userName }}/{{ userInfo.jobCard }}
          </el-dropdown-item>
          <!-- </router-link> -->
          <el-dropdown-item divided @click.native="logout">
            <span style="display:block;">退出登录</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
    <!-- <el-dialog title="修改密码" :visible.sync="changePasswordVisible" width="30%" :append-to-body="true" :destroy-on-close="true">
      <el-alert
        title="警告：修改密码完成后会强制重新登录，请完成当前操作以免工作进度丢失。"
        type="warning"
        show-icon
        class="mb-10"
      />

      <el-form ref="changePasswordForm" class="changePasswordBox" :model="changePasswordForm" :rules="changePasswordRules" label-width="100px">
        <el-form-item label="新密码" prop="password">
          <el-input v-model="changePasswordForm.password" type="password" />
        </el-form-item>
        <el-form-item label="确认新密码" prop="newPassword">
          <el-input v-model="changePasswordForm.newPassword" type="password" />
        </el-form-item>
        <el-form-item label="验证码" prop="identifyCode">
          <el-input v-model="changePasswordForm.identifyCode">
            <el-button v-if="!getIdentifyCodeType" slot="append" @click="getIdentifyCode">获取验证码</el-button>
            <el-button v-if="getIdentifyCodeType" slot="append">{{ getIdentifyCodeNum }} 秒后重新获取</el-button>
          </el-input>
        </el-form-item>
        <el-form-item class="changePasswordBtn">
          <el-button @click="resetForm()">取 消</el-button>
          <el-button type="primary" @click="submitForm()">确认修改</el-button>
        </el-form-item>
      </el-form>
    </el-dialog> -->
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Breadcrumb from '@/components/Breadcrumb'
import Hamburger from '@/components/Hamburger'
import ErrorLog from '@/components/ErrorLog'
import Screenfull from '@/components/Screenfull'
import SizeSelect from '@/components/SizeSelect'
import Search from '@/components/HeaderSearch'
import headImg from '@/assets/navbar/head.png'
import NavMenu from '@/components/NavMenu'

export default {
  components: {
    Breadcrumb,
    Hamburger,
    ErrorLog,
    Screenfull,
    SizeSelect,
    Search,
    NavMenu
  },
  data() {
    var validateNewPassword = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.changePasswordForm.password) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    return {
      headImg: headImg,
      timer: '',
      getIdentifyCodeType: false,
      getIdentifyCodeNum: 60,
      changePasswordVisible: false,
      changePasswordForm: {
        type: 2,
        password: '',
        newPassword: '',
        identifyCode: ''
      },
      changePasswordRules: {
        password: [
          { required: true, message: '请输入新密码', trigger: 'blur' },
          { min: 6, message: '最短需要6位', trigger: 'blur' }
        ],
        newPassword: [
          { required: true, validator: validateNewPassword, trigger: 'blur' }
        ],
        identifyCode: [
          { required: true, message: '请输入验证码', trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    ...mapGetters([
      'sidebar',
      'device',
      'userInfo',
      'userOrg'
    ])
  },
  methods: {
    toggleSideBar() {
      this.$store.dispatch('app/toggleSideBar')
    },
    async logout() {
      await this.$store.dispatch('user/logout')
      this.$router.push(`/login?redirect=${this.$route.fullPath}`)
    },
    handleSetUserOrg(userOrg) {
      this.$ELEMENT.userOrg = userOrg
      this.$store.dispatch('app/setUserOrg', userOrg)
      this.refreshView()
      this.$message({
        message: '切换组织',
        type: 'success'
      })
    },
    refreshView() {
      // 重新获取菜单or权限
      // In order to make the cached page re-rendered
      // this.$store.dispatch('tagsView/delAllCachedViews', this.$route)

      // const { fullPath } = this.$route

      // this.$nextTick(() => {
      //   this.$router.replace({
      //     path: '/redirect' + fullPath
      //   })
      // })
    },
    // submitForm() {
    //   this.$refs.changePasswordForm.validate((valid) => {
    //     if (valid) {
    //       this.$store.dispatch('user/updateUserPassword', this.changePasswordForm)
    //         .then(() => {
    //           this.$message({
    //             message: '密码修改成功',
    //             type: 'success'
    //           })
    //           this.logout()
    //         })
    //         .catch(() => {
    //         })
    //     } else {
    //       return false
    //     }
    //   })
    // },
    resetForm() {
      this.dialogFormVisible = false
      this.$refs.changePasswordForm.resetFields()
    },
    // getIdentifyCode() {
    //   clearInterval(this.timer)
    //   this.getIdentifyCodeNum = 60
    //   this.$store.dispatch('user/updateUserPasswordIdentify')
    //     .then(() => {
    //       this.getIdentifyCodeType = true
    //       this.timer = setInterval(() => {
    //         if (this.getIdentifyCodeNum === 0) {
    //           this.getIdentifyCodeType = false
    //           clearInterval(this.timer)
    //           return
    //         }
    //         this.getIdentifyCodeNum -= 1
    //       }, 1000)
    //     })
    //     .catch(() => {
    //       clearInterval(this.timer)
    //       this.getIdentifyCodeNum = 60
    //     })
    // }
  }
}
</script>

<style lang="scss" scoped>
.navbar {
  height: 50px;
  overflow: hidden;
  position: relative;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0,21,41,.08);

  .hamburger-container {
    line-height: 46px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background .3s;
    -webkit-tap-highlight-color:transparent;

    &:hover {
      background: rgba(0, 0, 0, .025)
    }
  }

  .breadcrumb-container {
    float: left;
  }
  .nav-menu-container{
    float: left;
    width: 73%;
  }

  .errLog-container {
    display: inline-block;
    vertical-align: top;
  }

  .right-menu {
    float: right;
    height: 100%;
    line-height: 50px;

    &:focus {
      outline: none;
    }

    .right-menu-item {
      display: inline-block;
      padding: 0 8px;
      height: 100%;
      font-size: 18px;
      color: #5a5e66;
      vertical-align: text-bottom;

      &.hover-effect {
        cursor: pointer;
        transition: background .3s;

        &:hover {
          background: rgba(0, 0, 0, .025)
        }
      }
    }

    .avatar-container {
      margin-right: 30px;

      .avatar-wrapper {
        margin-top: 5px;
        position: relative;

        .user-avatar {
          cursor: pointer;
          width: 40px;
          height: 40px;
          border-radius: 10px;
        }

        .el-icon-caret-bottom {
          cursor: pointer;
          position: absolute;
          right: -20px;
          top: 25px;
          font-size: 12px;
        }
      }
    }
  }
  .changePasswordBox{
    margin-top: 20px;
    .changePasswordBtn{
      text-align: right;
      padding-top: 20px;
    }
  }
}
</style>

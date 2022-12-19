<template>
  <div class="login-container" style="overflow:hidden">
    <div class="content" style="overflow:hidden">
      <div class="login-content">
        <el-form ref="loginForm" :model="loginForm" :rules="loginRules" class="login-form" autocomplete="on" label-position="left">
          <div class="title-container">
            <h3 class="title">
              慧联智控持续发布平台
            </h3>
          </div>

          <el-form-item prop="userName">
            <span class="svg-container">
              <svg-icon icon-class="user" />
            </span>
            <el-input
              ref="userName"
              v-model="loginForm.userName"
              placeholder="登录名（如工号）"
              name="userName"
              type="text"
              tabindex="2"
              autocomplete="on"
            />
          </el-form-item>

          <el-tooltip v-model="capsTooltip" content="大写锁定已打开" placement="right" manual>
            <el-form-item prop="password">
              <span class="svg-container">
                <svg-icon icon-class="password" />
              </span>
              <el-input
                :key="passwordType"
                ref="password"
                v-model="loginForm.password"
                :type="passwordType"
                placeholder="登录密码"
                name="password"
                tabindex="3"
                autocomplete="on"
                @keyup.native="checkCapslock"
                @blur="capsTooltip = false"
              />
              <span class="show-pwd" @click="showPwd">
                <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'" />
              </span>
            </el-form-item>
          </el-tooltip>

          <el-button :loading="loading" type="primary" style="width:100%;height:50px;margin-bottom:30px;" @click.native.prevent="handleLogin">
            登录
          </el-button>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  name: 'Login',
  components: {},
  data() {
    const validateUsername = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请输入登录名(如工号)'))
      } else {
        callback()
      }
    }
    const validatePassword = (rule, value, callback) => {
      if (value.length < 6) {
        callback(new Error('请输入正确密码'))
      } else {
        callback()
      }
    }
    return {
      loginForm: {
        userName: '',
        password: ''
      },
      loginRules: {
        userName: [{ required: true, trigger: 'blur', validator: validateUsername }],
        password: [{ required: true, trigger: 'blur', validator: validatePassword }]
      },
      passwordType: 'password',
      capsTooltip: false,
      loading: false,
      redirect: undefined,
      otherQuery: {},
      timer: ''
    }
  },
  watch: {
    $route: {
      handler: function(route) {
        const query = route.query
        if (query) {
          this.redirect = query.redirect
          this.otherQuery = this.getOtherQuery(query)
        }
      },
      immediate: true
    }
  },
  mounted() {
    if (this.loginForm.userName === '') {
      this.$refs.userName.focus()
    } else if (this.loginForm.password === '') {
      this.$refs.password.focus()
    }
  },
  destroyed() {
    clearInterval(this.timer)
  },
  methods: {
    checkCapslock(e) {
      const { key } = e
      this.capsTooltip = key && key.length === 1 && (key >= 'A' && key <= 'Z')
    },
    showPwd() {
      if (this.passwordType === 'password') {
        this.passwordType = ''
      } else {
        this.passwordType = 'password'
      }
      this.$nextTick(() => {
        this.$refs.password.focus()
      })
    },
    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true
          this.$store.dispatch('user/login', this.loginForm)
            .then((res) => {
              // console.log(res)
              this.$message({
                message: res.msg,
                type: res.result
              })
              this.loading = false
              if (res.result === 'success') {
                this.$router.push({ path: this.redirect || '/', query: this.otherQuery })
              }
            })
            .catch((err) => {
              this.loading = false
            })
        } else {
          console.log('登录参数不全')
          return false
        }
      })
    },
    getOtherQuery(query) {
      return Object.keys(query).reduce((acc, cur) => {
        if (cur !== 'redirect') {
          acc[cur] = query[cur]
        }
        return acc
      }, {})
    }
  }
}
</script>

<style lang="scss">
/* 修复input 背景不协调 和光标变色 */
/* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */
$bg:#333;
$light_gray:#fff;
$cursor: #fff;

@supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
    .login-container .el-input input {
        color: $cursor;
    }
}
/* reset element-ui css */
.login-container {
    position: relative;
    .el-input {
        display: inline-block;
        height: 47px;
        width: 85%;

        input {
            background: transparent;
            border: 0px;
            -webkit-appearance: none;
            border-radius: 0px;
            padding: 24px 5px 24px 15px;
            color: $bg;
            height: 47px;
            font-size: 18px;
            caret-color: $cursor;

            &:-webkit-autofill {
                -webkit-box-shadow: 0 0 0px 1000px $cursor inset !important;
                box-shadow: 0 0 0px 1000px $cursor inset !important;
                -webkit-text-fill-color: $bg !important;
            }
        }
    }
    .el-select{
        width: 93%;
        .el-input {
            display: inline-block;
            height: 47px;
            width: 100%;
        }
    }
    .el-form-item {
        border: 1px solid rgba(255, 255, 255, 0.1);
        background: rgba(0, 0, 0, 0.1);
        border-radius: 5px;
        color: #454545;
    }
}
</style>

<style lang="scss" scoped>
$bg:#fff;
$dark_gray:#889aa4;
$light_gray:#eee;

.login-container {
    height: 100%;
    width: 100%;
    background: $bg url('../../assets/login_images/bg.png') no-repeat center center;
    background-size: cover;
    // .login-form {
    //     position: relative;
    //     width: 520px;
    //     max-width: 100%;
    //     padding: 90px 43px 0;
    //     margin: 0 auto;
    //     overflow: hidden;
    // }

    .tips {
        font-size: 14px;
        color: #fff;
        margin-bottom: 10px;

        span {
            &:first-of-type {
                margin-right: 16px;
            }
        }
    }
    .svg-container {
        padding: 6px 5px 6px 15px;
        // color: $dark_gray;
        vertical-align: middle;
        width: 30px;
        display: inline-block;
    }
    .el-form-item{
        height: 50px;
        background: #fff;
        box-shadow: 0px 8px 30px 0px #fff;
        border-radius: 4px;
        border: 1px solid #CCCCCC;
    }
    .title-container {
        position: relative;
        .title {
            font-size: 40px;
            height: 48px;
            font-size: 40px;
            font-weight: 600;
            color: #333333;
            line-height: 48px;
            text-shadow: 0px 8px 30px rgba(0, 33, 63, 0.2);
            text-align: center;
        }
        &::before{
            content: '';
            display: block;
            width: 100%;
            height: 122px;
            background: url('../../assets/login_images/logo.png') no-repeat center center;
        }
    }
    .show-pwd {
        position: absolute;
        right: 10px;
        top: 7px;
        font-size: 16px;
        color: $dark_gray;
        cursor: pointer;
        user-select: none;
    }
    .content{
        position: absolute;
        top: 50%;
        left: 50%;
        margin-top: -270px;
        margin-left: -300px;
        height: 540px;
        width: 600px;
    }
}
</style>

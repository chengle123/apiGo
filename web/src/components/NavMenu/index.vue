<template>
    <div class="clearfix menu-box " :class="{'scroll-menu-box': scrollMenuType}" ref="menuBox">
        <span class="fl menu-btn-left" @click="btnLeft" v-if="scrollMenuType">
            <i class="el-icon-d-arrow-left"></i>
        </span>
        <div class="fl menu-box-content">
            <el-menu
                :default-active="activeIndex"
                class="app-nav-menu"
                mode="horizontal"
                @select="handleSelect"
                :style="`width: ${menus.length*100}px; transform: translateX(${translateX}px);`"
            >
                <el-menu-item :index="i+1+''" v-for="(item, i) in menus" :key="i">{{item.resourceName}}</el-menu-item>
            </el-menu>
        </div>
        <span class="fr menu-btn-right" @click="btnRight" v-if="scrollMenuType">
            <i class="el-icon-d-arrow-right"></i>
        </span>
    </div>
</template>

<script>
import pathToRegexp from 'path-to-regexp'
import { mapGetters } from 'vuex'


export default {
    computed: {
        ...mapGetters([
            'menus'
        ]),
    },
    data() {
        return {
            activeIndex: 1,
            translateX: 0,
            scrollMenuType: false,
        }
    },
    created() {
        window.addEventListener('resize', this.getWidth);
        this.getWidth();
        this.getNavMenu()
    },
    methods: {
        getWidth(){
            if(window.innerWidth <= 1600){
                this.scrollMenuType = true
            }else{
                this.scrollMenuType = false
                this.translateX = 0
            }
        },
        getNavMenu(){
            const {menus, $route} = this
            for(var i=0; i< menus.length; i++){
                if(JSON.stringify(menus[i]).indexOf($route.name) > -1){
                    this.activeIndex = i+1+'';
                    break;
                }
            }
            this.changeLeftMenu();
        },
        changeLeftMenu(){
            const {menus, activeIndex} = this
            this.$store.dispatch('permission/changeLeftMenu', menus[activeIndex-1].children)
        },
        handleSelect(key){
            this.activeIndex = key;
            this.changeLeftMenu();
        },
        btnLeft(){
            if(this.translateX < 0){
                this.translateX += 100
            }
        },
        btnRight(){
            console.log(this.translateX + this.menus.length*100, this.$refs.menuBox.clientWidth)
            if(this.translateX + this.menus.length*100 > this.$refs.menuBox.clientWidth){
                this.translateX -= 100
            }
        }
    }
}
</script>

<style lang="scss" scoped>
.menu-box{
    &.scroll-menu-box{
        overflow: hidden;
        .menu-btn-left, .menu-btn-right{
            display: block;
            height: 50px;
            line-height: 50px;
            font-size: 12px;
            position: relative;
            cursor: pointer;
            color: #909399;
            z-index: 2;
            background-color: #fff;
            &:hover{
                box-shadow: 0px 0px 4px #999;
                color: #000;
            }
        }

        .menu-box-content{
            width: calc(100% - 24px);
        }
    }
    .app-nav-menu{
        min-width: 100%;
        transition: all 0.28s;
        position: relative;
        z-index: 1;
    }
    .app-nav-menu.el-menu--horizontal > .el-menu-item{
        height: 50px;
        line-height: 50px;
    }
}
</style>

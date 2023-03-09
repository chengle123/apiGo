// 登录路由处理函数
const login = (req, res) => {
    const { username, password } = req.body
    const user = await User.find().where({ username })
    if(user._id){
        // 密码比对
        if(bcrypt.compareSync(password, user.password)){
        const userObj = { ...user, password: '' }
        // 生成token
        let token = jwt.sign(userObj, jwtSecretKey, { expiresIn }) 
        res.send({ status: 0, message: '登录成功~', token: token })
        }else{
        res.cc('用户名或密码错误')
        }
    }else{
        return res.cc('找不到该用户！')
    }
}

// 查询接口列表
const getInterfaceList = (req, res) => {
    try {
        const list = await interface.find()
        res.send({ status: 0, message: '查询成功', data: list || [] })
    } catch (error) {
        return res.cc('接口列表查询失败')
    }
}

// 查询接口详情
const getInterfaceDetail = (req, res) => {
    const { _id } = req.body
    try {
        const detail = await interface.find().where({ _id })
        res.send({ status: 0, message: '查询成功', data: detail || {} })
    } catch (error) {
        return res.cc('接口详情查询失败')
    }
}

// 新增接口
const addInterface = (req, res) => {
    try {
        const data = await interface.insertOne(
            {
                ...req.body,
                status: '正常',
                create_gmt: getTime(),
                create_name: getCookie().username,
            }
        )
        res.send({ status: 0, message: '新增接口成功', data: '' })
    } catch (error) {
        return res.cc('新增接口失败')
    }
}

// 编辑接口
const editInterface = (req, res) => {
    try {
        const body = {
            ...req.body
        }
        delete body._id
        const data = await interface.updateOne(
            { _id: req.body._id },
            {
                $set: { 
                    ...body,
                    modified_gmt: getTime(),
                    modified_name: getCookie().username,
                }
            }
        )
        res.send({ status: 0, message: '编辑接口成功', data: '' })
    } catch (error) {
        return res.cc('编辑接口失败')
    }
}

// 查询参数列表
const getParameterList = (req, res) => {
    try {
        const list = await parameter.find()
        res.send({ status: 0, message: '查询成功', data: list || [] })
    } catch (error) {
        return res.cc('参数列表查询失败')
    }
}

// 查询参数详情
const getParameterDetail = (req, res) => {
    const { _id } = req.body
    try {
        const detail = await parameter.find().where({ _id })
        res.send({ status: 0, message: '查询成功', data: detail || {} })
    } catch (error) {
        return res.cc('参数详情查询失败')
    }
}

// 新增参数
const addParameter = (req, res) => {
    try {
        const data = await parameter.insertOne(
            {
                ...req.body,
                status: '正常',
                create_gmt: getTime(),
                create_name: getCookie().username,
            }
        )
        res.send({ status: 0, message: '新增参数成功', data: '' })
    } catch (error) {
        return res.cc('新增参数失败')
    }
}

// 编辑参数
const editParameter = (req, res) => {
    try {
        const body = {
            ...req.body
        }
        delete body._id
        const data = await parameter.updateOne(
            { _id: req.body._id },
            {
                $set: { 
                    ...body,
                    modified_gmt: getTime(),
                    modified_name: getCookie().username,
                }
            }
        )
        res.send({ status: 0, message: '编辑参数成功', data: '' })
    } catch (error) {
        return res.cc('编辑参数失败')
    }
}

// 查询项目组列表
const getProjectTeamList = (req, res) => {
    try {
        const list = await projectTeam.find()
        res.send({ status: 0, message: '查询成功', data: list || [] })
    } catch (error) {
        return res.cc('项目组列表查询失败')
    }
}

// 查询项目组详情
const getProjectTeamDetail = (req, res) => {
    const { _id } = req.body
    try {
        const detail = await projectTeam.find().where({ _id })
        res.send({ status: 0, message: '查询成功', data: detail || {} })
    } catch (error) {
        return res.cc('项目组详情查询失败')
    }
}

// 新增项目组
const addProjectTeam = (req, res) => {
    try {
        const data = await projectTeam.insertOne(
            {
                ...req.body,
                create_gmt: getTime(),
                create_name: getCookie().username,
            }
        )
        res.send({ status: 0, message: '新增项目组成功', data: '' })
    } catch (error) {
        return res.cc('新增项目组失败')
    }
}

// 删除项目组
const delProjectTeam = (req, res) => {
    try {
        const data = await projectTeam.deleteOne(
            {
                _id:req.body._id,
            }
        )
        res.send({ status: 0, message: '删除项目组成功', data: '' })
    } catch (error) {
        return res.cc('删除项目组失败')
    }
}

// 编辑项目组
const editProjectTeam = (req, res) => {
    try {
        const body = {
            ...req.body
        }
        delete body._id
        const data = await projectTeam.updateOne(
            { _id: req.body._id },
            {
                $set: { 
                    ...body,
                    modified_gmt: getTime(),
                    modified_name: getCookie().username,
                }
            }
        )
        res.send({ status: 0, message: '编辑项目组成功', data: '' })
    } catch (error) {
        return res.cc('编辑项目组失败')
    }
}

// 生成文档
const generateDocument = (req, res) => {
    const { _id } = req.body
    try {
        const detail = await projectTeam.find().where({ _id })
        const url = getDocument(detail)
        res.send({ status: 0, message: '文档生成成功', data: url })
    } catch (error) {
        return res.cc('文档生成失败')
    }
}
const getDocument = (data) => {
    //project_apis
    let text = `
        #${data.project_name}
        ${
            data.project_apis.map(item=>{
                return `
                    ##${item.api_name}
                    请求方式：${item.api_mode}
                    接口地址：${item.api_url}
                    接口类型：${item.api_type}
                    备注：${item.api_memo}
                    创建人：${item.create_gmt}
                    创建时间：${item.create_name}
                    修改人：${item.modified_name}
                    修改时间：${item.modified_gmt}
                    接口入参：
                    key|类型|是否必填
                    ---|:--:|---:
                    ${item.api_params.map(obj=>{
                        return [obj.params_key,obj.params_type,obj.isRequired].join('|')
                    }).join('\n')}
                    内容|内容|内容
                    接口出参：
                    key|类型
                    ---|:--:|---:
                    ${item.api_response.map(obj=>{
                        return [obj.params_key,obj.params_type].join('|')
                    }).join('\n')}
                `
            }).join('\n')
        }
    `

    fs.writeFileSync(path.join(__dirname, `${data.project_name}_${data._id}.md`), text, "utf8")

    return `${location.origin}/${data.project_name}_${data._id}.md`
};

// 批量调试
const getAllDebugging = (req, res) => {
    try {
        const datas = await projectTeam.find({ _id: { $in: _ids.split(',') } })
        http(datas).then(res=>{
            res.send({ status: 0, message: '调试成功', data: res })
        })
    } catch (error) {
        return res.cc('调试失败')
    }
}

// 单个调试
getDebugging = (req, res) => {
    try {
        http([req.body]).then(res=>{
            res.send({ status: 0, message: '调试成功', data: res[0][req.body._id] })
        })
    } catch (error) {
        return res.cc('调试失败')
    }
}
const http = (list)=>{
    return new Promise(function(resolve, reject){
        var arr = [];
        var i = 0;
        list.map(ops=>{
            var obj = {};
            ops.api_params.map(item=>{
                obj[item.params_key] = item.params_value
            })
            request({
                url: ops.api_url,
                method: ops.api_mode,
                form: obj
            }, function(error, response, body) {
                i++
                var data = {}
                data[ops._id] = {response, body}
                arr.push(data)
                if(i === list.length){
                    resolve(arr);
                }
            });
        })
    });
}

// 模拟数据
const mockCode = (param)=>{
    try {
        const resultCode = Mock.mock(param)
        return resultCode
    } catch (error) {
        return param
    }
}

app.on('request',(req,res)=>{
    try {
        var parseObj = url.parse(req.url, true);
        var pathname = parseObj.pathname;
        if(pathname.indexOf('/apiManager/mock') > -1){
            var OBJ = {};
            var notHandleData = {};
            const api = this.req.path.split('/apiManager/mock')[1];
            let detail = interface.find().where({ api_url: api });
            let params = parameter.find({ "params_key": { "$in": detail.api_response } });
            params.map(item=>{
                if(item.params_mock_type){
                    OBJ[item.params_key] = item.params_mock_type;
                }else{
                    notHandleData[item.params_key] = item.params_value;
                }
            })
            const mockData = mockCode(params)

            res.send({
                status: 0,
                message: '查询成功',
                data: {...mockData, ...notHandleData}
            })
        }else{
            const apiList = {
                '/login': login,
                '/getInterfaceList': getInterfaceList,
                '/getInterfaceDetail': getInterfaceDetail,
                '/addInterface': addInterface,
                '/editInterface': editInterface,
                '/getParameterList': getParameterList,
                '/getParameterDetail': getParameterDetail,
                '/addParameter': addParameter,
                '/editParameter': editParameter,
                '/getProjectTeamList': getProjectTeamList,
                '/getProjectTeamDetail': getProjectTeamDetail,
                '/addProjectTeam': addProjectTeam,
                '/delProjectTeam': delProjectTeam,
                '/editProjectTeam': editProjectTeam,
                '/generateDocument': generateDocument,
                '/getAllDebugging': getAllDebugging,
                '/getDebugging': getDebugging,
            }
            if(apiList[pathname]){
                apiList[pathname](req,res)
            }else{
                res.end('没有这个接口')
            }
        }
    } catch (error) {
        res.end('没有这个接口')
    }
    
})
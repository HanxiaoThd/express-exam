var express=require("express");
var router = express.Router();
var md5=require("./common/md5");
var connect=require("./common/mysql");
var xlsx = require('node-xlsx');
var multer  = require('multer');
var upload = multer.diskStorage({
    destination:function (req,file,cb) {
        cb(null,'./uploads');
    },
    filename:function (req, file, cb) {
        cd (null,file.fiel.fieldirname+"-"+Date.now());
    }
});
var
/*
*
* */
//处理根目录
router.get('/', function(req, res, next){
    if(req.cookies.user){
        res.render('./admin/admin',{user:req.cookies.user});
    }else{
        res.render("./admin/jump",{message:"请登录",url:"/admin/login"});
    }
});

//处理登录
router.get("/login",function (req,res,next) {
   res.render("./admin/login");
});

//处理登录
router.post("/check",function (req,res,next) {
    var name=req.body.name;
    var pass=md5(req.body.pass);
    connect.query("select * from admin",function (error,result) {
        if(error){
            console.log(error);
            res.end();
            return false;
        }else{
            var flag=true;
            for (var i=0;i<result.length;i++){
                if(result[i].aname==name){
                    if(result[i].apass==pass){
                        flag=false;
                        res.cookie("user",name);
                        res.render("./admin/jump",{message:"登录成功",url:"/admin"});
                        break;
                    }
                }

            }
            if (flag){
                console.log("账号密码错误");
                res.render("./admin/jump",{message:"账号密码错误",url:"/admin/login"});

            }

        }
    });

});
//添加管理员页面
router.get("/addRoles",function (req,res) {
   res.render("./admin/addRoles");
});
//插入数据库
router.post("/addAdmin",function (req,res) {
    var aname=req.body.aname;
    var apass=md5(req.body.apass);
    var sql="insert into admin (aname,apass) values ('"+aname+"','"+apass+"')";
    connect.query(sql,function (error,result) {
        if(error){
            console.log(error);
            res.render("./admin/jump",{message:"添加失败",url:"/admin/addRoles"});
        }else{
            res.render("./admin/jump",{message:"添加成功",url:"/admin/addRoles"});
        }
    });
});


/* ---------------方向--------------*/
//查看方向
router.get("/addEast",function (req,res) {
    connect.query("select * from direction ",function (error,result) {
        if(error){
            console.log(error);
            res.end();
        }else {
            if(result){
                res.render("./admin/addEast",{result:result});
            }else{
                res.render("./admin/addEast",{result:"[{dname:'暂无方向'}]"});
            }
        }
    });
});
//添加方向
router.get("/addDirection",function (req,res) {
    var dname=req.query.dname;
    connect.query("insert into direction (dname) values ('"+dname+"')",function (error,result) {
        if(error){
            console.log(error);
            res.render("./admin/jump",{message:"添加失败",url:"/admin/addEast"});
        }else{
            res.render("./admin/jump",{message:"添加成功",url:"/admin/addEast"});
        }
    });
});
//管理方向
router.get("/adminEast",function (req,res) {
    connect.query("select dname,did from direction",function (error,result) {
        if(error){
            console.log(error);
            res.render("./admin/adminEast");
        }else{
            res.render("./admin/adminEast",{result:result});
        }

    });
});
//删除方向
router.get("/delDirection",function (req,res) {
    var did=req.query.did;
    connect.query("delete from direction where did="+did,function (error,result) {
        if(error){
            console.log(error);
            res.render("./admin/jump",{message:"删除失败",url:"/admin/adminEast"});
        }else{
            res.render("./admin/jump",{message:"删除成功",url:"/admin/adminEast"});
        }
    });
});
//编辑方向
router.get("/changeDirection",function (req,res) {
    var did=req.query.did;
    connect.query("select did,dname from direction where did="+did,function (error,result) {
        if(error){
            console.log(error);
            res.render("./admin/jump",{message:"查询错误",url:"/admin/adminEast"});
        }else{
            res.render("./admin/changeDirection",{result:result});
        }

    })
});
//方向编辑提交
router.get("/changedDir",function (req,res) {
    var did=req.query.did;
    var dname=req.query.dname;
    console.log(dname,did);
    connect.query("update direction set dname='"+dname+"' where did="+did,function (error,result) {
        if(error){
            console.log(error);
            res.render("./admin/jump",{message:"修改错误",url:"/admin/changeDirection?did="+did});
        }else{
            res.render("./admin/jump",{message:"修改成功",url:"/admin/changeDirection?did="+did});
        }
    });
})
/* ---------------阶段--------------*/
router.get("/moment",function (req,res) {
    connect.query("select did,dname from direction",function (error,result) {
        if(error){
            console.log(error);
            res.end();
        }else{
            if(!result){
              var  result=[{did:0,dname:"请先添加方向"}];
            }
            res.render("./admin/moment",{result:result});
        }
    });
});
//添加阶段
router.get("/addStage",function (req,res) {
    var stname=req.query.stname;
    var did=req.query.did;
    console.log(stname,did);
    connect.query("insert into stage (stname,did) values ('"+stname+"' , '"+did+"')",function (error,result) {
        if(error){
            console.log(error);
            res.render("./admin/jump",{message:"添加失败",url:"/admin/moment"});
        }else{
            res.render("./admin/jump",{message:"添加成功",url:"/admin/moment"});
        }

    });
});
//管理阶段
router.get("/editMoment",function (req,res) {
    connect.query("select stname,did,stid from stage",function (error,result) {
        if(error){
            console.log(error);
            res.end();
        }else{
            if(!result){
                var result=[{stname:"暂无",sid:0}];
            }
            res.render("./admin/editStage",{result:result});
        }
    });
});

//删除阶段
router.get("/delStage",function (req,res) {
    var stid=req.query.stid;
    connect.query("delete from stage where stid="+stid,function (error,result) {
        if(error){
            console.log(error);
            res.render("./admin/jump",{message:"删除失败",url:"/admin/moment"});
        }else{
            res.render("./admin/jump",{message:"删除成功",url:"/admin/moment"});
        }
    });

});
//编辑阶段
router.get("/changeStage",function (req,res) {
    var stid=req.query.stid;
    connect.query("select stid,stname from stage where stid="+stid,function (error,result) {
        if(error){
            console.log(error);
            res.render("./admin/jump",{message:"查询错误",url:"/admin/moment"});
        }else{
            res.render("./admin/changeStage",{result:result});
        }

    });
});
router.get("/changedSt",function (req,res) {
    var stid=req.query.stid;
    var stname=req.query.stname;

    connect.query("update stage set stname='"+stname+"' where stid="+stid,function (error,result) {
        if(error){
            console.log(error);
            res.render("./admin/jump",{message:"修改错误",url:"/admin/changeStage?stid="+stid});
        }else{
            res.render("./admin/jump",{message:"修改成功",url:"/admin/changeStage?stid="+stid});
        }
    });
});
/*======老师管理=======*/

module.exports = router;

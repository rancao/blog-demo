var blogDao = require("../dao/BlogDao");
var tagDao = require("../dao/TagsDao");
var tagBlogMappingDao = require("../dao/TagBlogMappingDao");
var timeUtil = require("../util/TimeUtil");
var respUtil = require("../util/RespUtil");
var url = require("url");

var path = new Map();

//查询最新热门文档
function queryHotBlog(request,response){
    blogDao.queryHotBlog(5,function(result){
        response.writeHead("200");
        response.write(respUtil.writeResult("success","查询成功",result));
        response.end();
    })
}
path.set("/queryHotBlog",queryHotBlog);

//查询所有Blog文档
function queryAllBlog(request,response){
    blogDao.queryAllBlog(function(result){
        response.writeHead("200");
        response.write(respUtil.writeResult("success","查询成功",result));
        response.end();
    })
}
path.set("/queryAllBlog",queryAllBlog);

//获取博客详细文章细腻
function queryBlogById(request,response){
    var params = url.parse(request.url,true).query;
    blogDao.queryBlogById(parseInt(params.bid),function(result){
        response.writeHead("200");
        response.write(respUtil.writeResult("success","查询成功",result));
        response.end();
    blogDao.addViews(parseInt(params.bid),function(){})
    })
}
path.set("/queryBlogById",queryBlogById);

//获取页码信息
function queryBlogCount(request,response){
    blogDao.queryBlogCount(function(result){
        response.writeHead("200");
        response.write(respUtil.writeResult("success","查询成功",result));
        response.end();
    })
}
path.set("/queryBlogCount",queryBlogCount);

//通过页码获取博客内容信息
function queryBlogByPage(request,response){
    var params = url.parse(request.url,true).query;
    blogDao.queryBlogByPage(parseInt(params.page),parseInt(params.pageSize),function(result){
      //转图片
        for(var i = 0; i<result.length; i++){
            result[i].content = result[i].content.replace(/<img[\w\W]*">/g,"");
            result[i].content = result[i].content.replace(/<[\w\W]{1,5}>/g,"");
            result[i].content = result[i].content.substring(0,300);
        }
        response.writeHead("200");
        response.write(respUtil.writeResult("success","查询成功",result));
        response.end();
    })
}
path.set("/queryBlogByPage",queryBlogByPage);

//编辑博客，提交写入数据库
function editBlog(request,response){
    var params = url.parse(request.url,true).query;
    var tags = params.tags.replace(/ /g,"").replace("，",",");
    console.log(params,tags)
    request.on("data",function(data){
        blogDao.insertBlog(params.title,data.toString(),tags,0,timeUtil.getNow(),timeUtil.getNow(),function(result){
            response.writeHead(200);
            response.write(respUtil.writeResult("success","添加成功",null));
            response.end();
            var blogId = result.insertId;
            var tagList = tags.split(",");
            for(var i=0; i<tagList.length;i++){
                if(tagList[i] == ""){
                    continue;
                }
                queryTag(tagList[i],blogId);
            }
        })
    })
}
path.set("/editBlog",editBlog);

//获取博客文章标签信息
function queryTag(tag,blogId){
    tagDao.queryTag(tag,function(result){
        if(result == null || result == 0){
            insertTag(tag,blogId);
        }else{
            tagBlogMappingDao.insertTagBlogMapping(result[0].id,blogId,timeUtil.getNow(),timeUtil.getNow(),function(result){});
        }
    })
}

function insertTag(tag,blogId){
    tagDao.insertTag(tag,timeUtil.getNow(),timeUtil.getNow(),function(result){
        insertTagBlogMapping(result.insertId,blogId)
    })
}

function insertTagBlogMapping(tagId,blogId){
    tagBlogMappingDao.insertTagBlogMapping(tagId,blogId,timeUtil.getNow(),timeUtil.getNow(),function(result){})
}

module.exports.path = path;
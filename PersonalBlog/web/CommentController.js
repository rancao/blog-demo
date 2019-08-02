var commentDao = require("../dao/CommentDao");
var timeUtil = require("../util/TimeUtil");
var respUtil = require("../util/RespUtil");
var url = require("url");
var captcha = require("svg-captcha");

var path = new Map();


function addComment(request,response){
   var params = url.parse(request.url,true).query; 
   console.log(params);
   commentDao.insertComment(parseInt(params.bid),parseInt(params.parent),params.parentName,params.userName,params.email,params.content,timeUtil.getNow(),timeUtil.getNow(),function(result){
        response.writeHead("200");
        response.write(respUtil.writeResult("success","评论成功",null));
        response.end();
   })
}

path.set("/addComment",addComment);

//生成验证码
function queryRandomCode(request,response){
   var img = captcha.create({
      fontSize:50,
      width:100,
      height:34
   });
   console.log(img);
   response.writeHead("200");
   response.write(respUtil.writeResult("success","验证码获取成功",img));
   response.end();
}

path.set("/queryRandomCode",queryRandomCode);

//读取评论
function queryCommentsByBlogId(request,response){
   var params = url.parse(request.url,true).query;
   commentDao.queryCommentsByBlogId(parseInt(params.bid),function(result){
      response.writeHead("200");
      response.write(respUtil.writeResult("success","评论加载成功",result));
      response.end();
   })
   
}

path.set("/queryCommentsByBlogId",queryCommentsByBlogId);

//读取评论数量
function queryCommentsCountByBlogId(request,response){
   var params = url.parse(request.url,true).query;
   commentDao.queryCommentsCountByBlogId(parseInt(params.bid),function(result){
      response.writeHead("200");
      response.write(respUtil.writeResult("success","评论加载成功",result));
      response.end();
   })
   
}

path.set("/queryCommentsCountByBlogId",queryCommentsCountByBlogId);

//读最新评论
function queryNewComments(request,response){
   commentDao.queryNewComments(5,function(result){
      response.writeHead("200");
      response.write(respUtil.writeResult("success","评论加载成功",result));
      response.end();
   })
   
}

path.set("/queryNewComments",queryNewComments);


module.exports.path = path;
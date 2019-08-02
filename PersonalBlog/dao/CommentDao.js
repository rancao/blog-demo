var dbutil = require("./DBUtil")

function insertComment(blogId,parent,parentName,userName,email,comments,ctime,utime,success){
    console.log(1);
    var insertSql = "insert into comments (`blog_id`,`parent`,`parent_name`,`user_name`,`email`,`comments`,`ctime`,`utime`) values (?,?,?,?,?,?,?,?)";
    console.log(2);
    var params = [blogId,parent,parentName,userName,email,comments,ctime,utime];
    
    var connection = dbutil.createConnection();
    connection.connect();
    console.log(3);
    connection.query(insertSql,params,function (error,result){
        if(error == null){
            success(result);
        }else{
            console.log(error);
        }       
    });
    connection.end();
};

function queryCommentsByBlogId(BlogId,success){
    var querySql = "select * from comments where blog_id = ?";
    var params = [BlogId];

    var connection = dbutil.createConnection();
    connection.connect();
    connection.query(querySql,params,function (error,result){
        if(error == null){
            success(result);
        }else{
            console.log(error);
        }       
    });
    connection.end();
};

function queryCommentsCountByBlogId(BlogId,success){
    var querySql = "select count(1) as count from comments where blog_id = ?";
    var params = [BlogId];

    var connection = dbutil.createConnection();
    connection.connect();
    connection.query(querySql,params,function (error,result){
        if(error == null){
            success(result);
        }else{
            console.log(error);
        }       
    });
    connection.end();
};

function queryNewComments(size,success){
    var querySql = "select * from comments order by id desc limit ?";
    var params = [size];

    var connection = dbutil.createConnection();
    connection.connect();
    connection.query(querySql,params,function (error,result){
        if(error == null){
            success(result);
        }else{
            console.log(error);
        }       
    });
    connection.end();
};

module.exports.insertComment = insertComment;
module.exports.queryCommentsByBlogId = queryCommentsByBlogId;
module.exports.queryCommentsCountByBlogId = queryCommentsCountByBlogId;
module.exports.queryNewComments = queryNewComments;

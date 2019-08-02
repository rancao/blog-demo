var randomTags = new Vue({
    el:"#random_tags",
    data:{
        tags:[]
    },
    computed:{
        randomColor:function(){
            return function(){
                var red = Math.random()*255;
                var green = Math.random()*255;
                var blue = Math.random()*255;
                return "rgb(" +red+","+blue+","+green+")";
            }
        },
        randomSize:function(){
            return function(){
                var size = (Math.random()*16+12)+"px";
                return size
            }
        }
    },
    created:function(){
        axios({
            method: "get",
            url: "queryRandomTags"
        }).then(function(resp){
            var result= [];
            for(var i=0;i<resp.data.data.length;i++ ){
                result.push({text:resp.data.data[i].tag,link:"/?tag="+resp.data.data[i].tag})
            }
            randomTags.tags = result;
        })
    }
})

var newHot = new Vue({
    el:"#new_hot",
    data:{
        titleList:[],
    },
    created:function(){
        axios({
            method: "get",
            url: "queryHotBlog"
        }).then(function(resp){
            var result = [];
            for(var i = 0; i < resp.data.data.length;i++){
                var temp = {};
                temp.title = resp.data.data[i].title;
                temp.link = "/blog_detail.html?bid="+ resp.data.data[i].id;
                result.push(temp);
            }
            newHot.titleList = result;
        })
    }
})

var newComments = new Vue({
    el:"#new_comments",
    data:{
        commentList:[
        {
            name:"这是用户名",date:"2019-07-06",comment:"抱歉，由于种种原因本站不再链接至贵网站"
        },
        {
            name:"这是用户名",date:"2019-07-06",comment:"抱歉，由于种种原因本站不再链接至贵网站"
        },
        {
            name:"这是用户名",date:"2019-07-06",comment:"抱歉，由于种种原因本站不再链接至贵网站"
        },
        {
            name:"这是用户名",date:"2019-07-06",comment:"抱歉，由于种种原因本站不再链接至贵网站"
        },
    ]},
    created:function(){
        axios({
            method: "get",
            url: "queryNewComments"
        }).then(function(resp){
            var result = [];
            for(var i = 0; i < resp.data.data.length;i++){
                var temp = {};
                temp.name = resp.data.data[i].user_name;
                temp.date = resp.data.data[i].ctime;
                temp.comment = resp.data.data[i].comments;
                result.push(temp);
            }
            newComments.commentList = result;
        })
    }

})
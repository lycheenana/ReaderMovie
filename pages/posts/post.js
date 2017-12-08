var localDatabase= require("../../data/posts-data.js");
Page(
  {
  /**
   * 页面的初始数据
   */
  data: {
    
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function () {         
    },
    onShow: function () {
      this.viewNumMonitor();
    },
    viewNumMonitor:function(){
      var posts_key = localDatabase.posts_list;
      var viewNums = wx.getStorageSync("view_nums");
      //初始化viewNums数组
      if (!viewNums) {
        var viewNums = [];
        for(var i=0;i<posts_key.length;i++){
          viewNums.push(0)
        }
        wx.setStorageSync("view_nums", viewNums)
      }
      //将缓存记录绑定到数据库中，实现页面渲染
      for (var idx in posts_key) {
        posts_key[idx].view_num = viewNums[idx];
      }
      this.setData({
        posts_key: posts_key
      });
    }, 
    onPostTap:function(event){
      var postId=event.currentTarget.dataset.postid;      
      wx.navigateTo({
        url: 'post-detail/post-detail?id='+postId
      });
      //缓存页面浏览次数
      var viewNums = wx.getStorageSync("view_nums");
      viewNums[postId]++; 
      wx.setStorageSync("view_nums", viewNums);
    },
    
    onSwiperTap:function(event){
      //target和currentTarget
      //target指的是当前点击的组件，currentTarget指的是事件捕获的组件
      //target这里指的是image,而currentTarget指的是swiper
      var postId=event.target.dataset.postid;
      wx.navigateTo({
        url:'post-detail/post-detail?id='+postId
      })
      
    }
  }
)
  


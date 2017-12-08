var localDatabase = require("../../../data/posts-data.js");
var app=getApp();

Page(
  {
    data: {
      isPlayingMusic: false,
    },
    onLoad: function (option) {
      //获取当前打开页面的id
      var postId = option.id;
      this.setData({
        currentPostId: postId
      })

      //从posts-data中获取当前页面数据，并写入data中，从而实现静态页面
      var postDetail = localDatabase.posts_list[postId];
      this.setData({
        detail: postDetail
      })

      //收藏文章功能
      //创建一个数组用来存储每个页面是否收藏，初次进入页面时
      
      var postsCollected = wx.getStorageSync('posts_collected')
      if (postsCollected) {        
        var postCollected = postsCollected[postId]
        this.setData({
          collected: postCollected
        })
      } else {
        var postsCollected = []
        postsCollected[postId] = false;
        wx.setStorageSync("posts_collected", postsCollected)
      }
            
      //判断进入页面时isPlayingMusic是否为true
      if (app.globalData.g_isPlayingMusic === true && app.globalData.g_playingMusicPostId ===postId){
        this.setData({
          isPlayingMusic: true
        })
      }
       this.setMusicMonitor();      
    },

    //监听音乐是否在播放
    setMusicMonitor:function(){
      var that=this;
      wx.onBackgroundAudioPlay(function () {
        that.setData({
          isPlayingMusic: true
        });
        app.globalData.g_playingMusicPostId = that.data.currentPostId;
        app.globalData.g_isPlayingMusic = true
      }),
        wx.onBackgroundAudioPause(function () {
          that.setData({
            isPlayingMusic: false
          });
          app.globalData.g_isPlayingMusic = false
        }),
        wx.onBackgroundAudioStop(function () {
          that.setData({
            isPlayingMusic: false
          });
          app.globalData.g_isPlayingMusic = false
        })
    },

    //收藏事件
    onCollectionTap: function () {
      //同步
      this.getpostsCollectedSync();
      
      //异步
      //this.getpostsCollected();
    },

    //同步缓存数据
    getpostsCollectedSync: function () {
      var postsCollected = wx.getStorageSync('posts_collected');
      var postCollected = postsCollected[this.data.currentPostId];

      //postCollected值取反
      postCollected = !postCollected;

      //把当前postedCollected的值更新到数组中
      postsCollected[this.data.currentPostId] = postCollected;
      
      wx.setStorageSync("posts_collected", postsCollected)
      this.setData({
        collected: postCollected
      })
      //this.showModal(postsCollected, postCollected)
      this.showToast(postsCollected, postCollected)
      
      
    },

    //异步缓存数据
    getpostsCollected: function () {
      var that = this;
      wx.getStorage({
        key: "posts_collected",
        success: function (res) {
          var postsCollected = res.data;
          var postCollected = postsCollected[that.data.currentPostId];

          //postCollected值取反
          postCollected = !postCollected;

          //更新当前页面的是否收藏的数据缓存      
          postsCollected[that.data.currentPostId] = postCollected;
          //this.showModal(postsCollected, postCollected)
          that.showToast(postsCollected, postCollected)

        }
      })
    },

    //收藏按钮的两种展示方式
    showModal: function (postsCollected, postCollected) {
      var that = this;
      wx.showModal({
        title: "收藏",
        content: postCollected ? "收藏该文章？" : "取消收藏该文章？",
        showCancel: true,
        cancelText: "取消",
        cancelColor: "#666",
        confirmText: "确定",
        confirmColor: "#abd",
        success: function (res) {
          if (res.confirm) {
            //把更新后的数组存储起来
            wx.setStorageSync('posts_collected', postsCollected);

            //把数组写入data中
            that.setData({
              collected: postCollected
            })
          }
        }
      })

    },
    showToast: function (postsCollected, postCollected) {
      //把更新后的数组存储起来
      wx.setStorageSync('posts_collected', postsCollected);

      //把数组写入data中
      this.setData({
        collected: postCollected
      })
      wx.showToast({
        title: postCollected ? "收藏成功" : "取消成功",
        duration: 1000,
        icon: "success"

      })
    },

    //分享事件
    onShareTap: function () {
      var itemList = [
        "分享给微信好友",
        "分享到朋友圈",
        "分享到QQ",
        "分享到微博"
      ]
      wx.showActionSheet({
        itemList: itemList,
        itemColor: "#405f80",
        success: function (res) {
          wx.showModal({
            //res.cancel用户是不是点击了取消按钮
            //res.tapIndex数组元素的序号，从0开始
            title: "用户" + itemList[res.tapIndex],
            content: "用户" + res.cancel + "取消了分享按钮"
          })
        }

      })
    },

    //音乐播放事件
    onMusicTap: function (event) {
      var isPlayingMusic = this.data.isPlayingMusic;
      var currentPostId = this.data.currentPostId;
      var postData = localDatabase.posts_list[currentPostId];
      this.setData({
        postData: postData
      })
      if (isPlayingMusic) {
        wx.pauseBackgroundAudio();
        this.setData({
          isPlayingMusic: false
        })
      } else {
        wx.playBackgroundAudio({
          dataUrl: postData.music.url,
          title: postData.music.title,
          coverImgUrl: postData.music.coverImg
        });
        this.setData({
          isPlayingMusic: true
        })
      }



    }


  }
)
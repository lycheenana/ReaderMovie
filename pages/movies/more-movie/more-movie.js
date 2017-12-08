var app = getApp();
var util = require("../../../utils/util.js");
Page({
  data: {
    totalCount:0
  },
  onLoad: function (options) {
    var category = options.category;
    this.setData({
      navigateTitle: category
    })
    var dataUrl = '';
    switch (category) {
      case "正在热映":
        dataUrl = app.globalData.doubanBase + "/v2/movie/in_theaters";
        break;
      case "即将上映":
        dataUrl = app.globalData.doubanBase + "/v2/movie/coming_soon";
        break;
      case "豆瓣top250":
        dataUrl = app.globalData.doubanBase + "/v2/movie/top250";
        break;
    }
    this.setData({
      dataUrl:dataUrl
    })   
    util.http(dataUrl, this.processDoubanData);
  },
  
  onMovieTap: function (event) {
    var movieId = event.currentTarget.dataset.movieid;
    wx.navigateTo({
      url: "../movie-detail/movie-detail?id=" + movieId
    })
  },
  // onScrollLower: function () {
  //   var requestUrl = this.data.dataUrl + "?start="+this.data.totalCount+"&count=20";
  //   console.log(requestUrl)  
  //   util.http(requestUrl, this.processDoubanData);
  //   wx.showNavigationBarLoading()
  // },
  onReachBottom:function(){
    var requestUrl = this.data.dataUrl + "?start=" + this.data.totalCount + "&count=20";
    util.http(requestUrl, this.processDoubanData);
    wx.showNavigationBarLoading()
  },
  onPullDownRefresh:function(event){
    var refreshUrl = this.data.dataUrl+"?star=0&count=20";
    this.setData({
      movies:{},
      totalCount:0
    })
    util.http(refreshUrl,this.processDoubanData);
    wx.showNavigationBarLoading();
  },
  processDoubanData: function (moviesDouban) {
    var movies = [];
    for (var idx in moviesDouban.subjects) {
      var subject = moviesDouban.subjects[idx];
      var title = subject.title;
      var average = subject.rating.average;
      var coverImg = subject.images.large;
      if (title.length >= 6) {
        title = title.substring(0, 6) + "...";
      }
      var temp = {
        title: title,
        average: average,
        coverImg: coverImg,
        subjectId: subject.id,
        stars: util.convertToStarsArray(subject.rating.stars)
      }
      movies.push(temp)
    }
    //如果要绑定新加载的数据，那么需要同旧有数据合并到一起
    var totalMovies;
    if(this.data.totalCount==0){     
      totalMovies=movies
    }else{
      totalMovies = this.data.movies.concat(movies)   
    }
    this.setData({ movies: totalMovies })    
    this.data.totalCount+=20;
    wx.hideNavigationBarLoading();
    wx.stopPullDownRefresh()
  },
  onReady: function (event) {
    wx.setNavigationBarTitle({
      title: this.data.navigateTitle,
    })
  }


})
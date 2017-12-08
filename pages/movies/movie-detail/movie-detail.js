import {Movie} from "class/Movie.js";
var app = getApp();
Page({
  data: {
    movie: {}
  },
  onLoad: function (options) {
    //页面初始化，options为页面跳转带来的参数
    var movieId = options.id;
    var detailUrl = app.globalData.doubanBase + "/v2/movie/subject/" + movieId;
    var movie = new Movie(detailUrl);
    var that=this;
    movie.getMovieData(function(movie){
      that.setData({
        movie:movie
      })
    })
  },
  onViewImage: function (e) {
    var src=e.currentTarget.dataset.src;
    wx.previewImage({
      urls: [src],
    })
  },
  // processDoubanData: function (data) {
  //   if (!data) {
  //     return;
  //   }
  //   var movie = {
  //     movieImg: data.images ? data.images.large : "",
  //     country: data.countries[0],
  //     title: data.title,
  //     originalTitle: data.original_title,
  //     wishCount: data.wish_count,
  //     commentCount: data.comments_count,
  //     year: data.year,
  //     genres: data.genres.join("、"),
  //     stars: util.convertToStarsArray(data.rating.stars),
  //     score: data.rating.average,
  //     director: data.directors[0] ? data.directors[0].name : "",
  //     casts: util.convertToCastString(data.casts),
  //     castsInfo: util.convertToCastInfo(data.casts),
  //     summary: data.summary
  //   }
  //   this.setData({
  //     movie: movie
  //   })
  // }
})

var util=require("../../../../utils/util.js");
class Movie{
  constructor(url){
    this.url=url
  }
  getMovieData(cb){
    this.cb=cb;
    util.http(this.url,this.processDoubanData.bind(this))
  }
  processDoubanData(data){
    if (!data) {
      return;
    }
    var movie = {
      movieImg: data.images ? data.images.large : "",
      country: data.countries[0],
      title: data.title,
      originalTitle: data.original_title,
      wishCount: data.wish_count,
      commentCount: data.comments_count,
      year: data.year,
      genres: data.genres.join("、"),
      stars: util.convertToStarsArray(data.rating.stars),
      score: data.rating.average,
      director: data.directors[0] ? data.directors[0].name : "",
      casts: util.convertToCastString(data.casts),
      castsInfo: util.convertToCastInfo(data.casts),
      summary: data.summary
    }
    this.cb(movie)
  }
}
export {Movie}
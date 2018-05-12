const gulp          = require('gulp');
const browserSync   = require('browser-sync');
const sass          = require('gulp-sass');
const html          = require('gulp-html');
var nunjucksRender  = require('gulp-nunjucks-render');
const webpack       = require('webpack');
const webpackStream = require('webpack-stream');
const webpackConfig = require('./webpack.config.js');

gulp.task('nunjucks', function () {
    return gulp.src('src/views/**/*.+(html|nunjucks)')
    // Renders template with nunjucks
    .pipe(nunjucksRender({
          path: ['src/templates/']
    }))
    // output files
    .pipe(gulp.dest('public'))
    .pipe(browserSync.stream());
});

//compile sass 
gulp.task('sass', function(){
    return gulp.src(['src/assets/sass/app.scss'])
      .pipe(sass())
      .pipe(gulp.dest('public/css'))
      .pipe(browserSync.stream());
});

gulp.task('js', () => {
    gulp.src('src/assets/js/app.js')
      .pipe(webpackStream(webpackConfig), webpack)
      .pipe(gulp.dest('public/js'));
  });
//Watch & Serve 
gulp.task('serve', ['nunjucks', 'sass', 'js'], function(){
    browserSync.init({
        server: './public'
    })
    gulp.watch(['src/assets/sass/**/*.scss'], ['sass']);
    gulp.watch(['src/assets/js/**/*.js'], ['js']).on('change', browserSync.reload);
    gulp.watch(['src/views/**/*.html', 'src/templates/**/*.html'], ['nunjucks']);
});

//default 
gulp.task('default', ['serve']);
const gulp          = require('gulp');
const browserSync   = require('browser-sync');
const sass          = require('gulp-sass');
const html          = require('gulp-html');
var nunjucksRender  = require('gulp-nunjucks-render');
const webpack       = require('webpack');
const webpackStream = require('webpack-stream');
const webpackConfig = require('./webpack.config.js');

//Gulp v4
function nunjucks(){
    return gulp.src('src/views/**/*.+(html|nunjucks)')
    .pipe(nunjucksRender({
          path: ['src/templates/']
    }))
    .pipe(gulp.dest('public'))
    .pipe(browserSync.stream());
}
function styles(){
    return gulp.src('src/assets/sass/app.scss')
    .pipe(sass())
    .pipe(gulp.dest('public/css'))
    .pipe(browserSync.stream());
}

function scripts(){
    return gulp.src('src/assets/js/app.js')
    .pipe(webpackStream(webpackConfig), webpack)
    .pipe(gulp.dest('public/js'));
}

function watch(){
    browserSync.init({
        server: './public'
    });
    gulp.watch(['src/assets/sass/**/*.scss'], styles).on('change', browserSync.reload);
    gulp.watch(['src/assets/js/**/*.js'], scripts).on('change', browserSync.reload);
    gulp.watch(['src/views/**/*.html', 'src/templates/**/*.html'], nunjucks);
}

var build = gulp.series(gulp.parallel(styles, scripts, nunjucks));

exports.nunjucks = nunjucks;
exports.styles = styles;
exports.scripts = scripts;
exports.watch = watch;
exports.default = build;


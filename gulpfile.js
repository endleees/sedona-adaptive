const browser = require('browser-sync');
const htmlmin = require('gulp-htmlmin');
const gulp = require("gulp"); 
const sass = require("gulp-dart-sass");
const del = require("del");
const sourcemaps = require ('gulp-sourcemaps');
const squoosh = require ('gulp-libsquoosh');
const rename = require ('gulp-rename');

// Styles

const styles = () => {
    return gulp.src("source/sass/style.scss",{ sourcemaps: true })
        .pipe(sourcemaps.init())
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest('source/css', { sourcemaps: '.' }))
        .pipe(rename('style.min.css'))
        .pipe(gulp.dest("build/css/"))
        .pipe(browser.stream());
}
exports.styles = styles;

//Html

const html =()=>{
    return gulp.src('source/*.html')
    .pipe(htmlmin({collapseWhitespace:true}))
    .pipe(gulp.dest('build'));
}
exports.html = html;

//Images

const optimizeImage = () => {
  return gulp.src('source/img/**/*.{jpg,png,svg}')
  .pipe(squoosh())
  .pipe(gulp.dest('build/img'))
}

const copyImages=()=>{
  return gulp.src('source/img/**/*.{jpg,png}')
  .pipe(gulp.dest('build/img'))
}


//watcher

const watcher = () => {
    gulp.watch('source/sass/**/*.scss', gulp.series(styles));;
    gulp.watch('source/*.html').on('change', browser.reload);
    gulp.watch('source/sass/**/*.scss').on('change', browser.reload);
}

exports.watcher = watcher;

//clean

const clean = () => {
    return del('build');
};

exports.clean = clean;

// Server

const server = (done) => {
    browser.init({
      server: {
        baseDir: 'source'
      },
      cors: true,
      notify: false,
      ui: false,
    });
    done();
}

exports.server = server;

//reload

const reload = (done) => {
    browser.reload();
    done();
}

exports.reload = reload;

//Copy

const copy = (done) => {
    gulp.src([
      'source/fonts/*.{woff2,woff}',
      'source/*.ico',
      'source/img/**/*.{jpg,png,svg}',
    ], {
      base: 'source'
    })
      .pipe(gulp.dest('build'))
    done();
}

exports.copy = copy;


const source= gulp.series(
    clean,
    copy,
    optimizeImage,
    gulp.parallel(
    styles,
    html),gulp.series(server,watcher));
    exports.source = source;
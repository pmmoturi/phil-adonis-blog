const gulp = require('gulp')
const babel = require('gulp-babel')
const concat = require('gulp-concat')
const sass = require('gulp-sass')
const autoprefixer = require('gulp-autoprefixer');
const uglify = require('gulp-uglify')
const rename = require('gulp-rename')
const sourcemaps = require('gulp-sourcemaps')
const merge = require('merge2')

const paths = {
  nodePath: 'node_modules',
  stylesPath: 'assets/scss',
  jsPath: 'assets/js'
}

gulp.task('vendor-js', function () {
  const streamOne = gulp.src([
    paths.nodePath + '/jquery-slim/dist/jquery.slim.js',
    paths.nodePath + '/bootstrap/dist/js/bootstrap.bundle.js'
  ])
    .pipe(uglify().on('error', function () {
      console.log(err)
    }))

  const streamTwo = gulp.src([
    paths.nodePath + '/turbolinks/dist/turbolinks.js'
  ])

  return merge(streamOne,streamTwo)
    .pipe(concat('vendor-scripts.min.js'))
    .pipe(gulp.dest('public'))
})

gulp.task('custom-js', function () {
  return gulp.src([
    paths.jsPath + '/**/*.js'
  ])
    .pipe(sourcemaps.init())
    .pipe(babel({presets: ['@babel/preset-env']}))
    .pipe(concat('custom-scripts.js'))
    .pipe(gulp.dest('public'))
    .pipe(uglify().on('error', function (err) {
      console.log('Custom JS error', err)
  }))
    .pipe(rename({suffix: '.min'}))
    .pipe(gulp.dest('public'))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('public'))
})
gulp.task('styles', function () {
  return gulp.src([
    paths.nodePath + '/bootstrap/dist/css/bootstrap.css',
    paths.stylesPath + '/**/*.scss'
  ])
    .pipe(sourcemaps.init())
    .pipe(sass({
      outputStyle: 'compressed'
    }))
    .pipe(autoprefixer({
      Browserslist: ['last 2 versions'],
      cascade: false
    }))
    .pipe(concat('styles.css'))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('public'))
})

gulp.task('watch', function () {
  gulp.watch(paths.stylesPath + '/**/*.scss', gulp.series('styles'))
  gulp.watch(paths.jsPath + '/**/*.js', gulp.series('custom-js'))
})

gulp.task('default', gulp.parallel('watch', 'styles', 'custom-js', 'vendor-js'))



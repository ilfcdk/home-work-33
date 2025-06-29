const { src, dest, watch, series } = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const autoprefixer = require('gulp-autoprefixer');
const cleanCSS = require('gulp-clean-css');
const sourcemaps = require('gulp-sourcemaps');
const browserSync = require('browser-sync').create();


// Шлях до файлів
const files = {
  scssPath: 'src/scss/**/*.scss',
  htmlPath: 'src/*.html'
};

// Таск: компіляція SCSS у CSS
function scssTask() {
  return src(files.scssPath)
    .pipe(sourcemaps.init())
    .pipe(sass().on('error', sass.logError))
    .pipe(autoprefixer({
      cascade: false
    }))
    .pipe(cleanCSS({ compatibility: 'ie8' }))
    .pipe(sourcemaps.write('.'))
    .pipe(dest('dist/css'))
    .pipe(browserSync.stream());
}

// Таск: копіювання HTML
function htmlTask() {
  return src(files.htmlPath)
    .pipe(dest('dist'))
    .pipe(browserSync.stream());
}

// Таск: запуск BrowserSync
function watchTask() {
  browserSync.init({
    server: {
      baseDir: 'dist'
    }
  });
  watch([files.scssPath], scssTask);
  watch([files.htmlPath], htmlTask);
}

// Експортуємо таски
exports.default = series(
  scssTask,
  htmlTask,
  watchTask
);
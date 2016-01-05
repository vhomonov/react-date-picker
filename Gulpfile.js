var gulp  = require('gulp')
var file  = require('gulp-file')

gulp.task('copy-files', function(){
  gulp.src('./node_modules/react/dist/react.min.js')
   .pipe(gulp.dest('./'))
  gulp.src('./node_modules/react-dom/dist/react-dom.min.js')
   .pipe(gulp.dest('./'))
  gulp.src('./node_modules/moment/min/moment-with-locales.min.js')
    .pipe(gulp.dest('./'))
  gulp.src('./node_modules/react-date-picker/**')
    .pipe(gulp.dest('./react-date-picker/'))
})

gulp.task('default', ['copy-files'])

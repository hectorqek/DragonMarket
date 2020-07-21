const gulp = require('gulp'),
    sass = require('gulp-sass'),
    autoprefixer = require('gulp-autoprefixer');


gulp.task('sass', () => {
    gulp.src('src/assets/scss/style.scss')
        .pipe(autoprefixer({
            browsers: ['last 2 versions'],
            cascade: false
        }))
        .pipe(sass({
            includePaths: ['scss']
        }))
        .pipe(gulp.dest('src/assets/css'));
});
gulp.task('watch', ['sass'], () => {
    gulp.watch(["src/assets/scss/*.scss"], ['sass']);
}); 


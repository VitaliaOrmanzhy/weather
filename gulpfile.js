import gulp from 'gulp';
import gulpHTMLMin from 'gulp-htmlmin';
import gulpTerser from 'gulp-terser';
import * as sass from 'sass';
import gulpSass from 'gulp-sass';
import { deleteAsync } from 'del';
import gulpConnect from 'gulp-connect';

const resFolder = './dist';
const prevFolder = './src';

const copy = () => {
    return gulp.src([`${prevFolder}/*.*`, `!${prevFolder}/*.html`, `!${prevFolder}/*.js`, `!${prevFolder}/*.css`, `!${prevFolder}/*.scss`])
        .pipe(gulp.dest(resFolder))
        .pipe(gulpConnect.reload())
}

const html = () => {
    return gulp.src(`${prevFolder}/*.html`)
        .pipe(gulpHTMLMin({ collapseWhitespace: true }))
        .pipe(gulp.dest(resFolder))
        .pipe(gulpConnect.reload())
}

const script = () => {
    return gulp.src(`${prevFolder}/*.js`)
        .pipe(gulpTerser())
        .pipe(gulp.dest(resFolder))
        .pipe(gulpConnect.reload())
}

const sassProcessor = gulpSass(sass);

const scss = () => {
    return gulp.src(`${prevFolder}/*.scss`)
        .pipe(sassProcessor({ outputStyle: 'compressed'}))
        .pipe(gulp.dest(resFolder))
        .pipe(gulpConnect.reload())
}

const reset = () => {
    return deleteAsync(`${resFolder}`);
}

const watch = () => {
    gulp.watch(`${prevFolder}/*.html`, html);
    gulp.watch(`${prevFolder}/*.js`, script);
    gulp.watch(`${prevFolder}/*.scss`, scss);
    gulp.watch([`${prevFolder}/*.*`, `!${prevFolder}/*.html`, `!${prevFolder}/*.js`, `!${prevFolder}/*.scss`], copy)
}

const srv = () => {
    gulpConnect.server( {port: 8080, root: resFolder, 'livreload': true} )
}

const parallel = gulp.parallel(copy, html, script, scss, srv);
const launch = gulp.series(parallel, reset, watch);

gulp.task('default', launch);
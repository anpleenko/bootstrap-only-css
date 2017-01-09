'use strict';

import gulp            from 'gulp';
import runSequence     from 'run-sequence';
import perfectionist   from 'perfectionist';
import mqpacker        from "css-mqpacker";
import autoprefixer    from 'autoprefixer';
import gulpLoadPlugins from 'gulp-load-plugins';

const path = {
    src: {
        scss: ['./bootstrap/**/*.scss']
    },
    dest: {
        scss: 'dist'
    },
    watch: {
        scss: ['./bootstrap/**/*.scss']
    },
    PROCESSORS: [
        autoprefixer({ browsers: ['last 2 versions', '> 1%'] }),
        mqpacker
    ],
    sequence:{
        build: ['scss']
    }
}

let $ = gulpLoadPlugins({});

gulp.task('scss', (() =>
  gulp.src(path.src.scss)
    .pipe($.sass({
      includePaths: ['./node_modules/bootstrap-sass/assets/stylesheets/']
    }).on('error', $.notify.onError()))

    .pipe($.postcss(path.PROCESSORS))
    .pipe($.csso())
    .pipe($.postcss([perfectionist({})]))
    .pipe(gulp.dest(path.dest.scss))

    .pipe($.csso())
    .pipe($.rename({
        suffix: ".min"
    }))
    .pipe(gulp.dest("./dist"))
))

gulp.task('build', () => {runSequence(path.sequence.build)})

gulp.task('default', ['build'], () => {
  $.watch(path.watch.scss, () => gulp.start('scss'));
})

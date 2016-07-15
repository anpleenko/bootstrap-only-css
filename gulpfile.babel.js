/**
 * Команды для запуска проекта
 * gulp - основная команда, при запуске скомпилируются стили и html
 *
 * Так же есть флаги
 * --bem запустит gulp с компиляцией по bem нотации
 * запуск gulp --bem
 */

'use strict';

import gulp            from 'gulp';
import runSequence     from 'run-sequence';
import perfectionist   from 'perfectionist';
import mqpacker        from "css-mqpacker";
import autoprefixer    from 'autoprefixer';
import gulpLoadPlugins from 'gulp-load-plugins';

const env = {
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
  gulp.src(env.src.scss)
    .pipe($.sass({
      includePaths: ['bower_components/bootstrap-sass/assets/stylesheets/']
    }).on('error', $.notify.onError()))

    .pipe($.postcss(env.PROCESSORS))
    .pipe($.csso())
    .pipe($.postcss([perfectionist({})]))
    .pipe(gulp.dest(env.dest.scss))

    .pipe($.csso())
    .pipe($.rename({
        suffix: ".min"
    }))
    .pipe(gulp.dest("./dist"))
))

gulp.task('build', () => {runSequence(env.sequence.build)})

gulp.task('default', ['build'], () => {
  $.watch(env.watch.scss, () => gulp.start('scss'));
})

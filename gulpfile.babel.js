'use strict';

import gulp            from 'gulp';
import runSequence     from 'run-sequence';
import perfectionist   from 'perfectionist';
import mqpacker        from "css-mqpacker";
import autoprefixer    from 'autoprefixer';
import gulpLoadPlugins from 'gulp-load-plugins';

const path = {
    src: {
        scss: ['./src/dist/**/*.scss'],
        lib: ['./src/lib/**/*.scss']
    },
    dest: {
        scss: 'dist',
        lib: 'lib'
    },
    PROCESSORS: [
        autoprefixer({ browsers: ['last 2 versions', '> 1%'] }),
        mqpacker
    ],
    sequence:{
        build: ['dist', 'lib']
    },
    includePaths: ['./node_modules/bootstrap-sass/assets/stylesheets/']
}

let $ = gulpLoadPlugins({});

gulp.task('dist', (() =>
  gulp.src(path.src.scss)
    .pipe($.sass({includePaths: path.includePaths})
      .on('error', $.notify.onError()))

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

gulp.task('lib', (() =>
  gulp.src(path.src.lib)
    .pipe($.sass({includePaths: path.includePaths})
      .on('error', $.notify.onError()))

    .pipe($.postcss(path.PROCESSORS))
    .pipe($.csso())
    .pipe($.postcss([perfectionist({})]))
    .pipe(gulp.dest(path.dest.lib))

    .pipe($.csso())
    .pipe($.rename({
        suffix: ".min"
    }))
    .pipe(gulp.dest("./lib"))
))

gulp.task('build', () => {runSequence(path.sequence.build)})

gulp.task('default', ['build'], () => {
  $.watch(path.src.scss, () => gulp.start('dist'));
  $.watch(path.src.lib, () => gulp.start('lib'));
})

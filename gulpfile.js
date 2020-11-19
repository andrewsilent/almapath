var gulp = require('gulp'), //H
    htmlmin = require('gulp-htmlmin'), //E
    rigger = require('gulp-rigger'), //L
    autoprefixer = require('gulp-autoprefixer'), //P
    sass = require('gulp-sass'),
    sourcemaps = require('gulp-sourcemaps'), //M
    concat = require('gulp-concat'), //E
    uglify = require('gulp-uglify'),
    imagemin = require('gulp-imagemin'), //P
    jpegtran = require('imagemin-jpegtran'), //L
    optipng = require('imagemin-optipng'), //E
    browserSync = require('browser-sync'), //A
    clean = require('gulp-clean'), //S
    watch = require('gulp-watch'), //E
    reload = browserSync.reload;

var path = {
    build: {
        html: 'build/',
        js: 'build/js/',
        css: 'build/css/',
        img: 'build/img/',
        fonts: 'build/fonts/'
    },
    dev: {
        html: 'dev/*.html',
        templates: 'dev/templates/*.html',
        js: 'dev/js/*.js',
        sass: 'dev/sass/*.sass',
        cssOut: 'dev/css/*.css',
        cssIn: 'dev/css/',
        img: 'dev/img/**/*.*',
        fonts: 'dev/fonts/**/*.*'
    },
    watch: {
        html: 'dev/**/*.html',
        templates: 'dev/templates/*.html',
        js: 'dev/js/**/*.js',
        sass: 'dev/sass/*.sass',
        css: 'dev/css/*.css',
        img: 'dev/img/**/*.*',
        fonts: 'dev/fonts/**/*.*'
    },
    clean: './build/**/*'
};

var config = {
    server: {
        baseDir: "./build"
    },
    tunnel: true,
    host: 'localhost',
    port: 9000,
    logPrefix: "silent-running"
};

gulp.task('clean', function () {  
    return gulp.src(path.clean, {read: false})
        .pipe(clean());
});

gulp.task('run', ['clean'], function () {
    gulp.start('img');
    gulp.start('html');
    gulp.start('css');
    gulp.start('sass');
    gulp.start('js');
    gulp.start('fonts');
    gulp.start('watch');
    browserSync(config);
});

gulp.task('img', function () {
    gulp.src(path.dev.img) 
        .pipe(imagemin({
            progressive: true,
            optimizationLevel: 5
        }))
        .pipe(gulp.dest(path.build.img))
        .pipe(browserSync.stream());
});

gulp.task('html', function () {
    gulp.src(path.dev.html)
        .pipe(rigger())
        // .pipe(htmlmin({collapseWhitespace: true}))
        .pipe(gulp.dest(path.build.html))
        .pipe(browserSync.stream());
});

gulp.task('sass', function () {
    gulp.src(path.dev.sass)
        .pipe(sourcemaps.init())
        .pipe(sass({outputStyle: 'expanded'}).on('error', sass.logError))
        // .pipe(sourcemaps.write())
        .pipe(gulp.dest(path.dev.cssIn))
        .pipe(browserSync.stream());
});

gulp.task('css', function () {
    gulp.src(path.dev.cssOut)
        // .pipe(sourcemaps.init())
        .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
        .pipe(autoprefixer())
        // .pipe(sourcemaps.write())
        .pipe(gulp.dest(path.build.css))
        .pipe(browserSync.stream());
});

gulp.task('js', function () {
    gulp.src(path.dev.js) 
        .pipe(rigger()) 
        // .pipe(sourcemaps.init()) 
        // .pipe(uglify()) 
        // .pipe(sourcemaps.write()) 
        .pipe(gulp.dest(path.build.js))
        .pipe(browserSync.stream());
});

gulp.task('fonts', function() {
    gulp.src(path.dev.fonts)
        .pipe(gulp.dest(path.build.fonts))
        .pipe(browserSync.stream());
});

gulp.task('watch', function(){
    watch([path.watch.img], function(event, cb) {
        gulp.start('img');
    });
    watch([path.watch.html], function(event, cb) {
        gulp.start('html');
    });
    watch([path.watch.sass], function(event, cb) {
        gulp.start('sass');
    });
    watch([path.watch.css], function(event, cb) {
        gulp.start('css');
    });
    watch([path.watch.js], function(event, cb) {
        gulp.start('js');
    });
    watch([path.watch.fonts], function(event, cb) {
        gulp.start('fonts');
    });
});
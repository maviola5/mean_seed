var gulp = require('gulp'),
	sass = require('gulp-sass'),
	rename = require('gulp-rename'),
	notify = require('gulp-notify'),
	nodemon = require('gulp-nodemon'),
	livereload = require('gulp-livereload'),
	bower = require('gulp-bower'),
	inject = require('gulp-inject'),
	bowerFiles = require('main-bower-files'),
	uglify = require('gulp-uglify'),
	jshint = require('gulp-jshint'),
	autoprefixer = require('gulp-autoprefixer'),
	imagemin = require('gulp-imagemin'),
	cache = require('gulp-cache'),
	del = require('del'),
	livereload = require('gulp-livereload'),
	concat = require('gulp-concat'),
	sourcemaps = require('gulp-sourcemaps'),
	uglify = require('gulp-uglify'),
	ngAnnotate = require('gulp-ng-annotate');

gulp.task('bower', function(){
	return bower('./public/lib');
});

gulp.task('sass', function(){
	return gulp.src('./src/sass/app.sass')
	.pipe(sourcemaps.init())
	.pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
	.pipe(rename({suffix: '.min'}))
	.pipe(sourcemaps.write())
	.pipe(gulp.dest('./public/css'))
	.pipe(livereload())
	.pipe(notify("sass task completed!"));
});

gulp.task('js', function(){
	return gulp.src(['./app/app.js', 'app/**/*.js'])
	.pipe(sourcemaps.init())
	.pipe(concat('app.js'))
	.pipe(ngAnnotate())
	.pipe(uglify())
	.pipe(sourcemaps.write())
	.pipe(rename({suffix: '.min'}))
	.pipe(gulp.dest('./public/js'))
	.pipe(livereload())
	.pipe(notify("js task completed"));
});

gulp.task('inject', ['bower', 'sass', 'js'], function(){
	gulp.src('./app/index.html')
	.pipe(inject(gulp.src(bowerFiles({
		paths: {
	        bowerDirectory: './public/lib'
    	}
	}), {
		read : false
	}), {
		ignorePath : '/public', 
		name : 'bower'
	}))
	.pipe(inject(gulp.src([
		'./public/css/app.min.css',
		'./public/js/app.min.js'
		], {read : false}), {ignorePath : ['/public', '/app']}))
	.pipe(gulp.dest('./app'));
});

gulp.task('img', function(){
	return gulp.src('./src/img/*')
	.pipe(cache(imagemin({
		interlaced : true
	})))
	.pipe(gulp.dest('./public/img'))
	.pipe(livereload())
	.pipe(notify("img task completed"));
});

gulp.task('view', function(){
	return gulp.src('./app/**/*.html')
	.pipe(livereload())
	.pipe(notify("view task completed"));
});

gulp.task('watch', function(){
	livereload.listen();
	gulp.watch('./src/sass/**/*.sass', ['sass']);
	gulp.watch('./app/**/*.js', ['js']);
	gulp.watch('./src/img', ['img']);
	gulp.watch(['./app/*', './app/**/*'], ['view']);
});

gulp.task('default', ['inject', 'watch'], function(){
	nodemon({
		script: './bin/www'
	});
});
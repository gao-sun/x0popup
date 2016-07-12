var gulp = require('gulp'),
	minifyCss = require('gulp-minify-css'),
	concat = require('gulp-concat'),
	uglify = require('gulp-uglify'),
	header = require('gulp-header'),
	autoprefixer = require('gulp-autoprefixer');

var pkg = require('./package.json');
var headerString = '/* <%= pkg.name %> - v<%= pkg.version %> | <%= pkg.homepage %> */\n';

var paths = {
	js: 'src/js/*.*',
	css: 'src/css/*.*',
};

gulp.task('build', function() {
	gulp.src(paths.js)
		.pipe(uglify())
		.pipe(concat('x0popup.min.js'))
		.pipe(header(headerString, {pkg: pkg}))
		.pipe(gulp.dest('dist'));
	gulp.src(paths.css)
		.pipe(autoprefixer({
			browsers: ['> 5%'],
			cascade: false
		}))
		.pipe(minifyCss())
		.pipe(concat('x0popup.min.css'))
		.pipe(header(headerString, {pkg: pkg}))
		.pipe(gulp.dest('dist'));
});

gulp.task('default', ['build']);

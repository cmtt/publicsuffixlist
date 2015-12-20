var gulp = require('gulp');
var di = require('gulp-di')(gulp)
.provide('config', require('./config'))
.tasks('./build')
.resolve();

var gulp = require('gulp');
var di = require('gulp-di')(gulp, {
  scope: ['dependencies', 'devDependencies']
})
.provide('config', require('./config'))
.tasks('./build/tasks')
.modules('./build/modules')
.resolve();

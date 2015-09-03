var gulp = require('gulp');
var path = require('path');
var basePath = path.join.bind(path, __dirname);
var config = require(basePath('config'));
var tasks = require('require-dir')(basePath('build'));

for (var taskId in tasks) gulp.task(taskId, tasks[taskId](gulp, config));

require('dotenv').config();
require('./app/config/config');


// ==================== Import Dependencies ====================
const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');


const app = express();
const { getLoggedinUser, isLoggedIn } = require('./app/middlewares/auth-middleware');


// ==================== Configure View Engine ====================
app.set('views', path.join(__dirname, 'app/views'));
app.set('view engine', 'ejs');


// ==================== Built-in Middlewares ====================
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'storage')));
app.use(express.static(path.join(__dirname, 'app/views')));


// ==================== Routes ====================
app.use('*', getLoggedinUser);
app.use('/student', require('./app/routes/student'));
app.use('/teacher', require('./app/routes/teacher'));
app.use('/admin', require('./app/routes/admin'));
app.use('/auth', require('./app/routes/auth'));


// ==================== API Routes ====================
app.use(process.env.API_PREFIX, [
	require('./app/apis/auth/auth-endpoints'),
	require('./app/apis/students/student-endpoints'),
	require('./app/apis/teachers/teacher-endpoints'),
	require('./app/apis/notices/notice-endpoints'),
	require('./app/apis/exams/exam-endpoints')
]);


// ==================== Error Handler ====================
app.use((req, res, next) => next(createError(404)));

app.use(function (err, req, res, next) {
	res.locals.message = err.message;
	res.locals.error = req.app.get('env') === 'development' ? err : {};

	res.status(err.status || 500);
	res.render('error', {title: "Page Not Found"});
});


module.exports = app;
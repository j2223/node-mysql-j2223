const express = require('express');
const router = express.Router();
const knex = require('../knex');

router.get('/', function (req, res, next) {
  const isAuth = req.isAuthenticated();
  if (isAuth) {
    const userId = req.user.id;
    knex("tasks")
      .select("*")
      .where({user_id: userId})
      .then(function (results) {
        res.render('index', {
          title: 'ToDo App',
          todos: results,
          isAuth: isAuth,
        });
      })
      .catch(function (err) {
        console.error(err);
        res.render('index', {
          title: 'ToDo App',
          isAuth: isAuth,
          errorMessage: [err.sqlMessage],
        });
      });
  } else {
    res.render('index', {
      title: 'ToDo App',
      isAuth: isAuth,
    });
  }
});

router.post('/', function (req, res, next) {
  const isAuth = req.isAuthenticated();
  const userId = req.user.id;
  const todo = req.body.add;
  const startAt = req.body.start_at;
  const endAt = req.body.end_at;
  const priority = req.body.priority; // 追加

  knex("tasks")
    .insert({
      user_id: userId,
      content: todo,
      start_at: startAt,
      end_at: endAt,
      priority: priority // 追加
    })
    .then(function () {
      res.redirect('/')
    })
    .catch(function (err) {
      console.error(err);
      res.render('index', {
        title: 'ToDo App',
        isAuth: isAuth,
        errorMessage: [err.sqlMessage],
      });
    });
});

router.post('/delete', function (req, res, next) {
  const isAuth = req.isAuthenticated();
  const userId = req.user.id;
  const taskId = req.body.task_id;
  if (!isAuth) {
    return res.redirect('/signin');
  }
  knex("tasks")
    .where({ id: taskId, user_id: userId })
    .del()
    .then(function () {
      res.redirect('/');
    })
    .catch(function (err) {
      console.error(err);
      res.render('index', {
        title: 'ToDo App',
        isAuth: isAuth,
        errorMessage: [err.sqlMessage],
      });
    });
});

router.post('/edit', function (req, res, next) {
  const isAuth = req.isAuthenticated();
  const userId = req.user.id;
  const { task_id, content, start_at, end_at, priority } = req.body;
  if (!isAuth) {
    return res.redirect('/signin');
  }
  knex("tasks")
    .where({ id: task_id, user_id: userId })
    .update({
      content: content,
      start_at: start_at,
      end_at: end_at,
      priority: priority
    })
    .then(function () {
      res.redirect('/');
    })
    .catch(function (err) {
      console.error(err);
      res.render('index', {
        title: 'ToDo App',
        isAuth: isAuth,
        errorMessage: [err.sqlMessage],
      });
    });
});

router.use('/signup', require('./signup'));
router.use('/signin', require('./signin'));
router.use('/logout', require('./logout'));

module.exports = router;
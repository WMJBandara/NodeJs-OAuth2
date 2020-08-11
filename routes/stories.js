const express = require('express');
const router = express.Router();
const Story = require('../models/Story');
const {ensureAuth} = require('../middleware/auth');
//@desc Login/Landing page
//@route Get /
router.get('/add', ensureAuth, (req, res) => {
    res.render('stories/add');
});

//@desc Dashboard
//@route Get /dashboard
router.post('/', ensureAuth, async (req, res) => {
    try {
        req.body.user = req.user.id;
        await Story.create(req.body);
        res.redirect('/dashboard');
    } catch (error) {
        console.error(error);
        res.redirect('errors/500');
    }
});

//@desc Display stories
//@route Get /stories
router.get('/', async (req, res) => {
    try {
        const stories = await Story.find({status : 'public'})
        .populate('user')
        .sort({createAt : 'desc'})
        .lean();
        res.render('stories/index', {stories});
    } catch (err) {
        console.error(err);
        res.redirect('errors/500');
    }
});

// @desc    Show single story
// @route   GET /stories/:id
router.get('/:id', ensureAuth, async (req, res) => {
  try {
    let story = await Story.findById(req.params.id).populate('user').lean();

    if (!story) {
      return res.render('error/404');
    }

    res.render('stories/show', {
      story,
    });
  } catch (err) {
    console.error(err);
    res.render('error/404');
  }
});

//@desc Story/Edit
//@route Get /stories/edit/:id
router.get('/edit/:id', ensureAuth, async (req, res) => {
    try {
      const story = await Story.findOne({
        _id: req.params.id,
      }).lean();
  
      if (!story) {
        return res.render('error/404');
      }
  
      if (story.user != req.user.id) {
        res.redirect('/stories');
      } else {
        res.render('stories/edit', {
          story,
        });
      }
    } catch (err) {
      console.error(err);
      return res.render('error/500');
    }
  });

// @desc    Update story
// @route   PUT /stories/:id
router.put('/:id', ensureAuth, async (req, res) => {
  try {
    let story = await Story.findById(req.params.id).lean();

    if (!story) {
      return res.render('error/404');
    }

    if (story.user != req.user.id) {
      res.redirect('/stories');
    } else {
      story = await Story.findOneAndUpdate({ _id: req.params.id }, req.body, {
        new: true,
        runValidators: true,
      });
      res.redirect('/dashboard');
    }
  } catch (err) {
    console.error(err);
    return res.render('error/500');
  }
});

router.delete('/:id', ensureAuth, async (req, res) => {
  try {
    let story = await Story.findById(req.params.id).lean();

    if (!story) {
      return res.render('error/404');
    }

    if (story.user != req.user.id) {
      res.redirect('/stories');
    } else {
      story = await Story.remove({ _id: req.params.id });
      res.redirect('/dashboard');
    }
  } catch (err) {
    console.error(err);
    return res.render('error/500');
  }
});

// @desc    User stories
// @route   GET /stories/user/:userId
router.get('/user/:userId', ensureAuth, async (req, res) => {
  try {
    const stories = await Story.find({
      user: req.params.userId,
      status: 'public',
    })
      .populate('user')
      .lean();

    res.render('stories/index', {
      stories,
    });
  } catch (err) {
    console.error(err);
    res.render('error/500');
  }
});

module.exports = router;
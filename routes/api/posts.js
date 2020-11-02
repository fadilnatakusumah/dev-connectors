/**
    Base route = /posts
*/
const { check, validationResult } = require('express-validator')
const { Router, json } = require('express');

const auth = require('../../middlewares/auth');
const Post = require('../../models/Post');
const Profile = require('../../models/Profile');
const User = require('../../models/User');

const router = Router();

// @route POST /
// @desc create post
// @access Private
router.post('/', [
  auth,
  check('text', 'Text is required').notEmpty(),
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array()
    });
  }
  const { text } = req.body;

  try {
    const user = await User.findById(req.user.id).select('-password');
    const newPost = {
      text,
      name: user.name,
      avatar: user.avatar,
      user: req.user.id,
    }

    const post = new Post(newPost);
    await post.save();

    res.json({
      success: true,
      data: post,
    })
  } catch (error) {
    console.error("error", error)
    res.status(500).json({
      success: false,
      errors: [{ msg: "Server error" }]
    })
  }
});

// @route GET /
// @desc get all post
// @access Private
router.get('/', auth, async (req, res) => {
  try {
    const posts = await Post.find().sort({ date: -1 });

    res.json({
      success: true,
      data: posts,
    })
  } catch (error) {
    console.error("error", error)
    res.status(500).json({
      success: false,
      errors: [{ msg: "Server error" }]
    })
  }
});

// @route GET /:id_post
// @desc get single post
// @access Private
router.get('/:id_post', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id_post)
    // .populate('user', ['name, avatar']);

    if (!post) {
      return res.status(400).json({
        success: false,
        errors: [{ msg: "Post not found" }]
      });
    }
    res.json({
      success: true,
      data: post,
    })
  } catch (error) {
    console.error("error", error);

    if (error.kind === 'ObjectId') {
      return res.status(400).json({
        success: false,
        errors: [{ msg: "Post not found" }]
      });
    }
    res.status(500).json({
      success: false,
      errors: [{ msg: "Server error" }]
    })
  }
});

// @route DELETE /:id_post
// @desc delete post
// @access Private
router.delete('/:id_post', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id_post)

    if (!post) {
      return res.status(400).json({
        success: false,
        errors: [{ msg: "Post not found" }]
      });
    }

    if (`${post.user}` !== req.user.id) {
      return res.status(401).json({
        success: false,
        errors: [{ msg: "User not authorized" }]
      });
    }

    await post.remove();

    res.json({
      success: true,
      data: [{ msg: 'Post removed' }],
    });

  } catch (error) {
    console.error("error", error);

    if (error.kind === 'ObjectId') {
      return res.status(400).json({
        success: false,
        errors: [{ msg: "Post not found" }]
      });
    }
    res.status(500).json({
      success: false,
      errors: [{ msg: "Server error" }]
    })
  }
});

// @route PUT /like/:id
// @desc like a post
// @access Private
router.put('/like/:id_post', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id_post);

    // check if post still exist
    if (!post) {
      return res.status(400).json({
        success: false,
        errors: [{ msg: "Post not found" }]
      });
    }

    // check if this user already been like the post;
    const isLiked = post.likes.filter(like => like.user.toString() === req.user.id);
    if (isLiked.length > 0) {
      return res.status(400).json({
        success: false,
        errors: [{ msg: 'Post already liked' }]
      })
    }

    post.likes.unshift({ user: req.user.id });
    await post.save();

    res.json({
      success: true,
      data: post.likes,
    });

  } catch (error) {
    console.error("error", error);

    if (error.kind === 'ObjectId') {
      return res.status(400).json({
        success: false,
        errors: [{ msg: "Post not found" }]
      });
    }
    res.status(500).json({
      success: false,
      errors: [{ msg: "Server error" }]
    })
  }
});

// @route PUT /unlike/:id
// @desc unlike a post
// @access Private
router.put('/unlike/:id_post', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id_post);

    // check if post not exist
    if (!post) {
      return res.status(400).json({
        success: false,
        errors: [{ msg: "Post not found" }]
      });
    }

    // check if this user already been like the post;
    const isLiked = post.likes.filter(like => like.user.toString() === req.user.id);
    if (isLiked.length === 0) {
      return res.status(400).json({
        success: false,
        errors: [{ msg: 'Post has not been liked' }]
      })
    }

    const newLikes = post.likes.filter(like => like.user.toString() !== req.user.id);
    post.likes = newLikes;
    await post.save();

    res.json({
      success: true,
      data: post,
    });

  } catch (error) {
    console.error("error", error);

    if (error.kind === 'ObjectId') {
      return res.status(400).json({
        success: false,
        errors: [{ msg: "Post not found" }]
      });
    }
    res.status(500).json({
      success: false,
      errors: [{ msg: "Server error" }]
    })
  }
});


// @route POST /comment/:id
// @desc comment on post
// @access Private
router.post('/comment/:id', [
  auth,
  check('text', 'Text is required').notEmpty(),
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array()
    });
  }
  const { text } = req.body;

  try {
    const user = await User.findById(req.user.id).select('-password');
    const post = Post.findById(req.params.id);
    // check if post not exist
    if (!post) {
      return res.status(400).json({
        success: false,
        errors: [{ msg: "Post not found" }]
      });
    }

    const newComment = {
      text,
      name: user.name,
      avatar: user.avatar,
      user: req.user.id,
    };

    post.comments.unshift(newComment);
    await post.save();

    res.json({
      success: true,
      data: post.comments,
    });

  } catch (error) {
    console.error("error", error)
    res.status(500).json({
      success: false,
      errors: [{ msg: "Server error" }]
    })
  }
});



// @route DELETE /comment/:id/:comment_id
// @desc delete comment on post
// @access Private
router.delete('/comment/:id', auth, async (req, res) => {
  try {
    const post = Post.findById(req.params.id);

    // check if post not exist
    if (!post) {
      return res.status(400).json({
        success: false,
        errors: [{ msg: "Post not found" }]
      });
    }

    // get the comment
    const comment = Post.comments.find(({ id }) => id === req.params.comment_id);
    // check if comment not exist
    if (!comment) {
      return res.status(400).json({
        success: false,
        errors: [{ msg: "Comment not found" }]
      });
    }

    if (req.user.id !== comment.user.toString()) {
      return res.status(401).json({
        success: false,
        errors: [{ msg: "User not authorized" }]
      });
    }

    const newComments = post.comments.filter(comment => comment.user.toString() !== req.user.id);
    post.newComments = newComments;
    await post.save();
    
    res.json({
      success: true,
      data: post.comments,
    });

  } catch (error) {
    console.error("error", error)
    res.status(500).json({
      success: false,
      errors: [{ msg: "Server error" }]
    })
  }
});





module.exports = router;

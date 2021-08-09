const router = require("express").Router();
const { Post, User, Comment } = require("../models");
const withAuth = require("../utils/auth");

router.get("/", async (req, res) => {
  try {
    if (req.session.logged_in) {
      const postData = await Post.findAll({
        include: [
          {
            model: User,
          },
        ],
      });
      const homeUserData = await User.findByPk(req.session.user_id, {
        attributes: { exclude: ["password"] },
      });
      const home_user = homeUserData.get({ plain: true });
      const posts = postData.map((post) => post.get({ plain: true }));
      res.render("homepage", {
        home_user,
        posts,
        logged_in: req.session.logged_in,
      });
    }

    if (!req.session.logged_in) {
      const postData = await Post.findAll({
        include: [
          {
            model: User,
          },
        ],
      });
      const posts = postData.map((post) => post.get({ plain: true }));

      res.render("homepage", {
        posts,
        logged_in: req.session.logged_in,
      });
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get("/post/:id", withAuth, async (req, res) => {
  try {
    const postData = await Post.findByPk(req.params.id, {
      include: [
        {
          model: User,
          attributes: ["name", "id"],
        },
        {
          model: Comment,
          include: [{ model: User, attributes: ["name", "id"] }],
        },
      ],
    });

    const homeUserData = await User.findByPk(req.session.user_id, {
      attributes: { exclude: ["password"] },
    });
    const home_user = homeUserData.get({ plain: true });

    const post = postData.get({ plain: true });
    const myPost = req.session.user_id === post.user.id;
    console.log("post :>> ", post);

    res.render("post", {
      home_user,
      ...post,
      logged_in: req.session.logged_in,
      my_post: myPost,
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get("/post/update/:id", withAuth, async (req, res) => {
  try {
    const postData = await Post.findByPk(req.params.id, {
      include: [
        {
          model: User,
          attributes: ["name", "id"],
        },
        {
          model: Comment,
          include: [{ model: User, attributes: ["name", "id"] }],
        },
      ],
    });

    const homeUserData = await User.findByPk(req.session.user_id, {
      attributes: { exclude: ["password"] },
    });
    const home_user = homeUserData.get({ plain: true });

    const post = postData.get({ plain: true });
    const myPost = req.session.user_id === post.user.id;
    console.log("post :>> ", post);

    res.render("updatepost", {
      home_user,
      ...post,
      logged_in: req.session.logged_in,
      my_post: myPost,
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get("/dashboard", withAuth, async (req, res) => {
  try {
    const userData = await User.findByPk(req.session.user_id, {
      attributes: { exclude: ["password"] },
      include: [
        { model: Post, include: [{ model: User, attributes: ["name", "id"] }] },
      ],
    });

    const homeUserData = await User.findByPk(req.session.user_id, {
      attributes: { exclude: ["password"] },
    });
    const home_user = homeUserData.get({ plain: true });

    const user = userData.get({ plain: true });
    console.log("user :>> ", user);

    res.render("dashboard", {
      home_user,
      ...user,
      logged_in: true,
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get("/newpost", withAuth, async (req, res) => {
  const homeUserData = await User.findByPk(req.session.user_id, {
    attributes: { exclude: ["password"] },
  });
  const home_user = homeUserData.get({ plain: true });
  res.render("newpost", {
    home_user,
    logged_in: true,
  });
});

router.get("/signup", (req, res) => {
  if (req.session.logged_in) {
    res.redirect("/dashboard");
    return;
  }

  res.render("signup");
});

router.get("/login", (req, res) => {
  if (req.session.logged_in) {
    res.redirect("/dashboard");
    return;
  }

  res.render("login");
});

module.exports = router;

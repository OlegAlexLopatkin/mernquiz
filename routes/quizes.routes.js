const { Router } = require("express");
const shortid = require("shortid");
const Quiz = require("../models/Quiz");
const auth = require("../middleware/auth.middleware");
const router = Router();

router.get("/", async (req, res) => {
  try {

    const quizes = await Quiz.find();

    res.status(200).json(quizes);
  } catch (e) {
    res.status(500).json({ message: "Что-то пошло не так, попробуйте снова" });
  }
});

router.get("/:id", async (req, res) => {
  try {

    const quize = await Quiz.findById(req.params.id);
    res.status(200).json(quize);
  } catch (e) {
    res.status(500).json({ message: "Что-то пошло не так, попробуйте снова" });
  }
});

router.delete("/:id", auth, async (req, res) => {
  try {
    await Quiz.remove({ _id: req.params.id, userId: req.user.userId });
    res.status(200).json({
      message: "Категория удалена."
    });
  } catch (e) {
    res.status(500).json({ message: "Что-то пошло не так, попробуйте снова" });
  }
});

router.post("/", auth, async (req, res) => {
  req.body.userId = req.user.userId;
  const quiz = new Quiz(req.body);
  try {
    await quiz.save();
    res.status(201).json({ message: "Тест создан" });
  } catch (e) {
    res.status(500).json({ message: "Что-то пошло не так, попробуйте снова" });
  }
});

router.put("/:id", auth, async (req, res) => {

  try {
    await Quiz.findOneAndUpdate(
      {
        _id: req.params.id,
        userId: req.user.userId
      },
      {
        userId: req.user.userId,
        quiz: req.body.quiz,
        quizTitle: req.body.quizTitle
      }
    );
    res.status(201).json({ message: "Тест создан" });
  } catch (e) {
    res.status(500).json({ message: "Что-то пошло не так, попробуйте снова" });
  }
});


module.exports = router;

const express = require("express");
const router = express.Router();
const {
  allCategories,
  createCategory,
  deleteCategory,
  getSingleCategory,
  deactivateCategory} = require("../../controllers/categoryController");


router.get("/", allCategories); //Gets all the categories
router.post("/", createCategory); //Creates a category
router.get("/:id", getSingleCategory); //Gets a category along with parent
router.patch("/:id", deactivateCategory); //Deactivates a category along with childs
router.delete("/:id", deleteCategory); //Delete a category

module.exports = router;

const Category = require("../models/Category");
const slugify = require("slugify");

exports.allCategories = (req, res) => {
  Category.find({})
    .then((category) => {
      if (!category) {
        return res
          .status(404)
          .json({ success: false, message: "No category found" });
      }
      res.json({ success: true, total: category.length, data: category });
    })
    .catch((err) => {
      res.status(400).json({ success: false, message: err.message });
    });
};


exports.createCategory = async (req, res) => {
  try {
    const categoryObj = {
      name: req.body.name,
      slug: slugify(req.body.name, {
        lower: true,
        trim: true,
      }),
    };

    if (req.body.parentId) {
      const sisters = await Category.find({ parentId: req.body.parentId });
      for (sis of sisters) {
        if (sis.slug == categoryObj.slug) {
          return res.status(400).json({
            success: false,
            message: "Duplicate category name under same parent",
          });
        }
      }
    }

    if (req.body.parentId) {
      categoryObj.parentId = req.body.parentId;
    }

    const category = new Category(categoryObj);
    category.save((err, category) => {
      if (err) {
        return res.status(500).json({ success: false, error: err.message });
      }
      if (category) {
        res.status(201).json({
          success: true,
          message: "Category created successfully",
          category,
        });
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.getSingleCategory = async (req, res) => {
  try {
    const category = await Category.findById({ _id: req.params.id }).exec()
    
    // console.log(category.parentId);
    let parent;
    if(category.parentId != null){
       parent = await getParentCategory(category.parentId)
    }
      // console.log(parent);
    res.status(200).json({ success: true, category, parent });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

exports.deactivateCategory = async (req, res) => {
  try {
    const category = await Category.findById({ _id: req.params.id });
    if (category) {
      await Category.findOneAndUpdate({_id: req.params.id}, {isActive: false});
      return res.status(200).send({ success: true, message: "Category updated successfully" });
    } else {
      res.status(404).send({ success: false, error: "Category not found" });
    }
    
    const categories = await Category.find().exec()
    let childs = [];
    
    const childList = await getChildCategories(req.params.id, categories, childs);


    // res.status(200).json({ success: true, childList });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

exports.deleteCategory = async (req, res) => {
  try {
    const category = await Category.findById({ _id: req.params.id });
    if (category) {
      await deleteSubCategory(category);
      await Category.findByIdAndDelete({ _id: req.params.id });
      return res
        .status(200)
        .send({ success: true, message: "Category deleted successfully" });
    } else {
      res.status(404).send({ success: false, error: "Category not found" });
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

const deleteSubCategory = async (category) => {
  Category.find({ parentId: category._id }).then((cat) => {
    if (cat.length > 0) {
      cat.map((c) => deleteSubCategory(c));
    }
  });
  return await Category.findByIdAndDelete({ _id: category._id });
};

const getParentCategory = async (parentId) => {
  const parent = await Category.findById({ _id: parentId }).exec();
  
  return parent;
};

const getChildCategories = (id, categories, childs) => {
  const childCategory = categories.filter((c) => c.parentId == id);
  
  let child2 = [];
  for (cate of childCategory) {
    childs.push({
      _id: cate.id,
      name: cate.name,
      slug: cate.slug,
      parentId: cate.parentId,
      isActive: false,
      childrens: getChildCategories(cate.id, categories, child2),
    });
  }
  return childs;
};

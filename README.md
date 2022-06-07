## Project setup

```
npm install
```

### Run

```
npm start
```

### Run with nodemon

```
npm run server
```

### Setup your MongoURI

```
Put your MongoURI in config.default.json file
```

### Routes

```
Use Post '~/api/category' route to Creates a category. To create a root category put a JSON request providing 'name' property. If the new category is a child category of another then also provide 'parentId' property passing the parent categories _id.

Use Get '~/api/category' route to get all categories.

Use Get '~/api/category/:id' route to get a category alog with its parent.

Use Patch '~/api/category/:id' route to update categories.

Use Delete '~/api/category/:id' route to delete a category.


```

# CapRover Website and Docs
Website and Docs for CapRover.

### Development

```
cd website
npm i
npm start
```

### Adding New Docs

Add the new MarkDown file in `/docs` directory and Add the listing to `/website/sidebars.json`. at the end run `yarn start` to see the result.


### Build

Simply run `yarn build` and all data will be converted into static html files inside `website/build` directory.

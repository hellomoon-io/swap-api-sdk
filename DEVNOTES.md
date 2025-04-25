# Dev Guidelines for Swap Api

### Upgrading to a new version

In order to upgrade to a new version we simply need to do the following:
1) We need to update the version in the package.json
   1) if non breaking change, up the end decimal X.X.1 => X.X.2
   2) If breaking change, up the middle decimal X.1.X => X.2.0
2) Then publish the new version onto npmjs.com 
 
```shell
npm publish --access public
```

### Managing Files
This repository uses a `.gitignore` as well as an `.npmignore`.
The way npm works, it will read from `.npmignore` when publishing and defer to `.gitignore` when `.npmignore` is missing.
Because there are files we want to keep in the git repo but not publish, we need to manage both

This means that if you add files to the project, you **must** make sure to add them to the respective ignore files if they contain sensitive information for the given context.
As an example, currently, we keep this readme file in the `.npmignore` because people cloning this project do not need to read it.
# Dev Guidelines for Swap Api

### Upgrading to a new version

In order to upgrade to a new version we simply need to do the following:
```shell
bash update-and-publish.sh -v <patch | minor | major>
```

This will up the version based on the type passed to `v`

      # major (1.0.0 -> 2.0.0)
      # minor (0.1.0 -> 0.2.0)
      # patch (0.0.1 -> 0.0.2)

Build the project

And then publish it to npmjs.com

### Managing Files
This repository uses a `.gitignore` as well as an `.npmignore`.
The way npm works, it will read from `.npmignore` when publishing and defer to `.gitignore` when `.npmignore` is missing.
Because there are files we want to keep in the git repo but not publish, we need to manage both

This means that if you add files to the project, you **must** make sure to add them to the respective ignore files if they contain sensitive information for the given context.
As an example, currently, we keep this readme file in the `.npmignore` because people cloning this project do not need to read it.
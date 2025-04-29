#!/bin/bash
while getopts "v:" opt; do
  case $opt in
    v)
      # major (1.0.0 -> 2.0.0)
      # minor (0.1.0 -> 0.2.0)
      # patch (0.0.1 -> 0.0.2)
      if [[ "$OPTARG" == "major" || "$OPTARG" == "minor" || "$OPTARG" == "patch" ]]; then
        value="$OPTARG"
      else
        echo "Error: -v flag only accepts 'major', 'minor', or 'patch' as arguments" >&2
        exit 1
      fi
      ;;
    \?) echo "Invalid option: -$OPTARG" >&2; exit 1 ;;
  esac
done

if [ -n "$value" ]; then
  npm version $value ## bumps version based on parameter
  npm run build ## build after upping the version
  npm publish --access public ## publish to npmjs.cmo
fi
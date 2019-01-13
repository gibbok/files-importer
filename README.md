# files-importer

files-importer is a Node.js command line tool which synchronously copy the contents of a directory (include subdirectories recursively) to another location without creating duplicate files. It can be used to import only images and videos that have not already been imported from a camera or a memory card.
files-importer is written using functional programming in TypeScript.

## Great! So how do I use it?

- files-importer runs on Mac, Linux and Windows, just checkout this repository and install its dependencies using `npm install`.
- Open the command line and run `npm start source target` where `source` and `target` are paths to directories, example `npm start ~/Documents/my-pictures-library ~/Documents/new-pictures`
- `files-importer` will compare the two directories and copy the contents from `source` to `target` only if `target` does not have the file present in `source`.

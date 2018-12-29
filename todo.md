# Testing:
Use for testing:

```
npm start ~/Documents/Repositories/files-importer/app/source ~/Documents/Repositories/files-importer/app/target
```
or
```
npm start ./app/source ./app/target
```
- [x] Manual tested `check.ts`
- [x] Manual test `work.ts`
- [ ] Write test for `index.ts`

# Bugs:
- [x] If relative paths are passed for source and target arguments folder are created by user (convert always to absolute pathsFor testing use)
- [x] Diff algo does not exclude file paths

# Improvements:
- [ ] Error `path is invalid could show up if was source or target`
- [x] Spice up  `printErrors`, `printSuccess`, `printMessages`
- [ ] Add some progress indicator
- [ ] Ask user confirmation before merge
- [ ] Understand why resolve is necessary in copy file

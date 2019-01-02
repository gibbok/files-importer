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
- [x] Write test for `index.ts`

# Bugs:
- [x] If relative paths are passed for source and target arguments folder are created by user (convert always to absolute pathsFor testing use)
- [x] Diff algo does not exclude file paths

# Improvements:
- [x] Error `path is invalid could show up if was source or target`
- [x] Spice up  `printErrors`, `printSuccess`, `printMessages`
- [x] Review main code
- [ ] Ask user confirmation before merge
- [ ] Add some progress indicator
- [ ] Add code documentation

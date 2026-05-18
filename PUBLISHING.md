# Publishing Guide

## Preparation

1. **Make sure you're logged in to npm:**
   ```bash
   npm login
   ```

2. **Build the project:**
   ```bash
   npm run build
   ```

3. **Test locally:**
   Open `demo.html` in a browser to test all components

## Publishing

### First Time Publishing

```bash
npm publish
```

### Updating Version

Update version in `package.json`, then:

```bash
npm publish
```

### Version Management

- **Patch release** (1.0.0 -> 1.0.1): Bug fixes
  ```bash
  npm version patch
  npm publish
  ```

- **Minor release** (1.0.0 -> 1.1.0): New features, backward compatible
  ```bash
  npm version minor
  npm publish
  ```

- **Major release** (1.0.0 -> 2.0.0): Breaking changes
  ```bash
  npm version major
  npm publish
  ```

## Pre-publish Checklist

- [ ] All components working correctly
- [ ] README.md is up to date
- [ ] LICENSE file exists
- [ ] Version bumped in package.json
- [ ] Built files in `dist/` directory
- [ ] No sensitive information in code
- [ ] Repository URL updated in package.json

## After Publishing

1. Check package on npm: https://www.npmjs.com/package/gwc
2. Test installation: `npm install gwc` in a test project
3. Create a GitHub release with the same version tag
4. Update documentation if needed

## Scoped Package (Optional)

If you want to publish under your username:

1. Change package name in `package.json`:
   ```json
   "name": "@yourusername/gwc"
   ```

2. Publish as public:
   ```bash
   npm publish --access public
   ```

## Troubleshooting

- **Package name taken?** Change name in package.json or use scoped package
- **Not logged in?** Run `npm login`
- **Build errors?** Run `npm run build` and fix any TypeScript errors
- **Permission denied?** Make sure you own the package or use a different name


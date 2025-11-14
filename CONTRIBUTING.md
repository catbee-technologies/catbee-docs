# Contributing to Catbee Docs

Thank you for your interest in improving the Catbee documentation!  
We appreciate contributions of all kinds — fixing typos, improving explanations, adding new guides, or enhancing the Docusaurus website.

Please read the guidelines below to ensure a smooth contribution process.

---

## 🚀 How to Contribute

### 1. Fork & Clone the Repository

```sh
git clone https://github.com/catbee-technologies/catbee-docs.git
cd catbee-docs
```

### 2. Create a Feature Branch

Follow a consistent naming convention:

```
docs/update-xyz
docs/new-guide-auth
fix/broken-link
feature/sidebar-improvement
```

```sh
git checkout -b docs/update-xyz
```

### 3. Make Your Changes

- Keep changes focused and scoped.
- Follow the existing content structure and formatting.
- Use MDX properly when embedding components or interactive elements.
- For code examples, ensure accuracy and syntax highlighting.

### 4. Run Linting & Build Locally

```sh
npm install
npm run lint
npm run build
npm run start
```

This ensures no broken links, missing imports, or build-time errors.
Review your changes in the local Docusaurus site to verify everything looks correct.

### 5. Commit Your Changes

Use clear, descriptive commit messages (e.g., Conventional Commits):

```
docs: improve environment variables section
fix: correct typo in logging guide
feat: add new "Architecture" documentation
chore: update dependencies
```

### 6. Push & Open a Pull Request

```sh
git push origin docs/update-xyz
```

When opening a PR, please include:

- A clear description of the change
- The reason behind the update
- Screenshots (for UI/layout changes)
- Links to related issues (if any)

---

## 🐛 Reporting Issues

For documentation-related issues:

- Search existing issues first.
- File a bug report using our template.
- Include page URL, screenshots, logs (if build-related), and reproduction steps.

For package-related issues

- Please report them in their respective repository, not here.

---

## 🧪 Pull Request Review Process

Your PR will be checked for:

- Accurate and clear documentation
- No broken links or build errors
- Proper formatting, headings, and structure
- No unused files or stray assets
- Sidebar consistency
- Appropriate commit message

We aim to review PRs within 1–3 business days.

---

## 📜 Code of Conduct

This project follows the Contributor Covenant Code of Conduct.  
By contributing, you agree to adhere to these standards.
<br/>
Read the full Code of Conduct here: **[CODE_OF_CONDUCT.md](./CODE_OF_CONDUCT.md)**
<br/>
Reports or concerns: **hprasath.dev@gmail.com**

---

## 🙌 Community & Support

We deeply appreciate your contributions to making Catbee Docs better for everyone.
<br/>
Whether it’s a small typo or a major guide — it all helps.
<br/>
Thank you for being part of the community!

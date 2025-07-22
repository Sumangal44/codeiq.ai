# CodeIQ.ai - Team Contribution Guide

Welcome to the CodeIQ.ai project! This guide will help you get started as a team member and contribute effectively to our codebase.

## Table of Contents
- [Project Overview](#project-overview)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Project Structure](#project-structure)
- [Coding Standards](#coding-standards)
- [Git Workflow](#git-workflow)
- [Testing Guidelines](#testing-guidelines)
- [Code Review Process](#code-review-process)
- [Deployment](#deployment)
- [Common Issues](#common-issues)
- [Resources](#resources)

## Project Overview

CodeIQ.ai is a web application built with HTML, CSS, and JavaScript. The project follows a modular structure with reusable components and organized assets.

### Tech Stack
- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Architecture**: Component-based structure
- **Version Control**: Git

## Getting Started

### Prerequisites
Before you begin, ensure you have the following installed:
- Git
- A modern web browser (Chrome, Firefox, Safari, or Edge)
- Code editor (VS Code recommended)
- Node.js (if using build tools or package management)

### Initial Setup
1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd codeiq.ai
   ```

2. **Open the project**
   ```bash
   code .  # If using VS Code
   ```

3. **Start development**
   - Open `index.html` in your browser
   - Or use a local development server

### Recommended VS Code Extensions
- Live Server
- Prettier - Code formatter
- ESLint
- HTML CSS Support
- Auto Rename Tag

## Development Workflow

### 1. Before Starting Work
- Pull the latest changes from the main branch
- Create a new feature branch
- Review any relevant documentation

### 2. During Development
- Write clean, readable code
- Test your changes frequently
- Follow the established coding standards
- Update documentation if needed

### 3. Before Submitting
- Test your changes thoroughly
- Run code formatting and linting
- Commit your changes with descriptive messages
- Push your branch and create a pull request

## Project Structure

```
codeiq.ai/
├── index.html              # Main entry point
├── README.md              # Project documentation
├── assets/
│   ├── css/
│   │   └── styles.css     # Main stylesheet
│   ├── images/            # Image assets
│   └── js/
│       └── app.js         # Main JavaScript file
├── components/
│   ├── header.html        # Reusable header component
│   └── footer.html        # Reusable footer component
├── data/
│   └── data.js           # Data management and API calls
└── pages/                # Additional HTML pages
```

### File Organization Guidelines

#### HTML Files
- `index.html`: Main landing page
- `pages/`: Additional pages (about, contact, etc.)
- `components/`: Reusable HTML components

#### CSS Files
- `assets/css/styles.css`: Main stylesheet
- Use BEM methodology for class naming
- Organize styles by components/sections

#### JavaScript Files
- `assets/js/app.js`: Main application logic
- `data/data.js`: Data handling and API interactions
- Use ES6+ features and modular code

#### Assets
- `assets/images/`: All image files
- Use optimized formats (WebP when possible)
- Follow consistent naming conventions

## Coding Standards

### HTML
- Use semantic HTML5 elements
- Include proper meta tags and accessibility attributes
- Validate HTML using W3C validator
- Use lowercase for all element and attribute names

```html
<!-- Good -->
<article class="card">
  <header class="card__header">
    <h2 class="card__title">Article Title</h2>
  </header>
  <p class="card__content">Article content...</p>
</article>
```

### CSS
- Use BEM methodology for class naming
- Mobile-first responsive design
- Use CSS custom properties for theming
- Organize styles logically

```css
/* Good */
.card {
  display: flex;
  flex-direction: column;
  border-radius: var(--border-radius);
}

.card__header {
  padding: var(--spacing-md);
  background-color: var(--color-primary);
}

.card__title {
  font-size: var(--font-size-lg);
  margin: 0;
}
```

### JavaScript
- Use ES6+ features
- Follow functional programming principles when possible
- Use meaningful variable and function names
- Add JSDoc comments for functions


### General Guidelines
- Use 2 spaces for indentation
- Use semicolons in JavaScript
- Use single quotes for strings in JavaScript
- Add trailing commas in multi-line objects/arrays
- Keep line length under 100 characters

## Git Workflow

### Branch Naming Convention
- `feature/feature-name` - New features
- `bugfix/bug-description` - Bug fixes
- `hotfix/urgent-fix` - Critical fixes
- `docs/documentation-update` - Documentation changes

### Commit Message Format
```
type(scope): description

body (optional)

footer (optional)
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code formatting changes
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

**Examples:**
```
feat(auth): add user login functionality

fix(ui): resolve mobile navigation menu issues

docs(readme): update contribution guidelines
```

### Workflow Steps
1. **Create a branch**
   ```bash
   git checkout -b feature/new-dashboard
   ```

2. **Make changes and commit**
   ```bash
   git add .
   git commit -m "feat(dashboard): add user analytics widget"
   ```

3. **Push changes**
   ```bash
   git push origin feature/new-dashboard
   ```

4. **Create Pull Request**
   - Use the PR template
   - Add descriptive title and description
   - Request appropriate reviewers
   - Link related issues

## Testing Guidelines

### Manual Testing Checklist
- [ ] Test on multiple browsers (Chrome, Firefox, Safari, Edge)
- [ ] Test responsive design on different screen sizes
- [ ] Test keyboard navigation and accessibility
- [ ] Verify all links and buttons work correctly
- [ ] Check console for JavaScript errors
- [ ] Validate HTML and CSS

### Browser Testing
- **Desktop**: Chrome, Firefox, Safari, Edge (latest 2 versions)
- **Mobile**: iOS Safari, Chrome Mobile, Samsung Internet
- **Screen Sizes**: 320px, 768px, 1024px, 1440px+

### Accessibility Testing
- Use keyboard navigation only
- Test with screen reader (NVDA, JAWS, or VoiceOver)
- Check color contrast ratios
- Verify alt text for images

## Code Review Process

### Before Requesting Review
- [ ] Self-review your code
- [ ] Test your changes thoroughly
- [ ] Update documentation if needed
- [ ] Ensure code follows style guidelines
- [ ] Check for console errors or warnings

### Pull Request Template
```markdown
## Description
Brief description of changes

## Changes Made
- List of specific changes
- New features or modifications
- Bug fixes

## Testing
- [ ] Tested on desktop browsers
- [ ] Tested on mobile devices
- [ ] Tested accessibility features
- [ ] No console errors

## Screenshots
(Include screenshots for UI changes)

## Additional Notes
Any additional context or considerations
```

### Review Guidelines
**For Reviewers:**
- Provide constructive feedback
- Test the changes locally
- Check for code quality and consistency
- Verify accessibility and responsive design
- Approve only when confident in the changes

**For Authors:**
- Respond to feedback promptly
- Ask questions if feedback is unclear
- Make requested changes and re-request review
- Thank reviewers for their time

## Deployment

### Development Environment
- Open `index.html` directly in browser
- Use Live Server extension for auto-reload

### Staging Environment
- Follow deployment checklist
- Test all functionality
- Verify performance

### Production Deployment
- Minify CSS and JavaScript
- Optimize images
- Test thoroughly before release
- Monitor for issues post-deployment

## Common Issues

### Setup Issues
**Problem**: Components not loading
**Solution**: Check file paths and ensure all files are in correct directories

**Problem**: Styles not applying
**Solution**: Verify CSS file is linked correctly in HTML

### Development Issues
**Problem**: JavaScript errors in console
**Solution**: Check for typos, missing semicolons, or undefined variables

**Problem**: Responsive design not working
**Solution**: Ensure viewport meta tag is present and CSS media queries are correct

### Git Issues
**Problem**: Merge conflicts
**Solution**: 
```bash
git fetch origin
git rebase origin/main
# Resolve conflicts manually
git add .
git rebase --continue
```

## Resources

### Documentation
- [MDN Web Docs](https://developer.mozilla.org/)
- [CSS-Tricks](https://css-tricks.com/)
- [JavaScript.info](https://javascript.info/)

### Tools
- [Can I Use](https://caniuse.com/) - Browser compatibility
- [WebAIM](https://webaim.org/) - Accessibility guidelines
- [Lighthouse](https://developers.google.com/web/tools/lighthouse) - Performance auditing

### Team Communication
- **Slack/Discord**: Daily communication
- **GitHub Issues**: Bug reports and feature requests
- **Pull Requests**: Code discussions
- **Team Meetings**: Weekly sync-ups

## Getting Help

### When to Ask for Help
- Stuck on a problem for more than 2 hours
- Unsure about architectural decisions
- Need clarification on requirements
- Encountering new technologies or patterns

### How to Ask for Help
1. Describe the problem clearly
2. Share relevant code snippets
3. Explain what you've already tried
4. Include error messages or screenshots
5. Mention any deadlines or urgency
---

## Contributing

We welcome contributions from all team members! Please follow this guide and don't hesitate to ask questions. Remember that everyone was new once, and we're here to help each other grow.

**Happy coding! 🚀**

---

*Last updated: July 22, 2025*

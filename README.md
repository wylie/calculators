# Calculators

This repository contains the source code for a Hugo-based website that provides various calculators. The site is built and deployed using GitHub Actions.

## Key Files

- **.github/workflows/hugo.yml**: GitHub Actions workflow for building and deploying the Hugo site.
- **hugo.toml**: Configuration file for the Hugo site.
- **layouts/_default/baseof.html**: Base template for the site.
- **layouts/partials/header.html**: Header partial template.
- **layouts/partials/footer.html**: Footer partial template.
- **static/css/style.css**: Custom CSS for the site.

## Content

- **content/calculators/bmi-calculator.md**: Markdown file for the BMI Calculator page.
- **content/calculators/regular-calculator.md**: Markdown file for the Regular Calculator page.

## Deployment

The site is automatically built and deployed to GitHub Pages using the GitHub Actions workflow defined in `.github/workflows/hugo.yml`.

## Development

To build and serve the site locally, use the following commands in the terminal:

```sh
hugo server
```

To build the site for production, use:

```sh
hugo
```

## License

This project is licensed under the MIT License.

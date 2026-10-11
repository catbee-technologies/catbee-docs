# Security Policy

## Supported Versions

This repository contains the documentation website and Docusaurus site configuration for Catbee projects.  
There are **no runtime packages, libraries, or executables** distributed from this repository.

- **Security fixes target:** Latest documentation deployment on the `main` branch.
- For security policies of published packages (e.g., `@catbee/utils`, `@catbee/mysql`, `@ng-catbee/*`), please refer to their respective repositories.

## Reporting a Vulnerability

Do **not** open public issues for security reports.

- **Preferred:** Open a private advisory (GitHub > Security > Advisories > Report a vulnerability) if this repo is hosted on GitHub.
- **Alternative:** Email a private report to **security@catbee.in** with:
  - Description of the security concern or vulnerability
  - Affected page(s), URL, or site configuration
  - Environment details (Browser, OS, Node.js version)
  - Impact assessment and PoC or reproduction steps
  - Any relevant build logs or network traces

We will acknowledge receipt within **3 business days** and triage within **7 days**. We will coordinate timelines and mitigation steps based on severity.

## Disclosure

We follow coordinated disclosure:

- Keep reports private until a fix or mitigation is available.
- We aim to deploy fixes as soon as practical.
- **Default disclosure window:** 90 days, adjustable by mutual agreement.

## Scope of Testing

**Allowed:**

- Local testing against a private clone of this documentation repository
- Static analysis and safe exploration of documentation markdown/MDX components

**Not allowed:**

- Denial of service attacks against hosting infrastructure or CDN
- Social engineering, phishing, or attempts to compromise contributor accounts
- Exfiltration of private data or non-public repository assets

## Dependencies

We regularly update dependencies (e.g., Docusaurus, plugins, build tooling via Renovate) and prioritize security updates.

- Maintainers run:
  - `npm audit`
  - `npm outdated`

## Notes for Contributors & Site Security

- **No Secrets or Credentials:** Never commit credentials, private tokens, internal API keys, or proprietary server connection strings into documentation guides or sample configurations.
- **MDX & Custom Components:** Do not introduce unescaped user input or raw HTML evaluations into React/MDX components to prevent Cross-Site Scripting (XSS).
- **External Resources:** Avoid loading unvetted third-party scripts, stylesheets, or fonts from external CDNs without Subresource Integrity (SRI) or review.

## Contact

For urgent security matters: **security@catbee.in**

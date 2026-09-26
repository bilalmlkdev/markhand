# Security Policy

## Supported versions

Markhand is a static, client-side app. The version deployed at
[markhand.vercel.app](https://markhand.vercel.app/) and the `main`
branch are always considered supported. Older commits are not patched
separately.

## What counts as a security issue

- Cross-site scripting (XSS) through drawing names, share URL
  payloads, or anywhere user-provided text is rendered
- Any way to read or tamper with another visitor's drawings or
  settings in `localStorage`
- Malicious or malformed share URL payloads (see `src/lib/share.ts`,
  which decodes URL-encoded drawing data)
- Service worker issues that could serve stale or tampered assets
- Dependency vulnerabilities with a realistic exploit path in this app

Not security issues: denial of service against the demo deployment,
social engineering, or bugs that only affect the attacker's own
browser.

## How Markhand stores data

There are no accounts and no servers. Drawings, gallery metadata, and
settings live in the visitor's own `localStorage`.

One thing to understand about sharing: Markhand share links encode the
drawing itself inside the URL. Anyone you send a share link to can
read the drawing from the link. That is by design, but if you draw
something sensitive, do not publish the link.

## Reporting a vulnerability

Please do not open a public issue for security problems.

Email: bilalmlkdev@gmail.com

Include:

- What the vulnerability is and where it occurs
- Steps to reproduce it
- The affected browser and, if relevant, the input device
- Any suggested fix, if you have one

You should get an acknowledgment within 72 hours. If the report is
accepted, a fix will be prepared and credited to you in the release
notes before disclosure. If the report is declined, you will get an
explanation.

For issues that can be reported through GitHub's private advisory
feature, you can also use:

https://github.com/bilalmlkdev/markhand/security/advisories/new

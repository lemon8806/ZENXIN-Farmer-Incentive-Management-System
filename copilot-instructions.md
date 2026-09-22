# Comment Translation Rule

Whenever a comment is written or modified in this workspace:

- Detect comments containing Mandarin or other Chinese characters.
- Add a clear English translation immediately below the Mandarin comment, preserving the original comment.
- Before adding a translation, inspect the following comment lines. If an English translation is already directly below the Mandarin comment, do not add another translation or modify the existing one.
- Apply this rule automatically to JavaScript, HTML, CSS, JSON, and other source files in the workspace.
- Translate comments only; do not translate strings, identifiers, user-facing text, or executable code unless explicitly requested.

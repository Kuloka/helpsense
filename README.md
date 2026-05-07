helpsense desktop
=================

Cross-platform desktop helper with ChatGPT-style chat, translator, themes and watermark.

This version is a desktop application project for Windows, macOS and Linux.
It includes a simple chat screen, Google Translate-style translator, original
color themes plus flag themes, watermark settings, saved chats and quick tools,
but it does not automate message sending.

<<<<<<< HEAD
Requirements
------------
=======
preview
<img width="998" height="394" alt="image" src="https://github.com/user-attachments/assets/58b11348-b3ae-49b2-bdcb-2d1fcdba782a" />

>>>>>>> cc8f2b99ca23df6aa7322f49f841ddad83579e22

- Node.js 20 or newer
- npm
- Built-in no-key online fallback: Pollinations text API
- Optional hidden advanced mode: `OPENAI_API_KEY`
- Optional no-key mode: Ollama running locally with at least one downloaded model

Run in development
------------------

Windows quick start:

Double-click `start-helpsense.cmd`.

Windows shortcut with icon:

Double-click `helpsense.lnk`.

Manual start:

```bash
npm install
npm run start
```

Build executables
-----------------

Windows:

```bash
npm run dist:win
```

Or double-click `build-win-onefile.cmd`. The portable one-file `.exe` appears
in `release/`.

macOS:

```bash
npm run dist:mac
```

Linux:

```bash
npm run dist:linux
```

Build output appears in `release/`.

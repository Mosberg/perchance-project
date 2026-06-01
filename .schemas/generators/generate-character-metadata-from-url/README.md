# \*Generate Character Metadata From URL\*\*\*

_(Perchance Generator Specification)_

## **Generator Name:** `generate-character-metadata-from-url`

## **Purpose**

This generator extracts character information from one or more URLs and outputs fully structured metadata using either the **ultra-detailed-character-metadata-v2.schema.json** or **ultra-detailed-character-metadata-nsfw-v2.schema.json** schema.
Users may process a single URL or queue multiple URLs to produce a combined JSON metadata array.

---

## **Core Requirements**

### **1. Schema Selection**

Provide a dropdown menu labeled **Schema Type** with two options:

- **Ultra‑Detailed Schema** — `ultra-detailed-character-metadata-v2.schema.json`
- **Ultra‑Detailed NSFW Schema** — `ultra-detailed-character-metadata-nsfw-v2.schema.json`

The selected schema determines the structure and validation rules for the generated metadata.

---

### **2. URL Input System**

Include a text input field labeled **URL Input** where users can enter:

- a single URL
- multiple URLs separated by commas
- or a queued list of URLs

Each URL should be processed independently, then merged into a combined JSON output if multiple URLs are provided.

---

### **3. JSON Output Panel**

Provide a large text area labeled **JSON Output** that displays:

- the generated metadata for each character
- formatted JSON matching the selected schema
- combined JSON arrays when multiple URLs are queued

This panel should update automatically when the user clicks **Generate**.

---

### **4. Optional JSON Editor**

Include an optional toggle labeled **Enable JSON Editor**.
When enabled:

- the JSON Output panel becomes editable
- users may modify, refine, or extend the generated metadata before exporting

---

### **5. Generate Button**

A **Generate** button triggers the full processing pipeline:

- read schema selection
- parse URLs
- fetch and extract character data
- generate metadata objects
- validate against the chosen schema
- output final JSON to the JSON Output panel

---

### **6. Download Option**

Provide a **Download JSON** button that allows users to save the generated metadata as a `.json` file for later use.

---

## **Functional Summary**

The generator must:

- accept one or many URLs
- extract character information from each
- generate metadata conforming to the selected schema
- merge multiple results into a single JSON array
- allow optional manual editing
- allow downloading the final JSON

---

## **Perchance Plugins**

The following plugins are recommended to implement the required functionality:

aiTextPlugin = {import:ai-text-plugin}

textToImagePlugin = {import:text-to-image-plugin}

superFetch = {import:super-fetch-plugin}

generatorStats = {import:generator-stats-plugin}

kvPlugin = {import:kv-plugin}

rememberPlugin = {import:remember-plugin}

copyText = {import:copy-text-plugin}

tooltip = {import:tooltip-plugin}

commentsPlugin = {import:comments-plugin}

tabbedCommentsPlugin = {import:tabbed-comments-plugin-v1}

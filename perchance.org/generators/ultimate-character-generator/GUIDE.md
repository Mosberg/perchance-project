# ⭐ **THE COMPLETE GUIDE TO THE SELECT LISTX PLUGIN**
### *(selectListX, selectListsX, selectAllListsX)*
### *A unified, hierarchical, leaf‑aware selection engine for Perchance*

Your plugin provides **three exported functions**, all powered by a shared recursive engine:

- **selectListX** → select **ONE** leaf
- **selectListsX** → select **MANY** leaves
- **selectAllListsX** → return **EVERY** leaf

But each of these has *multiple usage modes*, depending on:

- the structure of the list
- whether the list contains objects, arrays, or nested trees
- whether the user wants random, deterministic, or bulk extraction
- whether the output is coerced to a string or used as an array

Below is the **full capability breakdown**.

---

# 🟦 1. **selectListX(list)**
### **Purpose:** Select *one* random leaf from any nested structure.

### ✔ Works on:
- simple arrays
- nested arrays
- nested objects
- Perchance lists with `.selectOne()`
- objects with `.value`, `.text`, `.label`, `.name`
- arbitrarily deep trees
- mixed structures (arrays + objects + selectOne nodes)

### ✔ What counts as a “leaf”?
Your engine defines a leaf as:

- a **string**, **number**, or **boolean**
- OR an object with a **value/text/label/name** property
- OR a `.selectOne()` result
- OR the final primitive inside a nested structure

### ✔ Example: simple usage
```
[selectListX(character.identity.name.first.male)]
```

### ✔ Example: deep nested usage
```
[selectListX(character)]
```
This will drill down through identity → name → first → male → random name.

### ✔ Example: selecting from an array
```
[selectListX(["A","B","C"])]
```

### ✔ Example: selecting from an object with values
```
[selectListX({value:"Elf"})]
```

### ✔ Example: selecting from a Perchance list node
```
[selectListX(character.identity.gender)]
```

### ✔ Example: selecting from a mixed structure
```
[selectListX({humanoid:["Elf","Human"], beast:["Wolf","Bear"]})]
```

---

# 🟩 2. **selectListsX(list, ...args)**
### **Purpose:** Select **multiple** leaves from the same list.

This is the most flexible part of your plugin — it supports **four different selection modes** depending on the arguments.

---

## 🟩 Mode 1 — **Fixed count**
```
selectListsX(list, 3)
```
→ returns **3 random leaves**

Example:
```
[selectListsX(character.identity.name.first.male, 3).joinItems(", ")]
```

---

## 🟩 Mode 2 — **Random count between min and max**
```
selectListsX(list, 2, 5)
```
→ returns **2–5 leaves**

Example:
```
[selectListsX(character.skills.combat, 1, 4).joinItems(", ")]
```

---

## 🟩 Mode 3 — **Random count from an array of options**
```
selectListsX(list, [1,2,3,5])
```
→ randomly chooses 1, 2, 3, or 5 items

Example:
```
[selectListsX(character.personality.quirks, [1,3,5]).joinItems("; ")]
```

---

## 🟩 Mode 4 — **Random count from multiple arguments**
```
selectListsX(list, 1, 3, 7)
```
→ randomly chooses 1, 3, or 7 items

Example:
```
[selectListsX(character.equipment.items, 2, 4, 6).joinItems(", ")]
```

---

## 🟩 Output behavior
The returned array has a custom `.toString()`:

- If coerced to a string, it **joins with no separator**
- If used with `.joinItems()`, you control formatting
- If used inside JSON, it becomes a proper array

Example:
```
Inventory: [selectListsX(character.equipment.items, 3)]
```
→ becomes something like:
```
Inventory: SwordShieldPotion
```

Better:
```
Inventory: [selectListsX(character.equipment.items, 3).joinItems(", ")]
```

---

# 🟧 3. **selectAllListsX(list)**
### **Purpose:** Return **every leaf** in the structure.

This is a **full tree flattening engine**.

### ✔ It returns:
- an array of all primitive leaves
- extracted from any depth
- including `.value`, `.text`, `.label`, `.name`
- including `.selectAll` nodes
- including nested arrays and objects

### ✔ Example: get all male first names
```
[selectAllListsX(character.identity.name.first.male).joinItems(", ")]
```

### ✔ Example: get all species
```
[selectAllListsX(character.identity.species)]
```

### ✔ Example: get all leaves in the entire character taxonomy
```
[selectAllListsX(character)]
```

### ✔ Random fallback when coerced to string
If you do:
```
[selectAllListsX(character.identity.gender)]
```
and forget `.joinItems()`, it returns a **random leaf** from the array.

This is intentional and useful for shorthand usage.

---

# 🟨 4. **Advanced Usage Patterns**
These are the *real power moves* that your plugin enables.

---

## 🟨 A. **Weighted selection via nested lists**
```
gender
  male
    male
    male
    male
  female
    female
    female
```
Then:
```
[selectListX(gender)]
```
→ male is 4× more likely.

---

## 🟨 B. **Category‑based randomization**
```
[selectListX(character.appearance)]
```
→ randomly picks a subcategory (skin, eyes, hair, etc.)
→ then drills down to a leaf.

---

## 🟨 C. **Randomized JSON generation**
```
{
  "name": "[selectListX(character.identity.name.first.male)]",
  "skills": [selectListsX(character.skills.combat, 2).joinItems(", ")]
}
```

---

## 🟨 D. **Unique draws (manual)**
Your plugin does not enforce uniqueness, but you can:

```
{unique: selectListsX(list, 5)}
```

Or manually filter duplicates in JS mode.

---

## 🟨 E. **Dynamic prompt building**
```
A [selectListX(character.appearance.build)] warrior with
[selectListX(character.appearance.hair.color)] hair.
```

---

## 🟨 F. **Full taxonomy export**
```
[selectAllListsX(character).joinItems("\n")]
```
→ dumps your entire character system as a flat list.

---

# 🟥 5. **What Makes Your Plugin Special**
Your plugin is not a simple randomizer — it is a **universal tree‑walker** with:

- recursive descent
- leaf detection
- array flattening
- object flattening
- selectOne/selectAll compatibility
- dynamic toString overrides
- multi‑mode sampling
- deep structure awareness

It is effectively a **mini‑query language** for Perchance list structures.

---

# 🟪 6. **Cheat Sheet Summary**

| Function | Returns | Best For |
|---------|---------|----------|
| **selectListX(list)** | 1 leaf | Names, genders, species, traits |
| **selectListsX(list, args)** | many leaves | Skills, items, quirks, tags |
| **selectAllListsX(list)** | all leaves | Debugging, exports, full category dumps |

---

# 🟫 7. Want me to generate a **full HTML documentation page** for this plugin?
I can produce:

- a polished docs page
- a Perchance plugin page
- a README.md
- a cheat‑sheet card
- a developer‑facing API reference
- a user‑friendly tutorial

Just tell me the format you want.

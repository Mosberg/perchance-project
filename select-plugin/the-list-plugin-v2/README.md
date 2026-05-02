# The List Plugin v2

## Overview

`the-list-plugin-v2` is a Perchance plugin that provides advanced list and tree selection utilities for nested lists, object trees, and native Perchance list objects.

It is designed to work with large nested definitions like `list.perchance`, and it can traverse structured data sources to extract primitive values, branch values, and select list elements in several useful ways.

## Installation

Import the plugin into your Perchance lists editor:

```perchance
listUtils = {import:the-list-plugin-v2}
```

## Exported functions

### `selectOne(list)`
- Returns a single randomly selected value from the provided list or tree.
- Works with:
  - native Perchance lists (`selectOne()` objects)
  - arrays
  - nested objects and trees
  - primitive values
- Traverses nested structures until it reaches a leaf.

### `selectAll(list)`
- Returns all primitive values collected from the list or tree.
- The returned value behaves like a list and supports Perchance stringification.
- Useful for inspection, filtering, or reordering a flattened value set.

### `selectMany(list, count)`
- Returns multiple selected values from `list`.
- Accepts the same count formats used by other selectors:
  - fixed number: `selectMany(list, 3)`
  - range: `selectMany(list, 1, 4)`
  - array of counts: `selectMany(list, [1,2,3])`

### `selectSpecific(list, index)`
- Selects the Nth primitive value from the flattened list representation.
- Uses 1-based indexing.
- Returns an error string when the index is out of range.

### `selectOrder(list, ...indices)`
- Returns values from the flattened list in the exact order of the requested indices.
- Example: `selectOrder(list, 2, 1, 3)` returns the 2nd value first, then the 1st, then the 3rd.

### `selectRange(list, start, end)`
- Returns a slice of the flattened values from `start` to `end` inclusive.
- `start` and `end` must both be provided.
- If `start > end`, the plugin swaps them automatically.

### `selectExcept(list, ...indices)`
- Returns all flattened values except the ones at the given indices.
- Indices are 1-based.
- If no indices are provided, it returns the entire flattened list.

### `selectUnique(list, count)`
- Randomly selects a specified number of unique values from the flattened list.
- Values are not repeated.
- If `count` is omitted or invalid, the plugin defaults to 1.

### `selectShuffle(list)`
- Returns all flattened values in random order.
- Useful for shuffling a group of options without repeats.

### `selectWeighted(list, weights)`
- Returns one value from the flattened list using weighted probability.
- `weights` may be a single value or an array of weights.
- If fewer weights are provided than values, remaining values use weight `1`.
- Returns an error string if the weight set is invalid.

### `selectPath(root, path)`
- Traverses `root` by dot-separated path segments and returns values found under that path.
- Example: `selectPath(root, "character.identity.name.first.male")`
- If the path is missing, returns a path-not-found error.

### `selectWhere(list, predicate)`
- Filters the flattened value list with a callback predicate.
- The predicate receives `(item, index, arr)`.
- If no predicate is passed, the full flattened list is returned.
- Predicate errors are caught and treated as `false`.

## How it works

The plugin uses several shared helpers:

- `isPrimitive()` to detect strings, numbers, and booleans.
- `extractLeafValue()` to interpret leaf-like objects with `value`, `text`, `label`, or `name`.
- `_selectOneX()` to recursively walk nested trees and list objects.
- `_getAllValues()` to flatten nested structures into a primitive-value array.

These helpers make `the-list-plugin-v2` robust across mixed Perchance list shapes and JSON-style object trees.

## Example usage

```perchance
listUtils = {import:the-list-plugin-v2}

fruits =
  apple
  banana
  cherry

nested =
  tropical:
    mango
    banana
  temperate:
    apple
    pear

oneFruit = [listUtils.selectOne(fruits)]
allFruits = [listUtils.selectAll(fruits).joinItems(", ")]
firstFruit = [listUtils.selectSpecific(fruits, 1)]
shuffled = [listUtils.selectShuffle(fruits).joinItems(" | ")]
rangeValues = [listUtils.selectRange(fruits, 1, 2).joinItems(", ")]
exceptSecond = [listUtils.selectExcept(fruits, 2).joinItems(", ")]
weighted = [listUtils.selectWeighted(fruits, [1, 5, 1])]
pathValues = [listUtils.selectPath(nested, "tropical").joinItems(", ")]
whereA = [listUtils.selectWhere(fruits, item => item.includes("a")).joinItems(", ")]
```

## Notes

- The plugin is optimized for compatibility with Perchance list objects and object trees.
- `selectAll`, `selectMany`, `selectOrder`, `selectRange`, `selectExcept`, `selectUnique`, `selectShuffle`, and `selectWhere` return list-like arrays with custom `toString()` support.
- Error conditions return descriptive strings so you can spot missing arguments or invalid input.

## Recommended use

- Use `selectOne` when you need one random result.
- Use `selectAll` to inspect every terminal value.
- Use `selectWeighted` when probability should vary.
- Use `selectPath` to target nested object branches.
- Use `selectWhere` to build dynamic filter rules.

## File location

`d:\perchance\select-plugin\the-list-plugin-v2\the-list-plugin-v2.perchance`

## Support

If you need additional helper functions or want custom tree traversal behavior, extend the plugin by adding new exported functions in `the-list-plugin-v2.perchance`.

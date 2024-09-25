[![Continuous Integration](https://github.com/kaiosilveira/parameterize-function-refactoring/actions/workflows/ci.yml/badge.svg)](https://github.com/kaiosilveira/parameterize-function-refactoring/actions/workflows/ci.yml)

ℹ️ _This repository is part of my Refactoring catalog based on Fowler's book with the same title. Please see [kaiosilveira/refactoring](https://github.com/kaiosilveira/refactoring) for more details._

---

# Parameterize Function

**Formerly: Parameterize Method**

<table>
<thead>
<th>Before</th>
<th>After</th>
</thead>
<tbody>
<tr>
<td>

```javascript
export function tenPercentRaise(aPerson) {
  aPerson.salary = aPerson.salary.multiply(1.1);
}

export function fivePercentRaise(aPerson) {
  aPerson.salary = aPerson.salary.multiply(1.05);
}
```

</td>

<td>

```javascript
export function raise(aPerson, factor) {
  aPerson.salary = aPerson.salary.multiply(1 + factor);
}
```

</td>
</tr>
</tbody>
</table>

There are only a few things in programming that are more annoying than two chunks of code that does _almost_ the same thing, except for a tiny detail. This refactoring helps solving this issue.

A quick and easy example is the code snippet above, which deals with a salary increase: we have `fivePercentRaise` and `tenPercentRaise`, both of them identical in implementation unless for a different multiplying factor. To solve this issue, we can first introduce a more general `raise` function:

```diff
@@ -5,3 +5,7 @@
+export function raise(aPerson, factor) {
+  aPerson.salary = aPerson.salary.multiply(1 + factor);
+}
```

And then call `raise` at `fivePercentRaise` and `tenPercentRaise`:

```diff
+++ b/src/salary-increase/index.js
@@ -1,9 +1,9 @@
 export function tenPercentRaise(aPerson) {
-  aPerson.salary = aPerson.salary.multiply(1.1);
+  raise(aPerson, 0.1);
 }
 export function fivePercentRaise(aPerson) {
-  aPerson.salary = aPerson.salary.multiply(1.05);
+  raise(aPerson, 0.05);
 }
```

From there onwards, that'd be our choice whether or not to inline both functions at their callers, or keep them as is, optimizing for readability. The real world is a bit more complex, though, that's why we have a different, more involved example below.

## Working example

Our working example is a program that calculates usage charges, based on three usage bands, each of which with their own rules and ranges. There are three functions:

```javascript
export function bottomBand(usage) {
  return Math.min(usage, 100);
}

export function middleBand(usage) {
  return usage > 100 ? Math.min(usage, 200) - 100 : 0;
}

export function topBand(usage) {
  return usage > 200 ? usage - 200 : 0;
}
```

All of them used inside `baseCharge`:

```javascript
export function baseCharge(usage) {
  if (usage < 0) return usd(0);
  const amount = bottomBand(usage) * 0.03 + middleBand(usage) * 0.05 + topBand(usage) * 0.07;
  return usd(amount);
}
```

Our goal here is to merge their behaviors into a single function.

### Test suite

The test suite for the program is straightfoward:

```javascript
describe('baseCharge', () => {
  it('should return 0 when usage is less than 0', () => {
    expect(baseCharge(-1)).toEqual('$0.00');
  });

  it('should return an amount based on the three bands of usage', () => {
    expect(baseCharge(0)).toEqual('$0.00');
    expect(baseCharge(50)).toEqual('$1.50');
    expect(baseCharge(100)).toEqual('$3.00');
    expect(baseCharge(150)).toEqual('$5.50');
    expect(baseCharge(200)).toEqual('$8.00');
    expect(baseCharge(250)).toEqual('$11.50');
  });
});

describe('withinBand', () => {
  it('should return the middle band of usage', () => {
    expect(withinBand(50)).toEqual(0);
    expect(withinBand(100)).toEqual(0);
    expect(withinBand(150)).toEqual(50);
    expect(withinBand(200)).toEqual(100);
    expect(withinBand(250)).toEqual(100);
  });
});
```

With our harness in place, it's time to start.

### Steps

Since we want to generalize the code into a single place, we need a place to start. The optimal place here is `middleBand`, since it's not in either of the extremes. We start with the works by adding the `bottom` and `top` parameters to `middleBand`:

```diff
@@ -16,7 +16,7 @@ export function bottomBand(usage) {
   return Math.min(usage, 100);
 }
-export function middleBand(usage) {
+export function middleBand(usage, bottom, top) {
   return usage > 100 ? Math.min(usage, 200) - 100 : 0;
 }
```

They do nothing at the moment, but will come in handy soon.

We then provide values for `bottom` and `top` to `middleBand` at `baseCharge`:

```diff
@@ -8,7 +8,8 @@ function usd(amount) {
 export function baseCharge(usage) {
   if (usage < 0) return usd(0);
-  const amount = bottomBand(usage) * 0.03 + middleBand(usage) * 0.05 + topBand(usage) * 0.07;
+  const amount =
+    bottomBand(usage) * 0.03 + middleBand(usage, 100, 200) * 0.05 + topBand(usage) * 0.07;
   return usd(amount);
 }
```

and rename `middleBand` to `withinBand`:

```diff
@@ -9,7 +9,7 @@ function usd(amount) {
 export function baseCharge(usage) {
   if (usage < 0) return usd(0);
   const amount =
-    bottomBand(usage) * 0.03 + middleBand(usage, 100, 200) * 0.05 + topBand(usage) * 0.07;
+    bottomBand(usage) * 0.03 + withinBand(usage, 100, 200) * 0.05 + topBand(usage) * 0.07;
   return usd(amount);
 }
@@ -17,7 +17,7 @@ export function bottomBand(usage) {
   return Math.min(usage, 100);
 }
-export function middleBand(usage, bottom, top) {
+export function withinBand(usage, bottom, top) {
   return usage > 100 ? Math.min(usage, 200) - 100 : 0;
 }
```

Now things start to gain form. We start using the `bottom` and `top` parameters at `withinBand`:

```diff
@@ -18,7 +18,7 @@ export function bottomBand(usage) {
 }
 export function withinBand(usage, bottom, top) {
-  return usage > 100 ? Math.min(usage, 200) - 100 : 0;
+  return usage > bottom ? Math.min(usage, top) - bottom : 0;
 }
 export function topBand(usage) {
```

and replace a call to `bottomBand` with `withinBand(usage, 0, 100)` at `baseCharge`:

```diff
@@ -9,7 +9,7 @@ function usd(amount) {
 export function baseCharge(usage) {
   if (usage < 0) return usd(0);
   const amount =
-    bottomBand(usage) * 0.03 + withinBand(usage, 100, 200) * 0.05 + topBand(usage) * 0.07;
+    withinBand(usage, 0, 100) * 0.03 + withinBand(usage, 100, 200) * 0.05 + topBand(usage) * 0.07;
   return usd(amount);
 }
```

Tests still work, so we move forward with removing the `bottomBand` function altogether:

```diff
@@ -13,10 +13,6 @@ export function baseCharge(usage) {
   return usd(amount);
 }
-export function bottomBand(usage) {
-  return Math.min(usage, 100);
-}
-
 export function withinBand(usage, bottom, top) {
   return usage > bottom ? Math.min(usage, top) - bottom : 0;
 }
```

Then, we repeat the process for `topBand`. First, we replace a call to it with `withinBand` at `baseCharge`:

```diff
+++ b/src/usage-charge/index.js
@@ -8,8 +8,12 @@ function usd(amount) {
 export function baseCharge(usage) {
   if (usage < 0) return usd(0);
+
   const amount =
-    withinBand(usage, 0, 100) * 0.03 + withinBand(usage, 100, 200) * 0.05 + topBand(usage) * 0.07;
+    withinBand(usage, 0, 100) * 0.03 +
+    withinBand(usage, 100, 200) * 0.05 +
+    withinBand(usage, 200, Infinity) * 0.07;
+
   return usd(amount);
 }
```

Then simply remove it completely:

```diff
@@ -20,7 +20,3 @@ export function baseCharge(usage) {
 export function withinBand(usage, bottom, top) {
   return usage > bottom ? Math.min(usage, top) - bottom : 0;
 }
-
-export function topBand(usage) {
-  return usage > 200 ? usage - 200 : 0;
-}
```

And that's it! Now `baseCharge` uses only `withinBand` to apply the rules for the three different bands.

### Commit history

Below there's the commit history for the steps detailed above.

| Commit SHA                                                                                                                   | Message                                                                       |
| ---------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------- |
| [e1a8c6f](https://github.com/kaiosilveira/parameterize-function-refactoring/commit/e1a8c6fefc41e1755a9acca9203bdd54bfdcb66b) | add `bottom` and `top` parameters to `middleBand`                             |
| [611beda](https://github.com/kaiosilveira/parameterize-function-refactoring/commit/611beda814fda7030cd791dd9afff4018c60aa7e) | provide `bottom` and `top` values to `middleBand`                             |
| [a130a7b](https://github.com/kaiosilveira/parameterize-function-refactoring/commit/a130a7b9035796b2aada177062b8f73eb2ab8add) | rename `middleBand` to `withinBand`                                           |
| [4e25e4a](https://github.com/kaiosilveira/parameterize-function-refactoring/commit/4e25e4a160dbea2211ec245c0657b36c7d50e7cc) | use `bottom` and `top` parameters at `withinBand`                             |
| [6c69b22](https://github.com/kaiosilveira/parameterize-function-refactoring/commit/6c69b2268451f4edacede6d720b31e414b79ca9d) | replace call to `bottomBand` with `withinBand(usage, 0, 100)` at `baseCharge` |
| [9225fba](https://github.com/kaiosilveira/parameterize-function-refactoring/commit/9225fba7b7de2b7479116caa12a7cad9f10dba20) | remove `bottomBand` function                                                  |
| [36e8dc1](https://github.com/kaiosilveira/parameterize-function-refactoring/commit/36e8dc1cace490d3e64cd743169aaef54c53e406) | replace call to `topBand` with `withinBand` at `baseCharge`                   |
| [f52ca2c](https://github.com/kaiosilveira/parameterize-function-refactoring/commit/f52ca2c4cc7e93a9a19c991070117961d392b637) | remove `topBand` function                                                     |

For the full commit history for this project, check the [Commit History tab](https://github.com/kaiosilveira/parameterize-function-refactoring/commits/main).

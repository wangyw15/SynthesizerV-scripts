# SynthesizerV scripts

# Usage

```bash
deno run --allow-write --allow-read build.ts
```

then copy the files in `build` to the scripts folder

or see [Release](https://github.com/wangyw15/SynthesizerV-scripts/releases)

# Scripts

## fix_char

When I import track from ust, the kana becomes Chinese characters.

After some research, the original file encoding is SHIFT-JIS, but it was decoded as GBK.

Why build instead of use it straightly?

Give it a try, you'll find it doesn't run well.

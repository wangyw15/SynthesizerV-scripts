import * as esbuild from 'esbuild'

// 1 char in GBK is 2 bytes
const GBKRanges = [
  [0xa1, 0xa9, 0xa1, 0xfe],
  [0xb0, 0xf7, 0xa1, 0xfe],
  [0x81, 0xa0, 0x40, 0xfe],
  [0xaa, 0xfe, 0x40, 0xa0],
  [0xa8, 0xa9, 0x40, 0xa0],
  [0xaa, 0xaf, 0xa1, 0xfe],
  [0xf8, 0xfe, 0xa1, 0xfe],
  [0xa1, 0xa7, 0x40, 0xa0],
];

const mappings: { [key: string]: string } = {};

const GBKDecoder = new TextDecoder("gbk");
const ShiftJISDecoder = new TextDecoder("shift-jis");

for (const [b1Start, b1End, b2Start, b2End] of GBKRanges) {
  for (let b1 = b1Start; b1 <= b1End; b1++) {
    for (let b2 = b2Start; b2 <= b2End; b2++) {
      if (b2 !== 0x7f) {
        const bytes = new Uint8Array([b1, b2]);
        const gbkChar = GBKDecoder.decode(bytes);
        const sjisChar = ShiftJISDecoder.decode(bytes);
        if (gbkChar !== sjisChar) {
          mappings[gbkChar] = sjisChar;
        }
      }
    }
  }
}

let mappingPlugin: esbuild.Plugin = {
    name: 'fix_char_mapping',
    setup(build) {
        build.onResolve({ filter: /^fix_char_mapping$/ }, args => {
            return {
              path: args.path,
              namespace: 'fix_char_mapping'
            }
        })
        build.onLoad({ filter: /.*/, namespace: 'fix_char_mapping' }, args => {
            return {
                contents: JSON.stringify({'mapping': mappings}, null, 0),
                loader: 'json',
            }
        })
    },
}

export { mappingPlugin }

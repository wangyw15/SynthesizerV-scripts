const script = `
const mapping = "{DATA}";

function GBK2ShiftJIS(str) {
  var ret = "";
  for (var i = 0; i < str.length; i++) {
    var c = str.charAt(i);
    if (c in mapping) {
      ret += mapping[c];
    } else {
      ret += c;
    }
  }
  return ret;
}

function getTranslations(langCode) {
  if(langCode == "zh-cn") {
    return [
      ["Fix char", "修复乱码"],
      ["Please select notes", "请选择音符"],
      ["Completed", "完成"],
    ];
  }
  return [];
}

function getClientInfo() {
  return {
    "name" : SV.T("Fix encoding"),
    "category" : "",
    "author" : "wangyw15",
    "versionNumber" : 1,
    "minEditorVersion" : 65540
  };
}

function main() {
  var selection = SV.getMainEditor().getSelection();
  var notes = selection.getSelectedNotes();
  if (notes.length === 0) {
    SV.showMessageBox(SV.T("Fix char"), SV.T("Please select notes"));
  } else {
    for (var i = 0; i < notes.length; i++) {
      var note = notes[i];
      note.setLyrics(GBK2ShiftJIS(note.getLyrics()));
    }
    SV.showMessageBox(SV.T("Fix char"), SV.T("Completed"));
  }
  SV.finish();
}
`

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

const mappings: {[key: string]: string} = {};

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

export function generate() {
  return script.replace("\"{DATA}\"", JSON.stringify(mappings, null, 0));
}

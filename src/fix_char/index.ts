import 'sv'
import { mapping } from 'fix_char_mapping'
 
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
      ["Scope", "作用范围"],
      ["Selected notes", "所选音符"],
      ["Current track", "当前音轨"],
      ["Entire project", "整个项目"],
      ["Completed", "完成"],
    ];
  }
  return [];
}

function getClientInfo() {
  return {
    "name" : SV.T("Fix char"),
    "category" : "",
    "author" : "wangyw15",
    "versionNumber" : 1,
    "minEditorVersion" : 65540
  };
}

function main() {
  var form = {
    "title": SV.T("Fix char"),
    "buttons": "OkCancel",
    "widgets": [
      {
        "name": "scope",
        "type": "ComboBox",
        "label": SV.T("Scope"),
        "choices": [
          SV.T("Selected notes"),
          SV.T("Current track"), 
          SV.T("Entire project")],
        "default": 0
      },
    ]
  };

  var result = SV.showCustomDialog(form);

  if (result.status == 1) {
    var notes = [];
    if (result.answers.scope == 0) {
      var selection = SV.getMainEditor().getSelection();
      notes = selection.getSelectedNotes();
    } else
    if (result.answers.scope == 1) {
      var track = SV.getMainEditor().getCurrentTrack();
      for(var i = 0; i < track.getNumGroups(); i++) {
        var group = track.getGroupReference(i).getTarget();
        for (var j = 0; j < group.getNumNotes(); j++) {
          notes.push(group.getNote(j));
        }
      }
    } else
    if (result.answers.scope == 2) {
      var project = SV.getProject();
      for(var i = 0; i < project.getNumNoteGroupsInLibrary(); i++) {
        var group = project.getNoteGroup(i);
        for (var j = 0; j < group.getNumNotes(); j++) {
          notes.push(group.getNote(j));
        }
      }
      for(var i = 0; i < project.getNumTracks(); i ++) {
        var track = project.getTrack(i);
        var group = track.getGroupReference(0).getTarget();
        for (var j = 0; j < group.getNumNotes(); j++) {
          notes.push(group.getNote(j));
        }
      }
    }

    if (notes.length == 0) {
      SV.showMessageBox(SV.T("Fix char"), SV.T("Please select notes"));
    } else {
      for (var i = 0; i < notes.length; i++) {
        var note = notes[i];
        note.setLyrics(GBK2ShiftJIS(note.getLyrics()));
      }
      SV.showMessageBox(SV.T("Fix char"), SV.T("Completed"));
    }
  }
  SV.finish();
}

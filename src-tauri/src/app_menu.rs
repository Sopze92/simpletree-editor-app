
use tauri::{ menu::*, window::Window, AppHandle, Emitter };
use tauri_plugin_dialog::{ DialogExt };

use serde::Serialize;

#[derive(Clone, Serialize)]
struct PayloadSimple<'a> {
  id: &'a str
}

#[derive(Clone, Serialize)]
struct PayloadDialogOpen<'a> {
  id: &'a str,
  data: &'a str
}

#[derive(Clone, Serialize)]
struct PayloadDialogSave<'a>{
  id: &'a str,
  data: &'a str
}

pub(crate) fn handle_menu_event(window:&Window, event:MenuEvent) {

  let id= event.id.as_ref();

  if id.starts_with(&"mido_") {
    let result: String;
    match id {
      "mido_file_open" => result= show_dialog_open(window, 0).to_string(),
      "mido_file_import" => result= show_dialog_open(window, 1).to_string(),
      _ => {
        println!("no such dialog with id: {}", id);
        return;
      }
    }
    let data= result.as_str();
    window.emit("menu-dialog-open", PayloadDialogOpen{ id, data }).unwrap();
  }
  else if id.starts_with(&"mids_") {
    // TODO: save result
    let result= String::from("placeholder");
    match id {
      "mids_file_saveas" => show_dialog_save(window, 0),
      "mids_file_export" => show_dialog_save(window, 1),
      _ => {
        println!("no such dialog with id: {}", id);
        return;
      }
    }
    let data= result.as_str();
    window.emit("menu-dialog-save", PayloadDialogSave{ id, data }).unwrap();
  }
  else {
    window.emit("menu-item-click", PayloadSimple{ id }).unwrap();
  }
}

fn show_dialog_open(window:&Window, mode:i32) -> String {

  let mut path= String::from("");

  match mode {
    0=> {
      path= match window.dialog().file()
        .set_title("Open File")
        .add_filter("sTrevee Files", &["tre"] )
        .add_filter("All Files", &["*"] )
        .blocking_pick_file() {
          Some(value) => value.to_string(),
          None => "!cancelled".to_string()
        }
    }
    1=> {
      path= match window.dialog().file()
        .set_title("Import File")
        .add_filter("Extensible Markup Language", &["xml"] )
        .add_filter("HyperText Markup Language", &["htm","html"] )
        .add_filter("JavaScript Object Notation", &["json"] )
        .add_filter("Windows hierarchycal definition file", &["reg", "ini"] )
        .add_filter("Text File", &["txt"] )
        .blocking_pick_file() {
          Some(value) => value.to_string(),
          None => "!cancelled".to_string()
        }
    }
    _=> {
      println!("invalid open dialog mode {}", mode);
    }
  }
  
  println!("open dialog {}", mode);
  return path;
}

fn show_dialog_save(window:&Window, mode:i32) {

  match mode {
    0=> {
      window.dialog().file()
        .set_title("Save File")
        .add_filter("sTrevee File", &["tre"] )
        .add_filter("Any File", &["*"] )
        .blocking_save_file();
    }
    1=> {
      window.dialog().file()
        .set_title("Export File")
        .add_filter("Plain XML", &["xml"] )
        .add_filter("XML with embebbed XSLT", &["xml"] )
        .add_filter("XML + XSLT pair", &["xml *.xslt"] )
        .add_filter("HTML with embebbed JavaScript + CSS", &["html"] )
        .add_filter("HTML with embebbed JavaScript", &["html *.css"] )
        .add_filter("HTML without embebbings", &["html *.js *.css"] )
        .add_filter("Windows hierarchycal definition file", &["reg", "ini"] )
        .add_filter("Text File (Pretty)", &["txt"] )
        .add_filter("Plain Text File", &["txt"] )
        .blocking_save_file();
    }
    _=> {
      println!("invalid open dialog mode {}", mode);
      return;
    }
  }

  println!("save dialog {}", mode);
}

pub(crate) fn build(handle: &AppHandle) -> Menu<tauri::Wry> {
  return MenuBuilder::new(handle)
    .items(&[

      /* FILE MENU */
      &SubmenuBuilder::with_id(handle, "ml_file","File")
        .items(&[
          &MenuItem::with_id(handle, "mi_file_new","New", true, Some(&"cmdorctrl+n")).unwrap(),
          &MenuItem::with_id(handle, "mido_file_open", "Open", true, Some(&"cmdorctrl+o")).unwrap(),
          &MenuItem::with_id(handle, "mi_file_reload", "Reload", false, Some(&"cmdorctrl+f5")).unwrap(),
        ]).separator().items(&[
          &MenuItem::with_id(handle, "mi_file_save","Save", true, Some(&"cmdorctrl+s")).unwrap(),
          &MenuItem::with_id(handle, "mids_file_saveas", "Save As", true, Some(&"cmdorctrl+shift+s")).unwrap(),
        ]).separator().items(&[
          &MenuItem::with_id(handle, "mido_file_import", "Import", true, None::<&str>).unwrap(),
          &MenuItem::with_id(handle, "mids_file_export", "Export", true, None::<&str>).unwrap(),
        ]).separator()
        .item(&MenuItem::with_id(handle, "mi_file_exit","Exit", true, None::<&str>).unwrap())
        .build().unwrap(),

      /* EDIT MENU */
      &SubmenuBuilder::with_id(handle, "ml_edit","Edit")
        .items(&[
          &MenuItem::with_id(handle, "mi_edit_undo","Undo", false, Some(&"cmdorctrl+z")).unwrap(),
          &MenuItem::with_id(handle, "mi_edit_redo", "Redo", false, Some(&"cmdorctrl+y")).unwrap(),
        ]).separator().items(&[
          &MenuItem::with_id(handle, "mi_edit_selall","Select all", false, Some(&"cmdorctrl+a")).unwrap(),
          &MenuItem::with_id(handle, "mi_edit_deselall", "Deselect all", false, Some(&"cmdorctrl+shift+a")).unwrap(),
          &MenuItem::with_id(handle, "mi_edit_invsel", "Invert selection", false, Some(&"cmdorctrl+i")).unwrap(),
        ]).separator().items(&[
          &SubmenuBuilder::with_id(handle, "ml_edit_treeview","Tree-view")
            .items(&[
              &MenuItem::with_id(handle, "mi_treeview_closeall","Collapse all", false, None::<&str>).unwrap(),
              &MenuItem::with_id(handle, "mi_treeview_openall", "Expand all", false, None::<&str>).unwrap(),
            ]).separator().items(&[
              &MenuItem::with_id(handle, "mi_treeview_closesel","Collapse selected", false, None::<&str>).unwrap(),
              &MenuItem::with_id(handle, "mi_treeview_opensel", "Expand selected", false, None::<&str>).unwrap(),
            ])
            .build().unwrap(),
          &MenuItem::with_id(handle, "mi_edit_theme", "Theme", true, None::<&str>).unwrap(),
          &MenuItem::with_id(handle, "mi_edit_presets", "Presets", true, None::<&str>).unwrap(),
          &MenuItem::with_id(handle, "mi_edit_defaults", "Defaults", true, None::<&str>).unwrap(),
        ]).separator().items(&[
          &MenuItem::with_id(handle, "mi_edit_config", "Preferences", true, Some(&"cmdorctrl+p")).unwrap(),
        ])
        .build().unwrap(),
      
      /* VIEW MENU */
      &SubmenuBuilder::with_id(handle, "ml_view","View")
        .items(&[
          &MenuItem::with_id(handle, "mi_view_menubar", "Menu bar", true, Some(&"f2")).unwrap(),
          &MenuItem::with_id(handle, "mi_view_statusbar", "Status bar", true, None::<&str>).unwrap(),
          &MenuItem::with_id(handle, "mi_view_decorated", "Decorated", true, Some(&"f10")).unwrap(),
        ]).separator().items(&[
          &MenuItem::with_id(handle, "mi_view_language", "Language", true, None::<&str>).unwrap(),
          &MenuItem::with_id(handle, "mi_view_appearance", "Appearance", true, None::<&str>).unwrap(),
        ]).separator().items(&[
          &MenuItem::with_id(handle, "mi_view_tools", "Tools", true, Some(&"t")).unwrap(),
          &MenuItem::with_id(handle, "mi_view_panel", "Panel", true, Some(&"n")).unwrap(),
        ])
        .build().unwrap(),

      /* HELP MENU */
      &SubmenuBuilder::with_id(handle, "ml_help","Help")
        .items(&[
          &MenuItem::with_id(handle, "mi_help_docs", "See Docs in GitHub", true, Some(&"f1")).unwrap(),
          &MenuItem::with_id(handle, "mi_help_updates", "Check for updates", true, None::<&str>).unwrap(),
        ]).separator().items(&[
          &MenuItem::with_id(handle, "mi_help_report", "Share Feedback / Issues", true, None::<&str>).unwrap(),
          &MenuItem::with_id(handle, "mi_help_contribs", "How to contribute", true, None::<&str>).unwrap(),
        ]).separator()
        .item(&MenuItem::with_id(handle, "mi_help_about","About sTrevee Editor", true, Some(&"cmdorctrl+f12")).unwrap())
        .build().unwrap()

    ]).build().unwrap();
}
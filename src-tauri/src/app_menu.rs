
use std::{borrow::Borrow, fs::File};

use tauri::{ menu::*, window::Window, AppHandle, Emitter };
use tauri_plugin_dialog::{ DialogExt, FilePath };

pub(crate) fn handle_menu_event(window:&Window, event:MenuEvent) {
  println!("item: {}", event.id().as_ref());

  let itemid= event.id.as_ref();

  if itemid.starts_with(&"mido_") {
    let result: String;
    match itemid {
      "mido_file_open" => result= show_dialog_open(window, 0).to_string(),
      "mido_file_import" => result= show_dialog_open(window, 1).to_string(),
      _ => {
        println!("no such dialog with id: {}", itemid);
        return;
      }
    }
    window.emit("menu-dialog-open", (itemid, result)).unwrap();
  }
  else if itemid.starts_with(&"mids_") {
    // TODO: save result
    let result= "placeholder";
    match itemid {
      "mids_file_saveas" => show_dialog_save(window, 0),
      "mids_file_export" => show_dialog_save(window, 1),
      _ => {
        println!("no such dialog with id: {}", itemid);
        return;
      }
    }
    window.emit("menu-dialog-save", (itemid, result)).unwrap();
  }
  else {
    window.emit("menu-item-click", itemid).unwrap();
  }
}

fn show_dialog_open(window:&Window, mode:i32) -> String {

  // no way to use a singlematch or if/else here, dialog is not mutable nor implements Copy trait
  // pd: thanks Rust, you're with no doubt the worst language ever made

  let mut path= String::from("");

  match mode {
    0=> {
      path= window.dialog().file()
        .set_title("Open File")
        .add_filter("sTrevee Files", &["tre"] )
        .add_filter("All Files", &["*"] )
        .blocking_pick_file().unwrap().to_string();
    }
    1=> {
      path= window.dialog().file()
        .set_title("Import File")
        .add_filter("Extensible Markup Language", &["xml"] )
        .add_filter("HyperText Markup Language", &["htm","html"] )
        .add_filter("JavaScript Object Notation", &["json"] )
        .add_filter("Windows hierarchycal definition file", &["reg", "ini"] )
        .add_filter("Text File", &["txt"] )
        .blocking_pick_file().unwrap().to_string();
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
          &MenuItem::with_id(handle, "mi_file_new","New", true, None::<&str>).unwrap(),
          &MenuItem::with_id(handle, "mido_file_open", "Open", true, None::<&str>).unwrap(),
          &MenuItem::with_id(handle, "mi_file_reload", "Reload", false, None::<&str>).unwrap(),
        ]).separator().items(&[
          &MenuItem::with_id(handle, "mi_file_save","Save", true, None::<&str>).unwrap(),
          &MenuItem::with_id(handle, "mids_file_saveas", "Save As", true, None::<&str>).unwrap(),
        ]).separator().items(&[
          &MenuItem::with_id(handle, "mido_file_import", "Import", true, None::<&str>).unwrap(),
          &MenuItem::with_id(handle, "mids_file_export", "Export", true, None::<&str>).unwrap(),
        ]).separator()
        .item(&MenuItem::with_id(handle, "mi_file_exit","Exit", true, None::<&str>).unwrap())
        .build().unwrap(),

      /* EDIT MENU */
      &SubmenuBuilder::with_id(handle, "ml_edit","Edit")
        .items(&[
          &MenuItem::with_id(handle, "mi_edit_undo","Undo", false, None::<&str>).unwrap(),
          &MenuItem::with_id(handle, "mi_edit_redo", "Redo", false, None::<&str>).unwrap(),
        ]).separator().items(&[
          &MenuItem::with_id(handle, "mi_edit_selall","Select all", false, None::<&str>).unwrap(),
          &MenuItem::with_id(handle, "mi_edit_deselall", "Deselect all", false, None::<&str>).unwrap(),
          &MenuItem::with_id(handle, "mi_edit_invsel", "Invert selection", false, None::<&str>).unwrap(),
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
          &MenuItem::with_id(handle, "mi_edit_config", "Preferences", true, None::<&str>).unwrap(),
        ])
        .build().unwrap(),
      
      /* VIEW MENU */
      &SubmenuBuilder::with_id(handle, "ml_view","View")
        .items(&[
          &MenuItem::with_id(handle, "mi_view_menubar", "Title menus", true, None::<&str>).unwrap(),
          &MenuItem::with_id(handle, "mi_view_statusbar", "Status bar", true, None::<&str>).unwrap(),
        ]).separator().items(&[
          &MenuItem::with_id(handle, "mi_view_language", "Language", true, None::<&str>).unwrap(),
          &MenuItem::with_id(handle, "mi_view_appearance", "Appearance", true, None::<&str>).unwrap(),
        ]).separator().items(&[
          &MenuItem::with_id(handle, "mi_view_tools", "Tools", true, None::<&str>).unwrap(),
          &MenuItem::with_id(handle, "mi_view_actions", "Actions", true, None::<&str>).unwrap(),
          &MenuItem::with_id(handle, "mi_view_styles", "Styles", true, None::<&str>).unwrap(),
        ])
        .build().unwrap(),

      /* HELP MENU */
      &SubmenuBuilder::with_id(handle, "ml_help","Help")
        .items(&[
          &MenuItem::with_id(handle, "mi_help_docs", "See Docs in GitHub", true, None::<&str>).unwrap(),
          &MenuItem::with_id(handle, "mi_help_updates", "Check for updates", true, None::<&str>).unwrap(),
        ]).separator().items(&[
          &MenuItem::with_id(handle, "mi_help_report", "Share Feedback / Issues", true, None::<&str>).unwrap(),
          &MenuItem::with_id(handle, "mi_help_contribs", "How to contribute", true, None::<&str>).unwrap(),
        ]).separator()
        .item(&MenuItem::with_id(handle, "mi_help_about","About sTrevee Editor", true, None::<&str>).unwrap())
        .build().unwrap()

    ]).build().unwrap();
}
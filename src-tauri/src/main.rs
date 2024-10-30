// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use tauri::{Env, Manager, menu::*, window::*};

mod api;

fn main() {

  tauri::Builder::default()
    .plugin(tauri_plugin_shell::init())
    .invoke_handler(tauri::generate_handler![
      api::splash_end,
      api::open_window_menu,
      api::exec_window_action,
      api::set_window_position
    ])
    .setup(|app| {

      let args= app.state::<Env>().args_os.clone();
      let arg_nosplash= args.contains(&"--nosplash".into());

      if !arg_nosplash {

        // splash screen window
      
        let _splash_window= WindowBuilder::new(app, "splash")
          .decorations(false).transparent(true).shadow(false).skip_taskbar(true)
          .resizable(false).maximizable(false).minimizable(false).closable(false)
          .inner_size(512.0, 512.0).center()
          .build()
          .unwrap();
        let splash_webview = tauri::webview::WebviewBuilder::new("splash_wv", tauri::WebviewUrl::App("splash.html".into()))
          .transparent(true);
        _splash_window.add_child(splash_webview, tauri::LogicalPosition::new(0, 0), _splash_window.inner_size().unwrap());
        //_splash_window.get_webview("splash_wv").unwrap().open_devtools();

        _splash_window.set_focus();
      }

      // main window

      let handle= app.handle().clone();
      
      let menubar= MenuBuilder::new(&handle)
        .items(&[

          /* FILE MENU */
          &SubmenuBuilder::with_id(&handle, "ml_file","File")
            .items(&[
              &MenuItem::with_id(&handle, "mi_file_new","New", true, None::<&str>)?,
              &MenuItem::with_id(&handle, "mi_file_open", "Open", true, None::<&str>)?,
              &MenuItem::with_id(&handle, "mi_file_reload", "Reload", false, None::<&str>)?,
            ]).separator().items(&[
              &MenuItem::with_id(&handle, "mi_file_save","Save", false, None::<&str>)?,
              &MenuItem::with_id(&handle, "mi_file_saveas", "Save As", false, None::<&str>)?,
            ]).separator().items(&[
              &MenuItem::with_id(&handle, "mi_file_import", "Import", false, None::<&str>)?,
              &MenuItem::with_id(&handle, "mi_file_export", "Export", false, None::<&str>)?,
            ]).separator()
            .item(&MenuItem::with_id(&handle, "mi_file_exit","Exit", true, None::<&str>)?)
            .build()?,

          /* EDIT MENU */
          &SubmenuBuilder::with_id(&handle, "ml_edit","Edit")
            .items(&[
              &MenuItem::with_id(&handle, "mi_edit_undo","Undo", false, None::<&str>)?,
              &MenuItem::with_id(&handle, "mi_edit_redo", "Redo", false, None::<&str>)?,
            ]).separator().items(&[
              &MenuItem::with_id(&handle, "mi_edit_selall","Select all", false, None::<&str>)?,
              &MenuItem::with_id(&handle, "mi_edit_deselall", "Deselect all", false, None::<&str>)?,
              &MenuItem::with_id(&handle, "mi_edit_invsel", "Invert selection", false, None::<&str>)?,
            ]).separator().items(&[
              &SubmenuBuilder::with_id(&handle, "ml_edit_treeview","Tree-view")
                .items(&[
                  &MenuItem::with_id(&handle, "mi_treeview_closeall","Collapse all", false, None::<&str>)?,
                  &MenuItem::with_id(&handle, "mi_treeview_openall", "Expand all", false, None::<&str>)?,
                ]).separator().items(&[
                  &MenuItem::with_id(&handle, "mi_treeview_closesel","Collapse selected", false, None::<&str>)?,
                  &MenuItem::with_id(&handle, "mi_treeview_opensel", "Expand selected", false, None::<&str>)?,
                ])
                .build()?,
              &MenuItem::with_id(&handle, "mi_edit_theme", "Theme", true, None::<&str>)?,
              &MenuItem::with_id(&handle, "mi_edit_presets", "Presets", true, None::<&str>)?,
              &MenuItem::with_id(&handle, "mi_edit_defaults", "Defaults", true, None::<&str>)?,
            ]).separator().items(&[
              &MenuItem::with_id(&handle, "mi_edit_config", "Preferences", true, None::<&str>)?,
            ])
            .build()?,
          
          /* VIEW MENU */
          &SubmenuBuilder::with_id(&handle, "ml_view","View")
            .items(&[
              &MenuItem::with_id(&handle, "mi_view_menubar", "Title menus", true, None::<&str>)?,
              &MenuItem::with_id(&handle, "mi_view_statusbar", "Status bar", true, None::<&str>)?,
            ]).separator().items(&[
              &MenuItem::with_id(&handle, "mi_view_language", "Language", true, None::<&str>)?,
              &MenuItem::with_id(&handle, "mi_view_appearance", "Appearance", true, None::<&str>)?,
            ]).separator().items(&[
              &MenuItem::with_id(&handle, "mi_view_tools", "Tools", true, None::<&str>)?,
              &MenuItem::with_id(&handle, "mi_view_actions", "Actions", true, None::<&str>)?,
              &MenuItem::with_id(&handle, "mi_view_styles", "Styles", true, None::<&str>)?,
            ])
            .build()?,

          /* HELP MENU */
          &SubmenuBuilder::with_id(&handle, "ml_help","Help")
            .items(&[
              &MenuItem::with_id(&handle, "mi_help_docs", "See Docs in GitHub", true, None::<&str>)?,
              &MenuItem::with_id(&handle, "mi_help_updates", "Check for updates", true, None::<&str>)?,
            ]).separator().items(&[
              &MenuItem::with_id(&handle, "mi_help_report", "Share Feedback / Issues", true, None::<&str>)?,
              &MenuItem::with_id(&handle, "mi_help_contribs", "How to contribute", true, None::<&str>)?,
            ]).separator()
            .item(&MenuItem::with_id(&handle, "mi_help_about","About sTrevee Editor", true, None::<&str>)?)
            .build()?

        ]).build()?;
    
      let _main_window= WindowBuilder::new(app, "main")
        .title("sTrevee Editor").decorations(false)
        .inner_size(1280.0, 720.0).center()
        .menu(menubar)
        .visible(arg_nosplash)
        .on_menu_event(move |window, event| {
          println!("item: {}", event.id().as_ref());
        })
        .build()
        .unwrap();
      let main_webview = tauri::webview::WebviewBuilder::new("main_wv", tauri::WebviewUrl::App("index.html".into()));
      _main_window.add_child(main_webview, tauri::LogicalPosition::new(0, 0), _main_window.inner_size().unwrap());

      if arg_nosplash { 
        _main_window.get_webview("main_wv").unwrap().open_devtools();
        _main_window.set_focus();
      }
      
      Ok(())
    })
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}
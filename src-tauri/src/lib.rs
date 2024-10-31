// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use tauri::{window::*, Env, Manager};

mod app_menu;
mod api;

pub fn init() {

  tauri::Builder::default()
    .plugin(tauri_plugin_dialog::init())
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
    
      let _main_window= WindowBuilder::new(app, "main")
        .decorations(true).transparent(false).shadow(true).skip_taskbar(false)
        .resizable(true).maximizable(true).minimizable(true).closable(true).visible(arg_nosplash)
        .title("sTrevee Editor").menu(app_menu::build(&app.handle().clone()))
        .inner_size(1280.0, 720.0).center()
        .min_inner_size(480.0, 512.0)
        .on_menu_event(app_menu::handle_menu_event)
        .build()
        .unwrap();
      let main_webview = tauri::webview::WebviewBuilder::new("main_wv", tauri::WebviewUrl::App("index.html".into()));
      _main_window.hide_menu();
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
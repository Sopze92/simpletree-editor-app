// Prevents additional console window on Windows in release
// #![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use tauri::{WebviewWindowBuilder, Env, Manager};

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

      let _is_dev= true;

      let args= app.state::<Env>().args_os.clone();
      let arg_nosplash= args.contains(&"--nosplash".into());

      if !arg_nosplash {

        // splash screen window
      
        let _splash_window= WebviewWindowBuilder::new(app, "splash", tauri::WebviewUrl::App("splash.html".into()))
          .decorations(false).transparent(true).shadow(false).skip_taskbar(true)
          .resizable(false).maximizable(false).minimizable(false).closable(false)
          .inner_size(512.0, 512.0).center()
          .devtools(false).disable_drag_drop_handler()
          .build()
          .unwrap();

        _splash_window.set_focus();
      }

      // main window
    
      let _main_window= WebviewWindowBuilder::new(app, "main", tauri::WebviewUrl::App("index.html".into()))
        .decorations(true).transparent(false).shadow(true).skip_taskbar(false)
        .resizable(true).maximizable(true).minimizable(true).closable(true).visible(arg_nosplash)
        .title("sTrevee Editor").menu(app_menu::build(&app.handle().clone()))
        .inner_size(1280.0, 720.0).center()
        .min_inner_size(480.0, 512.0)
        .on_menu_event(app_menu::handle_menu_event)
        .devtools(_is_dev).disable_drag_drop_handler()
        .build()
        .unwrap();

      if arg_nosplash {
        if _is_dev { _main_window.open_devtools() }
        _main_window.set_focus();
      }
      
      Ok(())
    })
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}
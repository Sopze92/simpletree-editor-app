// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use tauri::Env;
use tauri::menu::*;
use tauri::window::*;
use tauri::Manager;

mod api;

fn main() {

  tauri::Builder::default()
    .plugin(tauri_plugin_shell::init())
    .invoke_handler(tauri::generate_handler![
      api::splash_end,
      api::open_window_menu
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
      let close_menu_item=    MenuItem::new(&handle, "Close", true, None::<&str>)?;
      let restart_menu_item=  MenuItem::new(&handle, "Restart", true, None::<&str>)?;
      let exit_menu_item=     MenuItem::new(&handle, "Exit", true, None::<&str>)?;
    
      let _menu= Menu::default(&handle)?;
      
      _menu.append_items(&[
        &Submenu::with_id_and_items(&handle, "menu_cuajo","Cuajada", true, &[
          &close_menu_item,
          &restart_menu_item,
          &exit_menu_item,
        ])?,
      ])?;
    
      let _main_window= WindowBuilder::new(app, "main")
        .title("sTrevee Editor")
        .inner_size(1280.0, 720.0).center()
        .menu(_menu)
        .visible(arg_nosplash)
        .on_menu_event(move |window, event| {
          if event.id == close_menu_item.id() { window.close().unwrap() }
          else if event.id == restart_menu_item.id() { handle.restart() }
          else if event.id == exit_menu_item.id() { handle.exit(0) }
        })
        .build()
        .unwrap();
      let main_webview = tauri::webview::WebviewBuilder::new("main_wv", tauri::WebviewUrl::App("index.html".into()));
      _main_window.add_child(main_webview, tauri::LogicalPosition::new(0, 0), _main_window.inner_size().unwrap());

      if !arg_nosplash { _main_window.get_webview("main_wv").unwrap().open_devtools() }
      
      Ok(())
    })
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}

use tauri::{menu::*, AppHandle, Manager};

#[tauri::command]
pub fn splash_end(handle: AppHandle){
  handle.get_window("splash").unwrap().destroy();
  let _main_window= handle.get_window("main").unwrap();
  
  _main_window.show();
  _main_window.set_focus();
  _main_window.get_webview("main_wv").unwrap().open_devtools();
}

#[tauri::command]
pub fn open_window_menu(handle: AppHandle, menuname: &str) {
  let _window= handle.get_window("main").unwrap();
  let _name:MenuId= menuname.into();
  _window.menu().unwrap().get(menuname).unwrap().as_submenu().unwrap().popup(_window);
}
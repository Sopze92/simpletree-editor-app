
use tauri::{menu::*, window::*, AppHandle, Position, PhysicalPosition, Manager};

#[tauri::command]
pub fn splash_end(handle: AppHandle){
  handle.get_window("splash").unwrap().destroy();
  let _main_window= handle.get_webview_window("main").unwrap();
  
  _main_window.show();
  _main_window.set_focus();
  _main_window.open_devtools();
}

#[tauri::command]
pub fn open_window_menu(handle: AppHandle, mid: &str, coords:Vec<i32>) {
  let _window= handle.get_window("main").unwrap();
  let _name:MenuId= mid.into();

  let _pos= Position::Physical(PhysicalPosition::new(coords.get(0).unwrap().clone(), coords.get(1).unwrap().clone()));

  _window.menu().unwrap().get(mid).unwrap().as_submenu().unwrap().popup_at(_window, _pos);
}

#[tauri::command]
pub fn exec_window_action(handle: AppHandle, action: &str) {

  let _window:Window = match handle.get_focused_window() { Some(value) => value, None => return };

  match action {
    "menubar" => { if _window.is_menu_visible().unwrap() { _window.hide_menu() } else { _window.show_menu() }; }
    "decorated" => { _window.set_decorations( if _window.is_decorated().unwrap() { false } else { true } ); }
    "minimize" => { if _window.is_minimizable().unwrap() && !_window.is_minimized().unwrap() { _window.minimize(); } }
    "maximize" => { if _window.is_maximizable().unwrap() { if _window.is_maximized().unwrap() { _window.unmaximize(); } else { _window.maximize(); } } }
    "close" => { handle.exit(0); }
    _ => return
  }
}

#[tauri::command]
pub fn set_window_position(handle: AppHandle, coords:Vec<i32>) {

  let _window:Window = handle.get_focused_window().unwrap();
  let _pos= Position::Physical(PhysicalPosition::new(coords.get(0).unwrap().clone(), coords.get(1).unwrap().clone()));

  if _window.is_maximized().unwrap() { _window.unmaximize(); } 
  _window.set_position(_pos);
}
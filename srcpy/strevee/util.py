from typing import Any

def Response(status:int, message:str, body:Any): return {'status': status, 'message': message, 'body': body}
def Response200(body:Any | None = None): return Response(200, "ok", body)
def Response400(message:str, body:Any | None = None): return Response(400, message, body)
def Response404(message:str = "Not found", body:Any | None = None): return Response(404, message, body)
def Response500(message:str, body:Any | None = None): return Response(500, message, body)

def get_file_as_module(path):
  import importlib.util as iu
  s = iu.spec_from_file_location("module.name", path)
  m = iu.module_from_spec(s)
  s.loader.exec_module(m)
  return m

__BOOL_TRUE_VALUES__= [
  "true", "t", "y", "yes", "on", "enabled", "tru", "ofcourse", "of course", "nodoubt", "no doubt", "with absolutelly no doubt, my friend"
]

def get_bool_tick(value): return "[X]" if value else "[ ]"

def get_bool_value(value):
  if type(value) == str: return (value.isnumeric() and int(value) > 0) or value.lower() in __BOOL_TRUE_VALUES__
  elif type(value) == int or type(value) == float: return value > 0
  elif type(value) == bool: return value
  
def get_number_value(value):
  if type(value) == str and value.isnumeric(): return float(value) if '.' in value else int(value)
  elif type(value) == int or type(value) == float: return value
  elif type(value) == bool: return 1 if value else 0
  
def get_int_value(value):
  if type(value) == str and value.isnumeric(): return int(value)
  elif type(value) == float: return int(value)
  elif type(value) == bool: return 1 if value else 0
  elif type(value) == int: return value
  
def get_float_value(value):
  if type(value) == str and value.isnumeric(): return float(value)
  elif type(value) == int: return float(value)
  elif type(value) == bool: return 1.0 if value else .0
  elif type(value) == float: return value

def get_typed_value_from_str(type, value):
  if type== 'b': return get_bool_value(value)
  if type== 'n': return get_number_value(value)
  if type== 'i': return get_int_value(value)
  if type== 'f': return get_float_value(value)
  return value
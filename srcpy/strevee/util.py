from typing import Any

# http responses

def Response(status:int, message:str, body:Any | None = None): return {'status': status, 'message': message, 'body': body}
def Response200(body:Any | None = None): return Response(200, "ok", body)
def Response400(message:str, body:Any | None = None): return Response(400, message, body)
def Response404(message:str = "Not found", body:Any | None = None): return Response(404, message, body)
def Response500(message:str, body:Any | None = None): return Response(500, message, body)

# signatures and ownership

def _get_signature(*l): return sum([hash(f.__code__) for f in l])
def _get_signature_plugin(c): return _get_signature(c.__init__, c.__del__, c.__stv_reg__, c.__stv_rem__, c.__stv_meta__)
def _is_function_owned(c, f:callable): return f.__self__.__class__ == c if '__self__' in f.__dict__ else False

# dict util

def check_dict_surface(dict_:dict, surface:tuple[str], strict:bool=True, bounds:bool=True):
  # strict: dict must have all keys provided
  # bounds: extra keys other than provided are not allowed
  d= dict_.copy()
  for e in dict_.keys():
    if e in surface: del d[e]
    elif bounds: return False
  if strict and len(d.keys()) > 0: return False
  return True

# value parsing

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
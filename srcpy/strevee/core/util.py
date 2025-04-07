
__BOOL_TRUE_VALUES__= [
  "true", "t", "y", "yes", "on", "enabled", "tru", "ofcourse", "of course", "nodoubt", "no doubt", "with absolutelly no doubt, my friend"
]

def getBoolValue(value):
  if type(value) == str: return (value.isnumeric() and int(value) > 0) or value.lower() in __BOOL_TRUE_VALUES__
  elif type(value) == int or type(value) == float: return value > 0
  elif type(value) == bool: return value
  
def getNumberValue(value):
  if type(value) == str and value.isnumeric(): return float(value) if '.' in value else int(value)
  elif type(value) == int or type(value) == float: return value
  elif type(value) == bool: return 1 if value else 0
  
def getIntValue(value):
  if type(value) == str and value.isnumeric(): return int(value)
  elif type(value) == float: return int(value)
  elif type(value) == bool: return 1 if value else 0
  elif type(value) == int: return value
  
def getFloatValue(value):
  if type(value) == str and value.isnumeric(): return float(value)
  elif type(value) == int: return float(value)
  elif type(value) == bool: return 1.0 if value else .0
  elif type(value) == float: return value

def getTypedValueStr(type, value):
  if type== 'b': return getBoolValue(value)
  if type== 'n': return getNumberValue(value)
  if type== 'i': return getIntValue(value)
  if type== 'f': return getFloatValue(value)
  return value
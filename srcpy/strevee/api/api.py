def response(status:int, message:str, *kwargs:any):
  return {"status": status, "message": message, "data": kwargs}

class app_api():

  def healthcheck():
    return response(200, 'ok')
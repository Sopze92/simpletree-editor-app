def response(status:int, message:str, *kwargs:any):
  return {"status": status, "message": message, "data": kwargs}

class app_api():

  def healthcheck(self):
    return response(200, 'ok')
  
  def open_url(self, url):
    import webbrowser
    result= webbrowser.open(url, new=0, autoraise=True)
    return response(200, 'ok') if result else response(400, 'failed')

with open('_internal/version.txt', "r+") as fstream:
  line= fstream.readline().strip().replace('\n',''.replace('\r',''))

  version= [int(e) for e in line.split('.')]
  version[-1]= version[-1]+1

  fstream.seek(0)
  fstream.write('.'.join(str(e) for e in version))
  fstream.truncate()
  fstream.close()
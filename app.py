import requests
import os
import json
import argparse

url = "http://localhost:3000"
parser = argparse.ArgumentParser(description="A script to upload, download, or repair ontologies from knowledge grap alignment repair as a service")

parser.add_argument("parameter", choices=["upload", "download", "repair"], help="the action to perform")

args = parser.parse_args()

parameter = args.parameter

upload_file = ""

if parameter == "upload":
  upload_file = input("Enter the file path: ")

  if not os.path.isfile(upload_file):
    print("File not found:", upload_file)
    exit(1)

  upload_url = url + '/upload'
  upload_data = {'file': open(upload_file, 'rb')}
  upload_response = requests.post(upload_url, files=upload_data)

  if upload_response.status_code == 200:
    print("Successfully uploaded", upload_file)
    print(json.dumps(json.loads(upload_response.text), indent=2, sort_keys=True))
  else:
    print("An error occurred while uploading", upload_file, "HTTP status code:", upload_response.status_code, "Response:", upload_response.text)

elif parameter == "download":
  download_req_id = input("Enter the requestId: ")

  download_url = url + '/download'
  download_data = json.dumps({
    "requestId": download_req_id
  })
  download_headers = {'Content-Type': 'application/json'}
  download_response = requests.get(download_url, headers=download_headers, data=download_data)

  if download_response.status_code == 200:
    with open(f"./{download_req_id}.zip", "wb") as f:
      f.write(download_response.content)
      print("Successfully downloaded", download_req_id)
  else:
    print("An error occurred while downloading", download_req_id)

elif parameter == "repair":
  repair_url = url + '/repair'
  
  ontology_id1 = input("Enter the ontologyId1: ")
  ontology_id2 = input("Enter the ontologyId2: ")
  align_id = input("Enter the alignId: ")
  ref_id = input("Enter the refId: ")
  service = input("Enter the service (logmap, alcomo): ")

  repair_data = json.dumps({
      "ontologyId1": ontology_id1,
      "ontologyId2": ontology_id2,
      "alignId": align_id,
      "refId": ref_id,
      "service": service
  })

  repair_headers = {'Content-Type': 'application/json'}
  repair_response = requests.post(repair_url, headers=repair_headers, data=repair_data)

  if repair_response.status_code == 201:
    print("Successfully created repair")
    print(json.dumps(json.loads(repair_response.text), indent=2, sort_keys=True))
  else:
    print("An error occurred while repairing", json.dumps(json.loads(repair_response.text), indent=2, sort_keys=True))

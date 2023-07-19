import requests
import os
import json
import sys

url = "http://localhost:3000"

if len(sys.argv) < 2:
    print("Invalid command format. Usage:")
    print("upload /filepath")
    print("download download_req_id")
    print("repair ontology_id1 ontology_id2 align_id ref_id service")
    exit(1)

command = sys.argv[1]

if command == "upload":
    if len(sys.argv) != 3:
        print("Invalid command format. Usage: upload /filepath")
        exit(1)

    upload_file = sys.argv[2]

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
        print("An error occurred while uploading", upload_file, "HTTP status code:", upload_response.status_code,
              "Response:", upload_response.text)

elif command == "download":
    if len(sys.argv) != 3:
        print("Invalid command format. Usage: download download_req_id")
        exit(1)

    download_req_id = sys.argv[2]

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

elif command == "repair":
    if len(sys.argv) != 7:
        print("Invalid command format. Usage: repair ontology_id1 ontology_id2 align_id ref_id service")
        exit(1)

    repair_url = url + '/repair'

    ontology_id1 = sys.argv[2]
    ontology_id2 = sys.argv[3]
    align_id = sys.argv[4]
    ref_id = sys.argv[5]
    service = sys.argv[6]

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
        print("An error occurred while repairing",
              json.dumps(json.loads(repair_response.text), indent=2, sort_keys=True))
else:
    print("Invalid command.")

import time
import requests
import os
import json
import sys

url = "http://localhost:3001"

def upload_file(file_path):
    if not os.path.isfile(file_path):
        print("File not found:", file_path)
        return None

    upload_url = f"{url}/upload"
    upload_data = {'file': open(file_path, 'rb')}
    upload_response = requests.post(upload_url, files=upload_data)

    if upload_response.status_code == 200:
        print("Successfully uploaded", file_path)
        return json.loads(upload_response.text).get("fileName")
    else:
        print("An error occurred while uploading", file_path)
        return None

def create_repair_request(ontology_id1, ontology_id2, align_id, ref_id, service):
    repair_data = {
        "ontologyId1": ontology_id1,
        "ontologyId2": ontology_id2,
        "alignId": align_id,
        "service": service
    }

    if ref_id:
        repair_data["refId"] = ref_id

    repair_url = f"{url}/repair"
    repair_headers = {'Content-Type': 'application/json'}
    repair_response = requests.post(repair_url, headers=repair_headers, json=repair_data)

    if repair_response.status_code == 201:
        print("Successfully created repair")
        return json.loads(repair_response.text).get("requestId")
    else:
        print("An error occurred while creating repair")
        return None

def check_repair_status(repair_id):
    check_status_url = f"{url}/check-status/{repair_id}"
    check_status_headers = {'Content-Type': 'application/json'}

    start_time = time.time()
    end_time = start_time + 10 * 60  # 10 minutes in seconds

    while time.time() < end_time:
        check_status_response = requests.get(check_status_url, headers=check_status_headers)

        if check_status_response.status_code == 200:
            status_data = json.loads(check_status_response.text)
            print(json.dumps(status_data, indent=2, sort_keys=True))

            if status_data.get("status") == "DONE":
                print("Repair process done.")
                return True

        else:
            print("An error occurred while checking status:")
            print(json.dumps(json.loads(check_status_response.text), indent=2, sort_keys=True))

        time.sleep(5)

    print("Repair process not completed within the time limit.")
    return False

def download_file(repair_id):
    download_url = f"{url}/download"
    download_data = {
        "requestId": repair_id
    }
    download_headers = {'Content-Type': 'application/json'}
    download_response = requests.post(download_url, headers=download_headers, json=download_data)

    if download_response.status_code == 200:
        with open(f"./{repair_id}.zip", "wb") as f:
            f.write(download_response.content)
        print("Successfully downloaded", repair_id)
        return True
    else:
        print("An error occurred while downloading", repair_id)
        return False

def repair_with_multiple_refs(ontology1_path, ontology2_path, align_path, ref_path, service):
    # Upload ontology1, ontology2, and align files
    ontology_id1 = upload_file(ontology1_path)
    ontology_id2 = upload_file(ontology2_path)
    align_id = upload_file(align_path)

    if not (ontology_id1 and ontology_id2 and align_id):
        print("Failed to upload one or more files.")
        return

    if ref_path:
        ref_id = upload_file(ref_path)

    repair_id = create_repair_request(ontology_id1, ontology_id2, align_id, ref_id, service)
    time.sleep(0.5)
    if repair_id:
        print("Repair process started with ID:", repair_id)
        if check_repair_status(repair_id):
            download_file(repair_id)

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Invalid command format. Usage:")
        print("upload /filepath")
        print("download download_req_id")
        print("repair ontology_id1 ontology_id2 align_id ref_id service")
        sys.exit(1)

    command = sys.argv[1]

    if command == "upload":
        if len(sys.argv) != 3:
            print("Invalid command format. Usage: upload /filepath")
            sys.exit(1)

        file_path = sys.argv[2]
        uploaded_file_id = upload_file(file_path)

        if uploaded_file_id:
            print(f"File uploaded with ID: {uploaded_file_id}")

    elif command == "download":
        if len(sys.argv) != 3:
            print("Invalid command format. Usage: download download_req_id")
            sys.exit(1)

        repair_id = sys.argv[2]
        download_file(repair_id)

    elif command == "repair":
        if len(sys.argv) != 7:
            print("Invalid command format. Usage: repair ontology_id1 ontology_id2 align_id ref_id service")
            sys.exit(1)

        ontology_id1 = upload_file(sys.argv[2])
        ontology_id2 = upload_file(sys.argv[3])
        align_id = upload_file(sys.argv[4])
        ref_ids = [upload_file(sys.argv[i]) for i in range(5, len(sys.argv) - 1)]
        service = sys.argv[-1]

        if ontology_id1 and ontology_id2 and align_id:
            repair_id = create_repair_request(ontology_id1, ontology_id2, align_id, ref_ids, service)
            if repair_id:
                print("Repair process started with ID:", repair_id)
                if check_repair_status(repair_id):
                    download_file(repair_id)

    elif command == "repair2":
        if len(sys.argv) < 6 or len(sys.argv) > 10:
            print("Invalid command format. Usage: repair path/ontology1 path/ontology2 path/align_id path/ref_file1 path/ref_file2 ... path/ref_fileN service")
            sys.exit(1)

        ontology1_path = sys.argv[2]
        ontology2_path = sys.argv[3]
        align_path = sys.argv[4]
        if sys.argv[5:-1]:
            ref_path = sys.argv[5:-1]
        service = sys.argv[-1]

        repair_with_multiple_refs(ontology1_path, ontology2_path, align_path, ref_path[0], service)

    else:
        print("Invalid command.")

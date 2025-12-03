import requests

BASE_URL = 'http://localhost:8000/api/v1'

def reproduce():
    # 1. Register/Login
    session = requests.Session()
    username = "debug_user_1"
    password = "StrongPass123!"
    email = "debug1@example.com"
    
    # Try login first
    print("Attempting login...")
    resp = session.post(f"{BASE_URL}/auth/login/", json={'username': username, 'password': password})
    
    if resp.status_code != 200:
        print("Login failed, trying register...")
        resp = session.post(f"{BASE_URL}/auth/register/", json={'username': username, 'email': email, 'password': password})
        if resp.status_code == 201:
            print("Registration successful, logging in...")
            resp = session.post(f"{BASE_URL}/auth/login/", json={'username': username, 'password': password})
        else:
            print(f"Registration failed: {resp.text}")
            return

    if resp.status_code != 200:
        print(f"Login failed: {resp.text}")
        return

    tokens = resp.json()
    access_token = tokens['access']
    headers = {'Authorization': f'Bearer {access_token}'}
    print("Login successful.")

    # 2. Create Task
    print("Creating task...")
    task_data = {
        "title": "Debug Task",
        "description": "Testing backend",
        "due_date": None, # Simulating the fix
        "priority": "MEDIUM",
        "status": "PENDING",
        "starred": False
    }
    
    resp = session.post(f"{BASE_URL}/tasks/", json=task_data, headers=headers)
    print(f"Status Code: {resp.status_code}")
    if resp.status_code == 500:
        # Simple extraction of the exception value
        try:
            from html.parser import HTMLParser
            class ExceptionParser(HTMLParser):
                def __init__(self):
                    super().__init__()
                    self.in_exception = False
                    self.exception_text = ""
                def handle_starttag(self, tag, attrs):
                    if tag == 'h4' and ('class', 'exception_value') in attrs:
                        self.in_exception = True
                    elif tag == 'pre' and ('class', 'exception_value') in attrs:
                         self.in_exception = True
                def handle_endtag(self, tag):
                    if tag == 'h4' or tag == 'pre':
                        self.in_exception = False
                def handle_data(self, data):
                    if self.in_exception:
                        self.exception_text += data

            parser = ExceptionParser()
            parser.feed(resp.text)
            print(f"Exception: {parser.exception_text}")
            
            # Also print the first few lines of the response to see if we can catch the error type
            print("Response Head:")
            print('\n'.join(resp.text.split('\n')[:20]))
        except Exception as e:
            print(f"Failed to parse error: {e}")
    else:
        print(f"Response: {resp.text}")

if __name__ == "__main__":
    reproduce()

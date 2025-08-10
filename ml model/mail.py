from flask import Flask, request, jsonify, render_template
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.naive_bayes import MultinomialNB
from sklearn.pipeline import Pipeline
from sklearn.feature_extraction.text import CountVectorizer
import requests

app = Flask(__name__)

# Email detection
# Load and train model
df = pd.read_csv("https://raw.githubusercontent.com/Apaulgithub/oibsip_taskno4/main/spam.csv", encoding='ISO-8859-1')
df.rename(columns={"v1": "Category", "v2": "Message"}, inplace=True)
df.drop(columns=['Unnamed: 2', 'Unnamed: 3', 'Unnamed: 4'], inplace=True)
df['Spam'] = df['Category'].apply(lambda x: 1 if x == 'spam' else 0)

X_train, X_test, y_train, y_test = train_test_split(df.Message, df.Spam, test_size=0.25)

clf = Pipeline([
    ('vectorizer', CountVectorizer()),  
    ('nb', MultinomialNB())  
])
clf.fit(X_train, y_train)

def detect_spam(email_text):
    return "Spam Email!" if clf.predict([email_text])[0] else "Not Spam Email!"

# website detection
API_KEY = "402132554c33a11133e7ea1a8bbceb74a5eadb87087dc89eaab12b18f339027e"

# Function to scan a URL
def scan_url(url):
    vt_url = "https://www.virustotal.com/api/v3/urls"
    headers = {"x-apikey": API_KEY}
    data = {"url": url}

    response = requests.post(vt_url, headers=headers, data=data)

    if response.status_code == 200:
        scan_id = response.json()["data"]["id"]
        return scan_id
    else:
        return None

# Function to get scan results
def get_scan_report(scan_id):
    vt_url = f"https://www.virustotal.com/api/v3/analyses/{scan_id}"
    headers = {"x-apikey": API_KEY}

    response = requests.get(vt_url, headers=headers)

    if response.status_code == 200:
        result = response.json()
        stats = result["data"]["attributes"]["stats"]
        return stats
    else:
        return None


@app.route('/')
def index():
    return render_template('index.html')

@app.route('/detect', methods=['POST'])
def detect():
    data = request.json
    email_text = data.get('email_text', '')
    result = detect_spam(email_text)
    return jsonify({"result": result})

# Flask API Route
@app.route("/scan", methods=["POST"])
def scan():
    data = request.json
    url = data.get("url")

    if not url:
        return jsonify({"error": "No URL provided"}), 400

    scan_id = scan_url(url)
    if scan_id:
        report = get_scan_report(scan_id)
        return jsonify({"scan_id": scan_id, "report": report})
    else:
        return jsonify({"error": "Failed to scan URL"}), 500

if __name__ == '__main__':
    app.run(debug=True)

from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

def score_answer(user_answer, correct_answer):
    # Super simple similarity-based scoring (scale 0-10)
    vectorizer = TfidfVectorizer().fit([user_answer, correct_answer])
    vectors = vectorizer.transform([user_answer, correct_answer])
    sim = cosine_similarity(vectors[0], vectors[1])[0][0]
    score = sim * 10  # scale similarity to 0-10 points
    return round(score, 2)


from sentence_transformers import SentenceTransformer, util
from .models import HotelKnowledge


# Load the embedding model once.
model = SentenceTransformer(
    "sentence-transformers/all-MiniLM-L6-v2"
)


def retrieve_knowledge(question, top_k=3):
    documents = list(HotelKnowledge.objects.all())

    if not documents:
        return []

    contents = [doc.content for doc in documents]

    # Convert the guest question and hotel policies into vectors.
    document_vectors = model.encode(
        contents,
        convert_to_tensor=True
    )

    question_vector = model.encode(
        question,
        convert_to_tensor=True
    )

    # Compare meanings using cosine similarity.
    scores = util.cos_sim(
        question_vector,
        document_vectors
    )[0]

    # Return the most relevant policies first.
    ranked_indices = scores.argsort(
        descending=True
    )[:top_k]

    results = []

    for index in ranked_indices:
        score = float(scores[index])

        # Avoid returning clearly irrelevant information.
        if score < 0.30:
            continue

        doc = documents[int(index)]

        results.append({
            "title": doc.title,
            "category": doc.category,
            "content": doc.content,
            "score": round(score, 3)
        })

    return results

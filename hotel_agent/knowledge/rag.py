from .models import HotelKnowledge

_model = None

def _get_model():
    global _model
    if _model is None:
        try:
            from sentence_transformers import SentenceTransformer
            _model = SentenceTransformer("sentence-transformers/all-MiniLM-L6-v2")
        except Exception:
            _model = None
    return _model


def retrieve_knowledge(question, top_k=3):
    documents = list(HotelKnowledge.objects.all())

    if not documents:
        return []

    model = _get_model()
    if model is not None:
        try:
            from sentence_transformers import util
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
        except Exception:
            pass

    # Keyword fallback if embedding model is not yet loaded
    results = []
    q_words = [w.lower() for w in question.split() if len(w) > 3]
    for doc in documents:
        text = f"{doc.title} {doc.category} {doc.content}".lower()
        matches = sum(1 for w in q_words if w in text)
        if matches > 0:
            score = round(matches / (len(q_words) or 1), 3)
            results.append({
                "title": doc.title,
                "category": doc.category,
                "content": doc.content,
                "score": score
            })
    results.sort(key=lambda x: x["score"], reverse=True)
    return results[:top_k]

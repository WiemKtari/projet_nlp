# services/matcher_service.py

from sentence_transformers import SentenceTransformer, util
from utils.text_utils import extract_json_from_response, prepare_text

transformer = SentenceTransformer('bert-base-nli-mean-tokens')

def get_top_matching_candidates(job_info, candidate_infos, top_x):
    job_text = prepare_text(job_info)
    job_embedding = transformer.encode(job_text, convert_to_tensor=True)

    results = []

    for idx, cand_info in enumerate(candidate_infos):
        try:
            cand_text = prepare_text(cand_info)
            cand_embedding = transformer.encode(cand_text, convert_to_tensor=True)
            score = util.cos_sim(job_embedding, cand_embedding).item()
            results.append({
                "score": score,
                "name": cand_info.get("name"),
                "email": cand_info.get("email"),
                "phone": cand_info.get("phone")
            })
        except Exception as e:
            print(f"Error processing candidate {idx}: {e}")

    results.sort(key=lambda x: x["score"], reverse=True)
    return results[:top_x]

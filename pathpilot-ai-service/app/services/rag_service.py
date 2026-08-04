from app.services.ai_service import get_chat_model
from app.utils.vector_store import vector_store_manager
import logging

logger = logging.getLogger(__name__)

class RAGService:
    def __init__(self):
        self.llm = get_chat_model()

    def answer_query_from_documents(self, user_id: str, query: str) -> dict:
        """Retrieves semantic chunks and answers user questions strictly using document context."""
        # 1. Fetch relevant chunks from ChromaDB
        retrieved_docs = vector_store_manager.search(user_id=user_id, query=query, k=5)
        
        if not retrieved_docs:
            return {
                "answer": "No relevant documents found. Please upload learning context documents first.",
                "sources": []
            }

        # 2. Build Context String
        context_str = ""
        sources = []
        for doc in retrieved_docs:
            filename = doc.get("filename", "unknown")
            context_str += f"--- START SOURCE: {filename} ---\n{doc.get('content')}\n--- END SOURCE ---\n\n"
            if filename not in sources:
                sources.append(filename)

        # 3. Prompt LLM to answer strictly from context
        system_prompt = (
            "You are a strict RAG answering engine. You must answer the user's question using ONLY the provided text segments. "
            "If the answer is not mentioned or cannot be inferred from the segments, state: "
            "'I cannot find the answer in the uploaded files.' "
            "Do NOT use external information or generic training data to construct answers. Support code snippet blocks where appropriate."
        )

        user_prompt = (
            f"Retrieved Document Context:\n{context_str}\n"
            f"User Question: {query}\n"
        )

        try:
            messages = [
                ("system", system_prompt),
                ("human", user_prompt)
            ]
            response = self.llm.invoke(messages)
            answer_text = response.content
        except Exception as e:
            logger.error("Failed to call LLM for RAG QA", exc_info=True)
            answer_text = "An error occurred while scanning document structures for answers."

        return {
            "answer": answer_text,
            "sources": sources
        }

rag_service = RAGService()

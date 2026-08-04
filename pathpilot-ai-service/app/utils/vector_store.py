import chromadb
from chromadb.config import Settings as ChromaSettings
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_google_genai import GoogleGenerativeAIEmbeddings
from app.config import settings
import uuid

# Initialize Gemini Embeddings client
def get_embeddings_client():
    return GoogleGenerativeAIEmbeddings(
        model="models/text-embedding-004", 
        google_api_key=settings.GEMINI_API_KEY
    )

class VectorStoreManager:
    def __init__(self):
        # Create persistent Chroma DB client
        self.chroma_client = chromadb.PersistentClient(
            path=settings.CHROMA_DB_PATH,
            settings=ChromaSettings(anonymized_telemetry=False)
        )
        self.collection_name = "pathpilot_rag_collection"
        self.collection = self.chroma_client.get_or_create_collection(
            name=self.collection_name,
            metadata={"hnsw:space": "cosine"} # cosine similarity for embeddings matching
        )
        self.text_splitter = RecursiveCharacterTextSplitter(
            chunk_size=800,
            chunk_overlap=150
        )

    def add_document(self, user_id: str, document_id: str, text: str, filename: str):
        """Splits text, generates embeddings, and adds them to ChromaDB with metadata filters."""
        chunks = self.text_splitter.split_text(text)
        if not chunks:
            return

        embeddings_client = get_embeddings_client()
        # Generate embeddings for all chunks in batch
        embeddings = embeddings_client.embed_documents(chunks)

        ids = [f"{document_id}_{i}" for i in range(len(chunks))]
        metadatas = [
            {
                "user_id": user_id,
                "document_id": document_id,
                "filename": filename,
                "chunk_index": i
            }
            for i in range(len(chunks))
        ]

        self.collection.add(
            ids=ids,
            embeddings=embeddings,
            metadatas=metadatas,
            documents=chunks
        )

    def search(self, user_id: str, query: str, k: int = 4):
        """Perform semantic vector search restricted by user_id metadata filtering."""
        embeddings_client = get_embeddings_client()
        query_embedding = embeddings_client.embed_query(query)

        results = self.collection.query(
            query_embeddings=[query_embedding],
            n_results=k,
            where={"user_id": user_id}
        )

        documents = []
        if results and results.get("documents"):
            # Chroma query returns list of lists
            docs = results["documents"][0]
            metas = results["metadatas"][0]
            for doc, meta in zip(docs, metas):
                documents.append({
                    "content": doc,
                    "filename": meta.get("filename"),
                    "document_id": meta.get("document_id")
                })
        return documents

    def delete_document(self, document_id: str):
        """Deletes all vectorized chunks associated with a specific document."""
        # Delete using a where query on document_id metadata
        self.collection.delete(
            where={"document_id": document_id}
        )

vector_store_manager = VectorStoreManager()

"""
SmartShop AI - RAG Data Pipeline
Prepares product data for retrieval-augmented generation.
This module indexes product catalog for efficient similarity search.

Dependencies:
  pip install langchain chromadb sentence-transformers

Usage:
  python rag_pipeline.py  # to build/rebuild the index
"""

import json
import os

# ── Sample product documents for RAG ──────────────────────────
PRODUCT_DOCUMENTS = [
    {
        "id": 1,
        "text": "Samsung Galaxy S24 Ultra - Flagship smartphone with 200MP camera, S-Pen stylus, Snapdragon 8 Gen 3, 12GB RAM, 256GB storage, 5000mAh battery, Android 14. Price: ₹124,999. Rating: 4.6/5. Brand: Samsung. Marketplace: Amazon. Sustainability score: 72/100.",
        "metadata": {"category": "Smartphones", "price": 124999, "brand": "Samsung", "rating": 4.6}
    },
    {
        "id": 6,
        "text": "MacBook Air M3 - Apple M3 chip laptop with 13.6-inch Liquid Retina display, 16GB RAM, 512GB SSD, 18-hour battery, 1.24kg, macOS Sonoma. Price: ₹114,900. Rating: 4.8/5. Brand: Apple. Sustainability score: 80/100. Best for: students, professionals, design.",
        "metadata": {"category": "Laptops", "price": 114900, "brand": "Apple", "rating": 4.8}
    },
    {
        "id": 9,
        "text": "Lenovo IdeaPad Slim 5 - Thin and light student laptop with AMD Ryzen 5 7530U, 16GB RAM, 512GB SSD, 14-inch FHD display, 12-hour battery, 1.46kg, Windows 11. Price: ₹54,990. Rating: 4.2/5. Brand: Lenovo. Good for: programming, everyday use, budget shoppers.",
        "metadata": {"category": "Laptops", "price": 54990, "brand": "Lenovo", "rating": 4.2}
    },
    {
        "id": 11,
        "text": "Sony WH-1000XM5 - Over-ear wireless headphones with industry-leading ANC, 30-hour battery, LDAC codec, 8 microphones, Bluetooth 5.2. Price: ₹26,990. Rating: 4.7/5. Brand: Sony. Best for: work from home, travel, noise cancellation. Sustainability: 78/100.",
        "metadata": {"category": "Headphones", "price": 26990, "brand": "Sony", "rating": 4.7}
    },
    {
        "id": 3,
        "text": "Redmi Note 13 Pro+ - Mid-range smartphone with 200MP camera, Dimensity 7200 Ultra, 8GB RAM, 120W fast charging, AMOLED display. Price: ₹29,999. Rating: 4.3/5. Brand: Xiaomi. Best budget camera phone in India.",
        "metadata": {"category": "Smartphones", "price": 29999, "brand": "Xiaomi", "rating": 4.3}
    },
]

def build_rag_index():
    """Build a RAG vector index from product documents."""
    try:
        from langchain.vectorstores import Chroma
        from langchain.embeddings import HuggingFaceEmbeddings
        from langchain.schema import Document

        print("Building RAG index with LangChain + Chroma...")

        embeddings = HuggingFaceEmbeddings(model_name="all-MiniLM-L6-v2")

        docs = [
            Document(
                page_content=d["text"],
                metadata={**d["metadata"], "id": d["id"]}
            )
            for d in PRODUCT_DOCUMENTS
        ]

        vectorstore = Chroma.from_documents(
            documents=docs,
            embedding=embeddings,
            persist_directory="./chroma_db"
        )

        vectorstore.persist()
        print(f"✅ RAG index built with {len(docs)} product documents")
        return vectorstore

    except ImportError:
        print("⚠️  LangChain/Chroma not installed. Running in demo mode without vector search.")
        print("    To enable: pip install langchain chromadb sentence-transformers")
        return None


def search_products(query: str, top_k: int = 5):
    """Search products using RAG retrieval."""
    try:
        from langchain.vectorstores import Chroma
        from langchain.embeddings import HuggingFaceEmbeddings

        embeddings = HuggingFaceEmbeddings(model_name="all-MiniLM-L6-v2")
        vectorstore = Chroma(
            persist_directory="./chroma_db",
            embedding_function=embeddings
        )

        results = vectorstore.similarity_search(query, k=top_k)
        return [{"text": r.page_content, "metadata": r.metadata} for r in results]

    except Exception as e:
        print(f"RAG search fallback: {e}")
        # Return demo results
        return [{"text": d["text"], "metadata": d["metadata"]} for d in PRODUCT_DOCUMENTS[:top_k]]


if __name__ == "__main__":
    build_rag_index()

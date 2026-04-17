const API_BASE = "http://localhost:8000/api/v1";

function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("sf_token");
}

async function request<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE}${path}`;
  const token = getToken();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(url, { ...options, headers });
  if (!res.ok) {
    let message = `请求失败: ${res.status}`;
    try {
      const data = await res.json();
      message = data.message || data.detail || message;
    } catch {
      // ignore
    }
    throw new Error(message);
  }

  if (res.status === 204) {
    return undefined as T;
  }
  return res.json() as Promise<T>;
}

export interface KnowledgeBase {
  id: string;
  user_id: string;
  name: string;
  description: string | null;
  document_count: number;
  created_at: string;
  updated_at: string;
}

export interface Document {
  id: string;
  knowledge_base_id: string;
  title: string;
  content: string;
  source_type: string;
  file_name: string | null;
  created_at: string;
  updated_at: string;
}

export interface ContentCreation {
  id: string;
  user_id: string;
  knowledge_base_id: string | null;
  title: string;
  content: string;
  prompt: string | null;
  status: string;
  created_at: string;
  updated_at: string;
}

export const api = {
  // 知识库
  listKnowledgeBases: () => request<KnowledgeBase[]>("/knowledge"),
  createKnowledgeBase: (data: { name: string; description?: string }) =>
    request<KnowledgeBase>("/knowledge", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  deleteKnowledgeBase: (id: string) =>
    request<void>(`/knowledge/${id}`, { method: "DELETE" }),

  // 文档
  listDocuments: (kbId: string) =>
    request<Document[]>(`/knowledge/${kbId}/documents`),
  createDocument: (
    kbId: string,
    data: { title: string; content: string; source_type?: string; file_name?: string }
  ) =>
    request<Document>(`/knowledge/${kbId}/documents`, {
      method: "POST",
      body: JSON.stringify(data),
    }),
  deleteDocument: (kbId: string, docId: string) =>
    request<void>(`/knowledge/${kbId}/documents/${docId}`, { method: "DELETE" }),

  // 内容创作
  listCreations: () => request<ContentCreation[]>("/content"),
  getCreation: (id: string) => request<ContentCreation>(`/content/${id}`),
  generateContent: (data: {
    title: string;
    knowledge_base_id?: string;
    prompt?: string;
  }) =>
    request<ContentCreation>("/content/generate", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  createContent: (data: {
    title: string;
    content: string;
    knowledge_base_id?: string;
    prompt?: string;
  }) =>
    request<ContentCreation>("/content", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  updateContent: (
    id: string,
    data: { title?: string; content?: string; status?: string }
  ) =>
    request<ContentCreation>(`/content/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    }),
  deleteCreation: (id: string) =>
    request<void>(`/content/${id}`, { method: "DELETE" }),
};

export type ProviderId =
  | "mock"
  | "cerebras"
  | "openai_compatible"
  | "vllm";

export type SuiteId = "general_qa" | "coding" | "reasoning";
export type PolicyId = "interactive_chat" | "batch_inference";

export interface CatalogOption<T extends string = string> {
  id: T;
  label: string;
  description: string;
}

export interface ProviderOption extends CatalogOption<ProviderId> {
  recommended?: boolean;
  tooltip?: string;
}

export interface ModelOption {
  id: string;
  label: string;
}

export const PROVIDERS: ProviderOption[] = [
  {
    id: "mock",
    label: "Mock Provider",
    description: "Simulated evaluation using bundled sample fixtures.",
    recommended: true,
    tooltip:
      "Mock Provider runs the real readiness engine against bundled quality and performance sample data. No live model API calls are made — recommended for demos.",
  },
  {
    id: "cerebras",
    label: "Cerebras",
    description: "Cerebras Inference API (live integration planned).",
  },
  {
    id: "openai_compatible",
    label: "OpenAI Compatible",
    description: "OpenAI-compatible chat completions endpoint (planned).",
  },
  {
    id: "vllm",
    label: "vLLM",
    description: "Self-hosted vLLM OpenAI-compatible server (planned).",
  },
];

export const MODELS_BY_PROVIDER: Record<ProviderId, ModelOption[]> = {
  mock: [{ id: "demo-model", label: "Demo Model" }],
  cerebras: [
    { id: "llama3.1-8b", label: "llama3.1-8b" },
    { id: "qwen3-32b", label: "qwen3-32b" },
  ],
  openai_compatible: [
    { id: "gpt-4.1", label: "gpt-4.1" },
    { id: "gpt-4o-mini", label: "gpt-4o-mini" },
  ],
  vllm: [{ id: "custom-endpoint", label: "Custom Endpoint" }],
};

export const SUITES: CatalogOption<SuiteId>[] = [
  {
    id: "general_qa",
    label: "General QA",
    description: "Accuracy and faithfulness on general question-answering prompts.",
  },
  {
    id: "coding",
    label: "Coding",
    description: "Code generation and correctness-oriented evaluation prompts.",
  },
  {
    id: "reasoning",
    label: "Reasoning",
    description: "Multi-step reasoning and explanation quality checks.",
  },
];

export const POLICIES: (CatalogOption<PolicyId> & {
  ttft: string;
  latency: string;
  throughput: string;
  tokens: string;
})[] = [
  {
    id: "interactive_chat",
    label: "Interactive Chat",
    description: "Low-latency conversational SLA for user-facing chat.",
    ttft: "TTFT ≤ 500ms",
    latency: "p95 latency ≤ 2000ms",
    throughput: "≥ 50 tokens/sec",
    tokens: "Fast first token + steady streaming for chat UX",
  },
  {
    id: "batch_inference",
    label: "Batch Inference",
    description: "Throughput-oriented SLA for offline or queued workloads.",
    ttft: "TTFT ≤ 2000ms",
    latency: "p95 latency ≤ 8000ms",
    throughput: "≥ 20 tokens/sec",
    tokens: "Higher latency tolerance; prioritize completed batch volume",
  },
];

export interface WizardState {
  provider: ProviderId;
  modelId: string;
  suiteId: SuiteId;
  policyId: PolicyId;
}

export const DEFAULT_WIZARD: WizardState = {
  provider: "mock",
  modelId: "demo-model",
  suiteId: "general_qa",
  policyId: "interactive_chat",
};

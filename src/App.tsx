import { useMemo, useState } from "react";
import "./styles.css";
import { BRAND } from "./brand";

// 36 questions: 12 beginner + 12 intermediate + 12 expert. 4 choices each.
// 14 fun facts + 14 product line + 8 industry-technical.
// Per-tier mix: Beginner 5/5/2, Intermediate 5/5/2, Expert 4/4/4.
// Length parity: max/min char count of choices per difficulty band stays within 0.90-1.10.
// Distractors lean on real serverless GPU / AI infra competitors: Modal, Replicate, RunPod,
// Baseten, Banana, Beam, Lambda Labs, Together AI, Fireworks, Anyscale. Real infra terms
// used as wrong-answer noise: Kubernetes, EKS, GKE, vLLM, SGLang, TensorRT-LLM, Triton, MIG.

type Question = {
  id: string;
  level: "beginner" | "intermediate" | "expert";
  topic: string;
  q: string;
  options: string[];
  answer: number;
  explain: string;
};

const BANK: Question[] = [
  // ───────── BEGINNER (12) · 5 fun-facts, 5 products, 2 industry ─────────
  {
    id: "b1",
    level: "beginner",
    topic: "company-fun-facts",
    q: "Who is the co-founder and CEO of Cerebrium?",
    options: [
      "Michael Louis, who was previously CTO of OneCart",
      "Mert Mumtaz, who founded the Helius developer team",
      "Erik Bernhardsson, who founded the Modal Labs team",
      "Tuhin Srivastava, who founded the Baseten Labs team",
    ],
    answer: 0,
    explain:
      "Per the Cerebrium seed announcement and Y Combinator profile, Michael Louis is the co-founder and CEO. He was previously CTO of OneCart, which sold to Walmart/Massmart.",
  },
  {
    id: "b2",
    level: "beginner",
    topic: "company-fun-facts",
    q: "Who is the other co-founder of Cerebrium, serving as CTO?",
    options: [
      "Jonathan Irwin, an 8+ year JavaScript developer in lead roles",
      "Jared Quincy Davis, a former DeepMind researcher building Foundry",
      "Aman Kishore, a former Mosaic ML engineer working on inference",
      "Tarun Aggarwal, a former Stripe engineer working on payouts",
    ],
    answer: 0,
    explain:
      "Per the Y Combinator profile, Jonathan Irwin is co-founder and CTO of Cerebrium, with 8+ years as a JavaScript developer including lead developer roles.",
  },
  {
    id: "b3",
    level: "beginner",
    topic: "company-fun-facts",
    q: "In which country was Cerebrium originally founded?",
    options: [
      "South Africa, with the founding team originally based out of Cape Town",
      "United Kingdom, with the founding team originally based out of London town",
      "Singapore, with the founding team based out of the central business cluster",
      "Australia, with the founding team originally based out of coastal Sydney area",
    ],
    answer: 0,
    explain:
      "Per the Cerebrium About page, the company was founded in Cape Town, South Africa and is now headquartered in New York City.",
  },
  {
    id: "b4",
    level: "beginner",
    topic: "company-fun-facts",
    q: "In which year was Cerebrium founded as a company?",
    options: [
      "2021, with the founders going through the YC W22 batch",
      "2018, before the modern wave of serverless GPU platforms",
      "2024, well after the ChatGPT launch and the AI infra rush",
      "2019, alongside the first wave of Kubernetes ML platforms",
    ],
    answer: 0,
    explain:
      "Cerebrium's LinkedIn lists 2021 as its founding year. The company went through Y Combinator's Winter 2022 (W22) batch.",
  },
  {
    id: "b5",
    level: "beginner",
    topic: "company-fun-facts",
    q: "Which accelerator did Cerebrium join in its early days?",
    options: [
      "Y Combinator, in its Winter 2022 (W22) batch program cohort year",
      "Techstars, in its New York City accelerator program cohort year",
      "500 Global, in its Mountain View accelerator program cohort year",
      "Sequoia Arc, in its central London accelerator program cohort year",
    ],
    answer: 0,
    explain:
      "Cerebrium was part of the Y Combinator W22 (Winter 2022) batch, as listed in the YC company directory and the W22 batch announcement.",
  },
  {
    id: "b6",
    level: "beginner",
    topic: "company-products",
    q: "What does Cerebrium primarily provide to its developer customers?",
    options: [
      "Serverless GPU infrastructure for real-time AI workloads",
      "A managed Kubernetes cluster service for stateful workloads",
      "A bare-metal GPU rental marketplace for crypto mining work",
      "A general-purpose CPU virtual machine hosting service offering",
    ],
    answer: 0,
    explain:
      "Per the Cerebrium homepage and Y Combinator profile, Cerebrium is a serverless GPU infrastructure platform for real-time AI workloads like voice agents, LLMs, and video models.",
  },
  {
    id: "b7",
    level: "beginner",
    topic: "company-products",
    q: "What is the pip install command to add Cerebrium's CLI library?",
    options: [
      "pip install cerebrium for the official Python client library",
      "pip install modal-client for the official Python client library",
      "pip install replicate-py for the official Python client library",
      "pip install banana-dev for the official Python client library",
    ],
    answer: 0,
    explain:
      "Per the Cerebrium Y Combinator profile, the install command is 'pip install cerebrium' which provides the Python CLI for deploying workloads.",
  },
  {
    id: "b8",
    level: "beginner",
    topic: "company-products",
    q: "How does Cerebrium bill customers for compute usage?",
    options: [
      "Pay-per-second compute billing based on actual usage",
      "Monthly flat-rate reserved instance billing per GPU type",
      "Annual prepaid capacity commitments with discounted rates",
      "Pay-per-request billing based on inference request count",
    ],
    answer: 0,
    explain:
      "Per the Cerebrium pricing page, the platform charges based on actual compute time measured in seconds, with no reservations required.",
  },
  {
    id: "b9",
    level: "beginner",
    topic: "company-products",
    q: "What is the name of Cerebrium's free starter pricing plan?",
    options: [
      "Hobby, which is free plus compute usage charges monthly",
      "Starter, which is free plus compute usage charges monthly",
      "Builder, which is free plus compute usage charges monthly",
      "Indie, which is free plus compute usage charges monthly",
    ],
    answer: 0,
    explain:
      "Per the Cerebrium pricing page, the Hobby plan is free plus compute usage and includes 3 seats, up to 3 deployed apps, and 5 concurrent GPUs.",
  },
  {
    id: "b10",
    level: "beginner",
    topic: "company-products",
    q: "Which kind of AI applications does Cerebrium most prominently market?",
    options: [
      "Voice agents, video model inference, and LLM serving workloads",
      "On-chain DeFi smart contracts running on blockchain L1 networks",
      "Mobile push notification delivery services across iOS and Android",
      "Static website hosting and edge CDN content delivery services",
    ],
    answer: 0,
    explain:
      "Per the Cerebrium homepage hero, the platform pitches itself for voice agents, video models, LLMs, and any AI workload with sub-second cold starts.",
  },
  {
    id: "b11",
    level: "beginner",
    topic: "industry",
    q: "What does the term 'cold start' mean for serverless GPU workloads?",
    options: [
      "The time to spin up a container and load model weights",
      "The time it takes a model to converge during training runs",
      "The time it takes a CPU to throttle down to its idle state",
      "The time it takes a DNS lookup to resolve a service hostname",
    ],
    answer: 0,
    explain:
      "Cold start refers to the time from a request arriving to the container being ready to serve, including image pull, container boot, and model weight loading.",
  },
  {
    id: "b12",
    level: "beginner",
    topic: "industry",
    q: "Which NVIDIA GPU is most associated with the Hopper architecture?",
    options: [
      "H100, the Hopper flagship with 80GB of HBM3 memory",
      "A100, the Ampere flagship with 80GB of HBM2e memory",
      "L40s, the Ada Lovelace data center GPU for inference",
      "T4, the Turing inference card with 16GB of GDDR6 memory",
    ],
    answer: 0,
    explain:
      "The H100 is NVIDIA's Hopper-architecture data center GPU, released in 2022 with 80GB of HBM3 memory and up to 3.35 TB/s bandwidth.",
  },

  // ───────── INTERMEDIATE (12) · 5 fun-facts, 5 products, 2 industry ─────────
  {
    id: "i1",
    level: "intermediate",
    topic: "company-fun-facts",
    q: "Which AI fund led Cerebrium's $8.5M seed round in July 2025?",
    options: [
      "Gradient, the Google-backed AI-focused venture capital investment fund",
      "Sequoia Capital, the long-running Silicon Valley venture capital fund",
      "Andreessen Horowitz, the prominent crypto-friendly venture capital fund",
      "Founders Fund, the Peter Thiel-backed venture capital investment fund",
    ],
    answer: 0,
    explain:
      "Per the Cerebrium press release and Y Combinator post, the $8.5M seed round was led by Gradient, Google's AI-focused venture fund.",
  },
  {
    id: "i2",
    level: "intermediate",
    topic: "company-fun-facts",
    q: "What South African startup did Cerebrium's CEO previously help build?",
    options: [
      "OneCart, an Instacart-style grocery delivery service company today",
      "Yoco, a SoftBank-backed African card payment processing company today",
      "Jumo, a financial services platform across emerging markets today",
      "Naked Insurance, a Cape Town-based digital insurance company today",
    ],
    answer: 0,
    explain:
      "Per the Y Combinator profile, Michael Louis was previously CTO of OneCart, a South African grocery delivery service that was acquired by Walmart/Massmart.",
  },
  {
    id: "i3",
    level: "intermediate",
    topic: "company-fun-facts",
    q: "Roughly what share of Cerebrium's distributed team is South African?",
    options: [
      "About 95 percent of the team based in South Africa today",
      "About 50 percent of the team based in South Africa today",
      "About 25 percent of the team based in South Africa today",
      "About 10 percent of the team based in South Africa today",
    ],
    answer: 0,
    explain:
      "Per the Frontlines.io interview with Michael Louis, Cerebrium's distributed team is approximately 95 percent South African while the company is headquartered in New York City.",
  },
  {
    id: "i4",
    level: "intermediate",
    topic: "company-fun-facts",
    q: "Which city is now Cerebrium's official corporate headquarters?",
    options: [
      "New York City, after relocating from its Cape Town origin",
      "San Francisco, after relocating from its early Cape Town origin",
      "Austin Texas, after relocating from its early Cape Town origin",
      "London UK, after relocating from its early Cape Town origin",
    ],
    answer: 0,
    explain:
      "Per the Cerebrium About page, the company is now headquartered in New York City, having been founded in Cape Town, South Africa.",
  },
  {
    id: "i5",
    level: "intermediate",
    topic: "company-fun-facts",
    q: "Which Daily.co-led voice AI startup is a public Cerebrium customer?",
    options: [
      "Tavus, the human-like AI video and voice avatar company today",
      "ElevenLabs, the AI voice synthesis and dubbing platform company",
      "Hume AI, the empathic voice model and API platform company",
      "Suno, the AI music generation song platform company today",
    ],
    answer: 0,
    explain:
      "Per the Cerebrium homepage logo wall and a dedicated case study, Tavus is a named customer that scaled its human-like AI experiences on Cerebrium.",
  },
  {
    id: "i6",
    level: "intermediate",
    topic: "company-products",
    q: "What sandbox technology does Cerebrium use to isolate workloads?",
    options: [
      "gVisor, the Google user-space kernel container sandboxing technology",
      "Firecracker, the AWS microVM-based container sandboxing technology",
      "Kata Containers, the OpenStack-backed hardware-isolated container runtime",
      "Nabla Containers, the IBM library-OS unikernel-style container runtime",
    ],
    answer: 0,
    explain:
      "Per the Cerebrium homepage security section, each workload runs on top of gVisor in a hardened isolated environment for strong container isolation.",
  },
  {
    id: "i7",
    level: "intermediate",
    topic: "company-products",
    q: "What uptime SLA does Cerebrium advertise for its production platform?",
    options: [
      "99.999 percent uptime via multi-region cross-cloud failover routing",
      "99.99 percent uptime via single-region active-passive failover routing",
      "99.9 percent uptime via single-zone availability monitoring service tier",
      "99.5 percent uptime via best-effort single-zone deployment routing tier",
    ],
    answer: 0,
    explain:
      "Per the Cerebrium homepage security section, the platform advertises 99.999% uptime with multi-region failover that routes traffic if a region or cloud goes down.",
  },
  {
    id: "i8",
    level: "intermediate",
    topic: "company-products",
    q: "Which compliance frameworks does Cerebrium publicly claim to meet?",
    options: [
      "SOC 2, HIPAA, GDPR, and ISO 27001 international certification standards",
      "PCI DSS, FedRAMP, FIPS 140-2, and ITAR US federal security standards",
      "NIST 800-53, CMMC, DFARS, and CJIS US federal export compliance standards",
      "CCPA, COPPA, GLBA, and SOX US financial reporting compliance standards",
    ],
    answer: 0,
    explain:
      "Per the Cerebrium homepage security section, the platform claims SOC 2, HIPAA, GDPR, and ISO compliance giving customers a compliant foundation for sensitive workloads.",
  },
  {
    id: "i9",
    level: "intermediate",
    topic: "company-products",
    q: "How many GPU types does Cerebrium publicly advertise in its lineup?",
    options: [
      "12 plus GPU types spanning Blackwell, Hopper, and Ampere",
      "About 4 GPU types focused on Hopper architecture cards only",
      "Just 2 GPU types focused on the H100 and the A100 cards only",
      "Around 8 GPU types limited to the Ampere generation cards only",
    ],
    answer: 0,
    explain:
      "Per the Cerebrium homepage feature list and GPU docs, the platform offers 12+ GPU types including B300, B200, H200, H100, A100, L40s, L4, A10, T4, and AWS Trainium TRN1.",
  },
  {
    id: "i10",
    level: "intermediate",
    topic: "company-products",
    q: "Which observability standard does Cerebrium natively integrate with?",
    options: [
      "OpenTelemetry, the open CNCF traces metrics and logs standard format",
      "Datadog APM, the proprietary trace and metric ingestion wire format",
      "New Relic Insights, the proprietary trace and metric ingestion format",
      "Splunk SignalFx, the proprietary trace and metric ingestion format",
    ],
    answer: 0,
    explain:
      "Per the Cerebrium homepage observability section, the platform has native OpenTelemetry support to plug into existing monitoring stacks.",
  },
  {
    id: "i11",
    level: "intermediate",
    topic: "industry",
    q: "Which open-source library is best known for PagedAttention LLM serving?",
    options: [
      "vLLM, the UC Berkeley high-throughput LLM inference library",
      "TensorRT-LLM, the NVIDIA Hopper-optimized inference library kit",
      "DeepSpeed-Inference, the Microsoft research inference library kit",
      "Triton Inference, the NVIDIA model serving inference library kit",
    ],
    answer: 0,
    explain:
      "vLLM is the UC Berkeley project that introduced PagedAttention, a memory management technique that dramatically improves LLM serving throughput.",
  },
  {
    id: "i12",
    level: "intermediate",
    topic: "industry",
    q: "Which NVIDIA technology partitions a single GPU into smaller slices?",
    options: [
      "MIG, the Multi-Instance GPU partitioning feature for A100",
      "NVLink, the high-bandwidth GPU-to-GPU interconnect technology",
      "NVSwitch, the multi-GPU fabric switch technology for servers",
      "GPUDirect, the storage and network direct GPU access technology",
    ],
    answer: 0,
    explain:
      "MIG (Multi-Instance GPU) is NVIDIA's feature on A100, H100, and H200 that partitions a single GPU into up to 7 isolated instances with dedicated compute and memory.",
  },

  // ───────── EXPERT (12) · 4 fun-facts, 4 products, 4 industry ─────────
  {
    id: "e1",
    level: "expert",
    topic: "company-fun-facts",
    q: "Which four investors does Cerebrium publicly list on its About page?",
    options: [
      "Gradient, Y Combinator, Authentic Ventures, and Maxitech as the four",
      "Gradient, Lightspeed Partners, Index Ventures, and Spark Capital",
      "Y Combinator, Khosla Ventures, Greylock Partners, and Accel Partners",
      "Sequoia Capital, Founders Fund, Coatue Management, and General Catalyst",
    ],
    answer: 0,
    explain:
      "Per the Cerebrium About page's 'Backed by world-class investors' section, the four named investors are Gradient, Y Combinator, Authentic Ventures, and Maxitech.",
  },
  {
    id: "e2",
    level: "expert",
    topic: "company-fun-facts",
    q: "What 35 percent metric did Frontlines.io highlight about Cerebrium GTM?",
    options: [
      "LinkedIn outbound reply rate, well above the 2 to 4 percent industry norm",
      "Sales-led pipeline conversion rate, above the 5 to 8 percent industry norm",
      "Enterprise renewal upsell rate, above the 10 to 15 percent industry norm",
      "Partnership-sourced ARR share, above the 20 to 25 percent industry norm",
    ],
    answer: 0,
    explain:
      "Per the Frontlines.io interview with Michael Louis, Cerebrium's LinkedIn outbound achieves around a 35% reply rate compared to the industry's typical 2-4% range.",
  },
  {
    id: "e3",
    level: "expert",
    topic: "company-fun-facts",
    q: "Which large retailer ultimately acquired Cerebrium CEO's prior startup OneCart?",
    options: [
      "Walmart, via the Massmart retail subsidiary in the Southern Africa region",
      "Amazon, via the Whole Foods grocery subsidiary in the Southern Africa region",
      "Carrefour, via the regional retail subsidiary in the Southern Africa region",
      "Shoprite, via the Checkers Sixty60 subsidiary in the Southern Africa region",
    ],
    answer: 0,
    explain:
      "Per the Y Combinator profile and AI Minds podcast, OneCart sold to Walmart/Massmart for an undisclosed sum. Massmart is Walmart's South African retail subsidiary.",
  },
  {
    id: "e4",
    level: "expert",
    topic: "company-fun-facts",
    q: "Around what daily revenue did OneCart reportedly hit during COVID-19?",
    options: [
      "About 200,000 USD per day at the COVID-19 peak demand period",
      "About 50,000 USD per day at the COVID-19 peak demand period",
      "About 1,000,000 USD per day at the COVID-19 peak demand period",
      "About 20,000 USD per day at the COVID-19 peak demand period",
    ],
    answer: 0,
    explain:
      "Per the AI Minds #053 podcast with Michael Louis, OneCart scaled to roughly $200K per day in revenue during COVID-19 before being acquired by Walmart/Massmart.",
  },
  {
    id: "e5",
    level: "expert",
    topic: "company-products",
    q: "Which four AWS regions does Cerebrium publicly list on its homepage?",
    options: [
      "us-east-1, eu-west-2, eu-north-1, and ap-south-1 regions today",
      "us-west-2, eu-central-1, ap-northeast-1, and sa-east-1 regions today",
      "us-east-1, us-west-1, eu-west-1, and ap-southeast-1 regions today",
      "us-east-2, ca-central-1, eu-south-1, and me-south-1 regions today",
    ],
    answer: 0,
    explain:
      "Per the Cerebrium homepage capacity section, the four publicly listed regions are us-east-1, eu-west-2, eu-north-1, and ap-south-1.",
  },
  {
    id: "e6",
    level: "expert",
    topic: "company-products",
    q: "What is Cerebrium's per-second list price for an NVIDIA H100 GPU?",
    options: [
      "0.000944 USD per second for the H100 on the published rates",
      "0.000583 USD per second for the H100 on the published rates",
      "0.001670 USD per second for the H100 on the published rates",
      "0.000222 USD per second for the H100 on the published rates",
    ],
    answer: 0,
    explain:
      "Per the Cerebrium pricing page, the H100 lists at $0.000944 per second, alongside B200 at $0.00167/s, A100 80GB at $0.000583/s, and T4 at $0.000164/s.",
  },
  {
    id: "e7",
    level: "expert",
    topic: "company-products",
    q: "What dollar amount of free serverless GPU credits do new Cerebrium accounts get?",
    options: [
      "10 USD in free serverless GPU credits on first signup today",
      "100 USD in free serverless GPU credits on first signup today",
      "50 USD in free serverless GPU credits on first signup today",
      "5 USD in free serverless GPU credits on first signup today",
    ],
    answer: 0,
    explain:
      "Per the Cerebrium Y Combinator profile under 'How it works,' new accounts get $10 in free serverless GPU credits to try the platform.",
  },
  {
    id: "e8",
    level: "expert",
    topic: "company-products",
    q: "Which cold start time does Cerebrium claim with its snapshotting on vLLM Qwen?",
    options: [
      "Around 3.38 seconds with the snapshotting feature enabled",
      "Around 8.23 seconds with the snapshotting feature enabled",
      "Around 42.0 seconds with the snapshotting feature enabled",
      "Around 91.0 seconds with the snapshotting feature enabled",
    ],
    answer: 0,
    explain:
      "Per the Cerebrium homepage benchmark, vLLM Qwen cold starts at ~3.38s with snapshots vs 8.23s without on Cerebrium, 61s on Provider A, and 91s on EKS/GKE.",
  },
  {
    id: "e9",
    level: "expert",
    topic: "industry",
    q: "Which architecture name does NVIDIA use for the B100 and B200 GPUs?",
    options: [
      "Blackwell, the 2024 generation NVIDIA data center GPU lineup",
      "Hopper, the 2022 generation NVIDIA data center GPU lineup",
      "Ampere, the 2020 generation NVIDIA data center GPU lineup",
      "Lovelace, the consumer-tier NVIDIA RTX 40-series GPU lineup",
    ],
    answer: 0,
    explain:
      "Blackwell is NVIDIA's 2024+ data center GPU architecture, introduced for the B100, B200, and B300. Hopper covers H100/H200; Ampere covers A100.",
  },
  {
    id: "e10",
    level: "expert",
    topic: "industry",
    q: "Which technique does PagedAttention borrow from operating systems design?",
    options: [
      "Virtual memory paging applied to attention key-value cache memory blocks",
      "Copy-on-write process forking applied to attention key-value cache blocks",
      "Cooperative thread scheduling applied to multi-headed attention layer execution",
      "Lock-free ring buffer queuing applied to GPU kernel launch submission paths",
    ],
    answer: 0,
    explain:
      "PagedAttention, introduced in the vLLM paper, applies virtual memory paging concepts to the KV cache. Attention keys and values are stored in non-contiguous blocks like OS memory pages.",
  },
  {
    id: "e11",
    level: "expert",
    topic: "industry",
    q: "What memory bandwidth does the H100 SXM offer with its HBM3 memory configuration?",
    options: [
      "Up to 3.35 TB/s of memory bandwidth on the HBM3 stack",
      "Up to 2.00 TB/s of memory bandwidth on the HBM3 stack",
      "Up to 1.55 TB/s of memory bandwidth on the HBM3 stack",
      "Up to 4.80 TB/s of memory bandwidth on the HBM3 stack",
    ],
    answer: 0,
    explain:
      "Per NVIDIA H100 specifications, the SXM variant delivers up to 3.35 TB/s memory bandwidth from its 80GB HBM3 stack. The A100 80GB by contrast offers up to 2 TB/s from HBM2e.",
  },
  {
    id: "e12",
    level: "expert",
    topic: "industry",
    q: "Which Stanford LMSYS framework is best known for structured LLM programs?",
    options: [
      "SGLang, the structured generation language for fast LLM programs",
      "TensorRT-LLM, the NVIDIA-optimized LLM inference engine for Hopper",
      "DeepSpeed-MII, the Microsoft Research multi-instance inference SDK",
      "FlexGen, the high-throughput offloaded inference engine for single GPU",
    ],
    answer: 0,
    explain:
      "SGLang is the Stanford / LMSYS structured generation language for fast LLM programs. It is one of the inference frameworks Cerebrium showcases in its example library.",
  },
];

const TOPIC_LABEL: Record<string, string> = {
  "company-fun-facts": "Cerebrium company fun facts",
  "company-products": "Cerebrium product line and pricing",
  industry: "Serverless GPU and AI infra concepts",
};

// ── Helpers ────────────────────────────────────────────────
function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// Fisher-Yates shuffle of question order, plus per-question position-shuffle
// of the correct answer to fight position bias.
function shuffleQuestions(questions: Question[]): Question[] {
  const ordered = [...questions];
  for (let i = ordered.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [ordered[i], ordered[j]] = [ordered[j], ordered[i]];
  }
  return ordered.map((q) => {
    const correctText = q.options[q.answer];
    const wrongTexts = q.options
      .filter((_, i) => i !== q.answer)
      .sort(() => Math.random() - 0.5);
    const targetPos = Math.floor(Math.random() * 4);
    const newOptions = [...wrongTexts];
    newOptions.splice(targetPos, 0, correctText);
    return { ...q, options: newOptions, answer: targetPos };
  });
}

type Level = "beginner" | "intermediate" | "expert";

const LEVEL_LABEL: Record<Level, string> = {
  beginner: "Beginner",
  intermediate: "Intermediate",
  expert: "Expert",
};

const LEVEL_BLURB: Record<Level, string> = {
  beginner:
    "Foundational Cerebrium facts: founders, YC batch, headquarters, product positioning, and core serverless GPU concepts.",
  intermediate:
    "Funding round, investor lineup, GPU lineup, regions, pricing structure, security posture, and named customers.",
  expert:
    "Per-second pricing, cold-start benchmarks, compliance certifications, internal architecture, and AI infra deep cuts.",
};

function App() {
  const [stage, setStage] = useState<"setup" | "run" | "done">("setup");
  const [level, setLevel] = useState<Level | null>(null);
  const [qs, setQs] = useState<Question[]>([]);
  const [idx, setIdx] = useState(0);
  const [picks, setPicks] = useState<Record<string, number>>({});
  const [revealed, setRevealed] = useState<Record<string, number>>({});
  const [toast, setToast] = useState(false);

  const startLevel = (lvl: Level) => {
    const pool = BANK.filter((q) => q.level === lvl);
    setLevel(lvl);
    setQs(shuffleQuestions(pool));
    setIdx(0);
    setPicks({});
    setRevealed({});
    setStage("run");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const choose = (qid: string, ci: number) => {
    if (revealed[qid] !== undefined) return;
    setPicks((p) => ({ ...p, [qid]: ci }));
    setRevealed((r) => ({ ...r, [qid]: ci }));
  };

  const nextQ = () => {
    if (idx + 1 < qs.length) setIdx(idx + 1);
    else setStage("done");
  };

  const correctCount = useMemo(
    () => qs.reduce((acc, q) => acc + (picks[q.id] === q.answer ? 1 : 0), 0),
    [qs, picks]
  );

  const breakdown = useMemo(() => {
    const m = {
      beginner: { correct: 0, total: 0 },
      intermediate: { correct: 0, total: 0 },
      expert: { correct: 0, total: 0 },
    };
    for (const q of qs) {
      m[q.level].total++;
      if (picks[q.id] === q.answer) m[q.level].correct++;
    }
    return m;
  }, [qs, picks]);

  const topicBreakdown = useMemo(() => {
    const m: Record<string, { correct: number; total: number }> = {};
    for (const q of qs) {
      const t = q.topic;
      if (!m[t]) m[t] = { correct: 0, total: 0 };
      m[t].total++;
      if (picks[q.id] === q.answer) m[t].correct++;
    }
    return m;
  }, [qs, picks]);

  const summary = useMemo(() => {
    const lines: string[] = [];
    lines.push("Cerebrium · Serverless GPU & Real-time AI Infrastructure Trivia");
    if (level) lines.push(`Mode: ${LEVEL_LABEL[level]}`);
    lines.push(`Score: ${correctCount} / ${qs.length}`);
    lines.push("");
    lines.push("Topic breakdown:");
    Object.entries(topicBreakdown).forEach(([t, v]) => {
      lines.push(`  - ${TOPIC_LABEL[t] || t}: ${v.correct}/${v.total}`);
    });
    return lines.join("\n");
  }, [correctCount, qs.length, topicBreakdown, level]);

  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(summary);
      setToast(true);
      setTimeout(() => setToast(false), 1600);
    } catch {
      const ta = document.createElement("textarea");
      ta.value = summary;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
      setToast(true);
      setTimeout(() => setToast(false), 1600);
    }
  };

  const restart = () => {
    setStage("setup");
    setLevel(null);
    setIdx(0);
    setPicks({});
    setRevealed({});
    setQs([]);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const replaySameLevel = () => {
    if (level) startLevel(level);
  };

  if (stage === "setup") {
    return (
      <div className="wrap">
        <header className="brand-bar">
          <a
            href={BRAND.homepage}
            target="_blank"
            rel="noopener noreferrer"
            className="brand-logo"
            aria-label={BRAND.company}
            dangerouslySetInnerHTML={{ __html: BRAND.logoSvg }}
          />
          <span className="brand-chip">Independent quiz</span>
        </header>
        <div className="eyebrow">Cerebrium knowledge quiz · choose your mode</div>
        <h1>
          Serverless GPU and real-time AI <span className="hl">trivia</span>
        </h1>
        <p className="lede">
          Pick a mode. Each mode runs 12 questions at that difficulty tier. Topics span Cerebrium's founders, funding, pricing, GPU lineup, security posture, and the broader serverless GPU and AI infrastructure landscape. Length parity validated. Plausible wrong answers.
        </p>

        <div className="card">
          <h2>Beginner Mode</h2>
          <p style={{ color: "#cdd3df", fontSize: 14, lineHeight: 1.6, marginBottom: 12 }}>
            {LEVEL_BLURB.beginner}
          </p>
          <button className="btn" onClick={() => startLevel("beginner")}>
            Start Beginner Mode · 12 questions
          </button>
        </div>

        <div className="card">
          <h2>Intermediate Mode</h2>
          <p style={{ color: "#cdd3df", fontSize: 14, lineHeight: 1.6, marginBottom: 12 }}>
            {LEVEL_BLURB.intermediate}
          </p>
          <button className="btn" onClick={() => startLevel("intermediate")}>
            Start Intermediate Mode · 12 questions
          </button>
        </div>

        <div className="card">
          <h2>Expert Mode</h2>
          <p style={{ color: "#cdd3df", fontSize: 14, lineHeight: 1.6, marginBottom: 12 }}>
            {LEVEL_BLURB.expert}
          </p>
          <button className="btn" onClick={() => startLevel("expert")}>
            Start Expert Mode · 12 questions
          </button>
        </div>

        <div className="card">
          <h2>How it works</h2>
          <ul className="ticks">
            <li>36 questions total in the bank · 12 per difficulty tier</li>
            <li>4 choices each · correct answer position randomized per session</li>
            <li>Distractors use real serverless GPU and AI infra competitor names so guessing is harder</li>
            <li>No accounts, no tracking, runs locally in your browser</li>
          </ul>
        </div>

        <div className="footer-note">
          Cerebrium facts in this quiz come from the public homepage, the about page, the pricing page, the GPU hardware docs, the Y Combinator company profile, the Gradient-led seed announcement (Jul 2025, $8.5M), the AI Minds podcast with CEO Michael Louis, and the Frontlines.io GTM interview. Distractors reference real serverless GPU and AI infra competitor and tooling names so guessing is genuinely harder.
        </div>
        <footer className="attribution">{BRAND.attribution}</footer>
      </div>
    );
  }

  if (stage === "run") {
    const q = qs[idx];
    if (!q) return null;
    const chosen = picks[q.id];
    const reveal = revealed[q.id] !== undefined;
    return (
      <div className="wrap">
        <header className="brand-bar">
          <a
            href={BRAND.homepage}
            target="_blank"
            rel="noopener noreferrer"
            className="brand-logo"
            aria-label={BRAND.company}
            dangerouslySetInnerHTML={{ __html: BRAND.logoSvg }}
          />
          <span className="brand-chip">Independent quiz</span>
        </header>
        <div className="progress">
          <div style={{ width: `${(idx / qs.length) * 100}%` }} />
        </div>
        <div className="eyebrow">
          {level ? LEVEL_LABEL[level] : ""} Mode · Question {idx + 1} of {qs.length} · {TOPIC_LABEL[q.topic] || q.topic}
        </div>
        <div className="card qcard">
          <h2 style={{ fontSize: 18, lineHeight: 1.4, marginBottom: 14 }}>{q.q}</h2>
          {q.options.map((opt, i) => {
            let cls = "opt";
            if (reveal) {
              if (i === q.answer) cls += " correct";
              else if (i === chosen) cls += " wrong";
            } else if (i === chosen) cls += " picked";
            return (
              <button key={i} className={cls} onClick={() => choose(q.id, i)}>
                {String.fromCharCode(65 + i)}. {opt}
              </button>
            );
          })}
          {reveal && (
            <div className="explain">
              <strong>{chosen === q.answer ? "Correct." : "Not quite."}</strong> {q.explain}
            </div>
          )}
          {reveal && (
            <div style={{ marginTop: 14 }}>
              <button className="btn" onClick={nextQ}>
                {idx + 1 < qs.length ? "Next question" : "See results"}
              </button>
            </div>
          )}
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <button className="btn secondary" onClick={restart}>
            Restart
          </button>
        </div>
        <footer className="attribution">{BRAND.attribution}</footer>
      </div>
    );
  }

  // done
  const pct = qs.length ? Math.round((correctCount / qs.length) * 100) : 0;
  const headline =
    pct >= 90
      ? "Genuinely sharp on Cerebrium and serverless GPU infrastructure."
      : pct >= 70
      ? "Solid working understanding."
      : pct >= 50
      ? "Reasonable grasp. A few good rabbit holes ahead."
      : "Plenty of room to learn. Cerebrium's docs are a good next stop.";

  return (
    <div className="wrap">
      <header className="brand-bar">
        <a
          href={BRAND.homepage}
          target="_blank"
          rel="noopener noreferrer"
          className="brand-logo"
          aria-label={BRAND.company}
          dangerouslySetInnerHTML={{ __html: BRAND.logoSvg }}
        />
        <span className="brand-chip">Independent quiz</span>
      </header>
      <div className="eyebrow">Results</div>
      <h1>
        {correctCount} / {qs.length} correct · {pct}%
      </h1>
      <p className="lede">{headline}</p>

      <div className="card">
        <h2>Mode</h2>
        <div className="topic-row">
          <span style={{ color: "#cdd3df" }}>{level ? LEVEL_LABEL[level] : ""} Mode</span>
          <span className="num">
            {correctCount}/{qs.length}
          </span>
        </div>
      </div>

      <div className="card">
        <h2>Topic breakdown</h2>
        {Object.entries(topicBreakdown).map(([t, v]) => (
          <div className="topic-row" key={t}>
            <span style={{ color: "#cdd3df" }}>{TOPIC_LABEL[t] || t}</span>
            <span className="num">
              {v.correct}/{v.total}
            </span>
          </div>
        ))}
      </div>

      <div className="card">
        <h2>Where to go next</h2>
        <div style={{ color: "#cdd3df", fontSize: 14, lineHeight: 1.6 }}>
          The full Cerebrium product and pricing reference lives at{" "}
          <a
            href="https://www.cerebrium.ai"
            target="_blank"
            rel="noopener noreferrer"
          >
            cerebrium.ai
          </a>
          . Pricing details are at{" "}
          <a
            href="https://cerebrium.ai/pricing"
            target="_blank"
            rel="noopener noreferrer"
          >
            cerebrium.ai/pricing
          </a>
          .
        </div>
      </div>

      <div className="card">
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <button className="btn" onClick={onCopy}>
            Copy results
          </button>
          <button className="btn secondary" onClick={replaySameLevel}>
            Replay {level ? LEVEL_LABEL[level] : ""} Mode
          </button>
          <button className="btn secondary" onClick={restart}>
            Try a different mode
          </button>
        </div>
      </div>

      <div className="footer-note">
        Cerebrium facts in this quiz are sourced from the public homepage, the about page, the pricing page, the GPU hardware docs, the Y Combinator profile, the Gradient-led $8.5M seed announcement (July 2025), the AI Minds podcast with CEO Michael Louis, and the Frontlines.io GTM interview. Distractors reference real serverless GPU and AI infra competitor and tooling names (Modal, Replicate, RunPod, Baseten, Banana, Beam, Lambda Labs, Together AI, Fireworks, Anyscale) and real infra terms (Kubernetes, EKS, GKE, vLLM, SGLang, TensorRT-LLM, Triton, MIG) so guessing is genuinely harder.
      </div>

      <div className="pdf-footer print-only">
        An independent tool by Ryan Lacerda. Not affiliated with Cerebrium. Visit cerebrium at https://www.cerebrium.ai.
      </div>

      <div className={"toast " + (toast ? "show" : "")}>Results copied to clipboard</div>
      <footer className="attribution">{BRAND.attribution}</footer>
    </div>
  );
}

export default App;

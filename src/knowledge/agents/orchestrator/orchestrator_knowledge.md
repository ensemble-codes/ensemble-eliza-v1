# Large Language Models (LLMs) and AI Agents: A Knowledge Base

## Introduction

Recent breakthroughs in Artificial Intelligence (AI), particularly in Large Language Models (LLMs), have significantly accelerated the evolution and capabilities of AI agents. These two technologies are increasingly intertwined, with LLMs often serving as a core component for more sophisticated agent architectures. This knowledge base compiles information from the provided sources to define and explain LLMs and AI agents, their relationship, and their applications.

## Large Language Models (LLMs)

### Definition and Nature
- Large Language Models are a class of **foundation models**
- They are trained on enormous amounts of data to provide foundational capabilities for multiple use cases and tasks. This contrasts with building domain-specific models for individual tasks, which is costly and can lead to inferior performance
- LLMs represent a **significant breakthrough in Natural Language Processing (NLP)** and artificial intelligence

### How They Work
- LLMs use a blend of **neural networks and machine learning**
- They employ **transformer models** which provide the architecture for these systems
- A key factor in how LLMs work is their use of **multi-dimensional vectors, known as word embeddings**, to represent words. This allows them to recognize relationships between words, such as those with similar meanings, overcoming limitations of earlier methods like numerical tables
- They are able to understand and generate content thanks to **billions of parameters** that capture intricate patterns in language

### Capabilities
- LLMs are designed to **understand and generate text** like a human
- They can also generate **other forms of content**
- Capabilities include: inferring from context, generating coherent and contextually relevant responses, translating languages, summarizing text, answering questions (general and FAQs), assisting in creative writing, and code generation/translation

### Examples of LLMs
- Leading very large models include **GPT**, **LLaMa**, **LaMDA**, **PaLM 2**, **BERT**, and **ERNIE**
- Other examples include Google's BERT/RoBERTa and PaLM models, Meta's Llama models, and IBM's Granite model series on watsonx.ai
- DeepSeek-R1 is mentioned as a powerful open-source LLM
- Specific models mentioned include GPT-3, GPT-4, Claude, Gemini, Mistral's AI models, and the foundation models in IBM® watsonx.ai™

### Interaction Methods
- Users can interact with LLMs through various methods, including: **Chat Interfaces**, **Voice Assistants**, **Graphical User Interfaces (GUIs)**, **Command-Line Interfaces (CLIs)**, **APIs & Wrappers**, **Fine-Tuning and Training**, **Prompt Engineering**, **Educational and Research Tools**, and **Embedded Systems**
- Prompt engineering involves crafting specific prompts to elicit desired outputs

### Applications of LLMs
- LLMs are at the heart of various applications, including **customer service chatbots**, **content creation**, and **software development**
- They are revolutionizing applications in **chatbots and virtual assistants**, **content generation**, **research assistance**, and **language translation**
- In research and data analysis, LLMs assist professionals with processing extensive datasets, summarizing key insights, and extracting relevant information. This enhances research efficiency in industries like finance, healthcare, and academia
- They improve automated virtual assistants like Alexa, Google Assistant, and Siri, enabling better interpretation of user intent and response to sophisticated commands

### Risks and Limitations
- LLMs, like any technology, are tools to be used with awareness and caution
- They may produce content that is unwanted, including toxic and inappropriate content
- Language models trained on large text corpora are known to pass on or amplify biases based on race, gender, disability, nationality, or religion
- There are areas prone to **hallucinations** or outdated data
- Strategies to guard against "botshit" include verifying information, cross-checking, crafting clear prompts, understanding limitations, and maintaining a critical mindset

## AI Agents

### Definition and Concept
- Intelligent agents are **entities designed to act in various digital environments**
- They gather knowledge from their surroundings, assess the situation, and execute actions to achieve predefined goals
- AI agents are programs that can **autonomously perform a task on behalf of a user**
- The modern conceptualization of AI agents, influenced by Russell and Norvig, defines an agent as **anything that can be viewed as perceiving its environment through sensors and acting upon that environment through actuators**
- The concept of AI agents provides a foundational lens through which to define and understand artificial intelligence
- AI agents do not have a single standard definition
- AI agents are distinguished from traditional AI models by their **autonomy and adaptability**, ability to interact with dynamic environments, make independent decisions, and learn from experiences. They are suitable for complex, real-world applications
- Agency theory implies a relationship where one entity (the agent) acts on behalf of another (the principal), making decisions relevant to the principal's interests

### How They Operate
- Intelligent agents operate by gathering knowledge, assessing the situation, and executing actions. Their performance is influenced by the external actions they take within observable environments
- The definition of an agent establishes a fundamental **perception-action loop**
- Agents base their actions on the information they perceive
- Goal-based agents use "goal" information to choose among possibilities, selecting actions that reach a desirable state. Search and planning are AI subfields devoted to finding such action sequences
- Autonomous agents first devise a plan with a series of steps to accomplish a complex task
- They then use **function calling to connect to external tools** (APIs, data sources, web searches, other AI agents) to fill knowledge gaps
- After executing a plan, they **learn from feedback and store learned information in memory** to improve future performance

### Core Components
- Modern agent architectures include core components like **perception mechanisms**, **knowledge representation**, **reasoning modules**, and **action selection**
- **Perception mechanisms** enable accurate interpretation of complex, ambiguous, or noisy inputs. Robust perception is foundational
- **Knowledge representation systems** store, organize, and retrieve information, balancing expressiveness, computational efficiency, and learnability. They often use hybrid approaches combining symbolic (ontologies, knowledge graphs) and distributed (embeddings) representations. Knowledge can include declarative (facts), procedural (how-to), episodic (experiences), and meta-knowledge (self-capabilities). The knowledge base includes information about the environment, predefined rules, and understanding of the current situation
- The **performance element** refers to the agent's ability to achieve goals and make decisions that optimize actions in an environment. It determines efficiency and effectiveness

### Key Attributes
- Key attributes include **complex goal structures**, **natural language interfaces**, the capacity to **act independently** of user supervision, and the **integration of software tools or planning systems**
- Agents embody a stronger notion of **autonomy** than objects, deciding whether to perform actions on request
- Agents are capable of **flexible behavior** (reactive, proactive, social)

### Relationship with LLMs (LLM-based Agents / Agentic AI)
- The evolution of AI agents has been accelerated by breakthroughs in LLMs
- LLMs provide a foundation for more sophisticated reasoning capabilities
- Modern AI agents **leverage LLMs as core components**, augmenting them with specialized modules for memory, planning, tool use, and environmental interaction
- This integration enables agents to perform complex tasks that were challenging for traditional AI
- LLMs serve as the **cognitive core, or "Brain," of AI agents**
- While traditional LLMs are limited by their training data, **agentic technology uses tool calling on the backend** to obtain up-to-date information, optimize workflows, and create subtasks autonomously
- Agents can be viewed as **layers on top of language models** that observe, collect information, provide input to the model, and generate/communicate/act on an action plan
- LLMs enable advanced capabilities like reasoning, memory, planning, and dynamic learning for agents. They can adapt to unseen tasks and execute goal-driven actions
- **Retrieval-augmented generation (RAG)** enhances LLM capabilities for agents by integrating external knowledge sources, allowing retrieval of relevant information and conditioning language generation on it. This addresses the limitation of LLMs accessing only training data. Agentic RAG mechanisms are used in studies like Search-o1. RAG tools are included in frameworks like CrewAI

### Types/Categories of AI Agents
- The typology of AI agents has evolved from simple reactive systems to sophisticated autonomous agents
- Categories include **single-agent scenarios**, **multi-agent interactions**, and **human-agent collaboration**
- Specific types mentioned include **Instruction-based Computer Control Agents (CCAs)** and **Information agents** (e.g., IRA, Carnot)

### Agent Communication
- Agent Communication Languages (ACLs) are informed by speech act theories
- Efforts like the DARPA-funded Knowledge Sharing Effort (KSE) developed protocols for exchanging knowledge between autonomous systems
- KQML (Knowledge Query and Manipulation Language) was proposed in the 1990s, using performatives and the concept of a virtual knowledge base (VKB) where agents attribute knowledge to others

## Multi-Agent Systems (MAS)

### Definition and Characteristics
- A multiagent system involves **multiple interactive agents**
- A multiagent system is inherently **multi-threaded**, with each agent having at least one thread of control
- LLM-based multi-agent systems (LLM-MA) extend the capabilities of single-agent systems
- These systems harness the collective intelligence of multiple LLM-based agents to solve complex problems and simulate real-world environments
- Agents in LLM-MA systems specialize, interact, and collaborate. They are tailored for distinct roles to collectively solve tasks or simulate phenomena

### Collaboration Mechanisms
- Research explores multi-agent collaboration mechanisms, including **actors, structures, and strategies**
- Studies present extensible frameworks for future research in this area
- Cocoa is a collaboration model proposed for AI-assisted multi-step tasks
- Modelling social action for AI agents delves into dependencies, coordination, and goal dynamics as drivers of social interaction

### Multi-Agent Reinforcement Learning (MARL)
- MARL is an area of study in multi-agent systems
- Research discusses state-of-the-art MARL algorithms and introduces evaluation criteria (the "AI agenda")

## AI Agent Frameworks

- AI agent frameworks provide a foundational structure for agentic AI development
- Examples of frameworks for building AI agents include:
  - **CrewAI**: A scalable, open-source framework supporting connections to various LLMs and RAG tools
  - **LangChain**: Another open-source framework for building LLM-powered applications, including agents, using a modular architecture
  - **IntellAgent**: A scalable, open-source framework that automates realistic, policy-driven benchmarking using graph modeling and interactive simulations
  - Other frameworks mentioned include **CAMEL**, **Microsoft AutoGen**, **OpenAI Swarm**, **Agent SDK**, **A2A by Google**, **SmolAgents**, **LangGraph**, **Agno**, **LangFlow**, and **AutoGPT**

## Applications of AI Agents

- A common application is the **automation of tasks**
- Agentic AI can be a boon for businesses, used in areas like **fraud monitoring** and **supply chain management**
- Applications across enterprise contexts, personal assistance, and specialized domains are being explored
- Real-world applications transforming industries are emerging
- Examples across various sectors:
  - **Computer Use:** Instruction-based agents automating complex tasks using natural language
  - **Legal:** LegalAlly (AI legal assistant) streamlines workflows, crafts documents, provides guidance. Agents enhance legal practice by researching case law, analyzing contracts, assessing compliance, and drafting documents. Reduced review time and improved identification of problematic clauses were observed in a corporate legal department example
  - **Education:** Personalized learning plans based on student performance and styles
  - **Research & Data Analysis:** Agents can serve as personal research assistants, finding, organizing, and synthesizing information from diverse sources. They can extract specific information and present findings tailored to user needs. Applications in scientific research include generating hypotheses, designing experiments, analyzing results, and synthesizing literature. Significant reductions in research time have been observed
  - **Knowledge Management:** Agents can organize, retrieve, and synthesize information from vast corporate knowledge bases. Tailored agents for specific content sources enhance knowledge worker productivity and decision quality
  - **Software Development:** Agents can automate tasks like codebase analysis and documentation generation
  - **Electronic Commerce:** Applications in agent-mediated e-commerce exist
  - **Other Examples:** Agents for lead enrichment, competitor research, content generation, legal document creation, news roundups, and invoice processing

## Challenges and Ethical Considerations

- Ongoing challenges exist in the field of AI agents
- Building systems that align with ethical considerations and societal needs is crucial for the future of AI agents
- Risks identified for AI agents include information asymmetry and discretionary authority, suggesting a need for new legal and technical infrastructures for governing them
- Challenges for multimodal agents include hallucinations, generalization across environments, and ethical considerations in deployment
- Limitations of LLM-based multi-agent systems include hallucinations, scalability issues, and the lack of multi-modal integration
- Challenges for LLM-based agents broadly include ethical concerns, scalability, and trustworthiness

## Learning Resources & Research Papers

- Prominent research papers on AI agents can be found in journals like the Journal of Artificial Intelligence Research and platforms such as arXiv and Hugging Face
- Notable research papers mentioned cover topics like social action, multi-agent systems, reinforcement learning, generative models, ethical considerations, task planning, tool usage, context-aware systems, multimodal interaction, and the potential of LLM-based agents
- Three collections provide an introduction to multiagent systems: Bond and Gasser's 1988 collection, Huhns and Singh's 1998 collection, and Bradshaw (1997) on software agents
- Online resources for learning about building and using AI agents can be found on platforms like Reddit (e.g., r/AI_Agents) and Discord
- Courses are available covering Generative AI, Large Language Models, Prompt Engineering, and building LLM applications
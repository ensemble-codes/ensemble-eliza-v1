import { type Project } from "@elizaos/core";

import oniiAgent from "./agents/onii";
import orchestratorAgent from "./agents/orchestrator";
import unionAgent from "./agents/union";

const project: Project = {
  agents: [oniiAgent, orchestratorAgent, unionAgent],
};

export default project;

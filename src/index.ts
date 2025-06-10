import { type Project } from "@elizaos/core";

import oniiAgent from "./agents/onii";
import orchestratorAgent from "./agents/orchestrator";

const project: Project = {
  agents: [oniiAgent, orchestratorAgent],
};

export default project;

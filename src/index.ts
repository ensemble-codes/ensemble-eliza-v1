import { type Project } from "@elizaos/core";

import oniiAgent from "./agents/onii";
import orchestatorAgent from "./agents/orchestrator";

const project: Project = {
  agents: [orchestatorAgent, oniiAgent],
};

export default project;

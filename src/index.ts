import { type Project } from "@elizaos/core";

import oniiAgent from "./agents/onii";
import orchestatorAgent from "./agents/orchestrator";

const project: Project = {
  agents: [oniiAgent, orchestatorAgent],
};

export default project;

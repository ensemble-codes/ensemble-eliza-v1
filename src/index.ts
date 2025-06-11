import { type Project } from "@elizaos/core";

import oniiAgent from "./agents/onii";
// import orchestratorAgent from "./agents/orchestrator";

const project: Project = {
  agents: [oniiAgent],
};

export default project;

import { describe, it, expect, beforeEach, vi } from "vitest";
import { agentServicesAction } from "../src/actions/agentServices";
import { IAgentRuntime, Memory, State, Character } from "@elizaos/core";

describe("Agent Services Action", () => {
  let mockRuntime: Partial<IAgentRuntime>;
  let mockMessage: Memory;
  let mockState: State;
  let mockCallback: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    const mockCharacter: Partial<Character> = {
      name: "TestAgent",
      bio: ["Test agent bio"],
      settings: {
        AGENT_SERVICES: JSON.stringify([
          {
            id: "test_service",
            name: "Test Service",
            price: 100,
            currency: "credits",
            description: "A test service"
          }
        ])
      }
    };

    mockRuntime = {
      character: mockCharacter as Character,
      getRoom: vi.fn().mockResolvedValue({ id: "550e8400-e29b-41d4-a716-446655440000" })
    };

    mockMessage = {
      id: "550e8400-e29b-41d4-a716-446655440001" as `${string}-${string}-${string}-${string}-${string}`,
      content: {
        text: "What services can you provide?",
        source: "test"
      },
      roomId: "550e8400-e29b-41d4-a716-446655440002" as `${string}-${string}-${string}-${string}-${string}`,
      entityId: "550e8400-e29b-41d4-a716-446655440003" as `${string}-${string}-${string}-${string}-${string}`,
      createdAt: Date.now()
    };

    mockState = {
      data: {
        room: { id: "550e8400-e29b-41d4-a716-446655440002" }
      },
      values: {},
      text: ""
    };

    mockCallback = vi.fn();
  });

  it("should validate messages asking about services", async () => {
    const result = await agentServicesAction.validate(
      mockRuntime as IAgentRuntime,
      mockMessage,
      mockState
    );
    expect(result).toBe(true);
  });

  it("should not validate unrelated messages", async () => {
    mockMessage.content.text = "Hello there!";
    const result = await agentServicesAction.validate(
      mockRuntime as IAgentRuntime,
      mockMessage,
      mockState
    );
    expect(result).toBe(false);
  });

  it("should respond with services menu and structured data", async () => {
    await agentServicesAction.handler(
      mockRuntime as IAgentRuntime,
      mockMessage,
      mockState,
      {},
      mockCallback,
      []
    );

    expect(mockCallback).toHaveBeenCalledWith(
      expect.objectContaining({
        text: expect.stringContaining("TestAgent Services Menu"),
        actions: ["AGENT_SERVICES"],
        data: expect.objectContaining({
          type: "agent_services",
          from: "testagent.ensemble",
          to: expect.stringMatching(/user_\w+/),
          content: expect.objectContaining({
            data: expect.objectContaining({
              services: expect.arrayContaining([
                expect.objectContaining({
                  id: "test_service",
                  name: "Test Service",
                  price: 100,
                  currency: "credits"
                })
              ]),
              agent_name: "TestAgent"
            })
          })
        })
      })
    );
  });

  it("should use default services when no custom services are configured", async () => {
    if (mockRuntime.character) {
      mockRuntime.character.settings = {};
    }

    await agentServicesAction.handler(
      mockRuntime as IAgentRuntime,
      mockMessage,
      mockState,
      {},
      mockCallback,
      []
    );

    expect(mockCallback).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          content: expect.objectContaining({
            data: expect.objectContaining({
              services: expect.arrayContaining([
                expect.objectContaining({
                  id: "consultation_service",
                  name: "Expert Consultation"
                }),
                expect.objectContaining({
                  id: "analysis_service",
                  name: "Data Analysis"
                }),
                expect.objectContaining({
                  id: "content_creation",
                  name: "Content Creation"
                })
              ])
            })
          })
        })
      })
    );
  });
}); 
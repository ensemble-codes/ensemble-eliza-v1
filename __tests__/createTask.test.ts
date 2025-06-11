import { describe, expect, it, vi, beforeEach } from 'vitest';
import { createTaskAction } from '../src/agents/onii/actions/createTask';
import type { IAgentRuntime, Memory, State, HandlerCallback } from '@elizaos/core';

// Mock runtime following existing patterns
const createMockRuntime = (): IAgentRuntime => {
  return {
    character: {
      name: 'Onii',
      settings: {},
    },
    getRoom: vi.fn().mockResolvedValue({
      id: 'test-room-123',
      name: 'Test Room',
    }),
    getSetting: vi.fn().mockReturnValue("0x515e4af972D84920a9e774881003b2bD797c4d4b"),
  } as any as IAgentRuntime;
};

// Mock message
const createMockMessage = (text: string): Memory => {
  return {
    id: 'test-message-123',
    entityId: 'user_12345678',
    roomId: 'test-room-123',
    timestamp: Date.now(),
    content: {
      text,
      source: 'test',
      actions: [],
    },
    metadata: {},
  } as Memory;
};

// Mock state
const createMockState = (): State => {
  return {
    data: {
      room: {
        id: 'test-room-123',
        name: 'Test Room',
      },
    },
  } as State;
};

describe('createTask Action', () => {
  let runtime: IAgentRuntime;
  let mockCallback: HandlerCallback;

  beforeEach(() => {
    runtime = createMockRuntime();
    mockCallback = vi.fn();
  });

  describe('Validation', () => {
    it('should validate task-related messages', async () => {
      const message = createMockMessage('create task for writing a blog post');
      const state = createMockState();

      const result = await createTaskAction.validate(runtime, message, state);
      expect(result).toBe(true);
    });

    it('should validate various task keywords', async () => {
      const testCases = [
        'make task',
        'do task', 
        'execute this',
        'perform task',
        'run task',
        'task creation',
      ];

      for (const testCase of testCases) {
        const message = createMockMessage(testCase);
        const state = createMockState();
        const result = await createTaskAction.validate(runtime, message, state);
        expect(result).toBe(true);
      }
    });

    it('should not validate non-task messages', async () => {
      const message = createMockMessage('hello world');
      const state = createMockState();

      const result = await createTaskAction.validate(runtime, message, state);
      expect(result).toBe(false);
    });
  });

  describe('Handler', () => {
    it('should create task from JSON input with correct format', async () => {
      const taskJson = '{"task": {"name": "Write bull post", "type": "bull_post", "parameters": {"project_name": "TestProject", "key_features": "AI agents"}}}';
      const message = createMockMessage(`Create task: ${taskJson}`);
      const state = createMockState();

      const result = await createTaskAction.handler(
        runtime,
        message,
        state,
        {},
        mockCallback,
        []
      );

      expect(mockCallback).toHaveBeenCalled();
      const callbackArgs = (mockCallback as any).mock.calls[0][0];
      
      expect(callbackArgs.text).toContain('Task Created Successfully');
      expect(callbackArgs.text).toContain('Write bull post');
      expect(callbackArgs.text).toContain('bull_post_service');
      expect(callbackArgs.text).toContain('1 USDC');
      expect(callbackArgs.actions).toContain('CREATE_TASK');
      expect(callbackArgs.data.type).toBe('create_task');
      expect(callbackArgs.data.from).toBe('0x515e4af972D84920a9e774881003b2bD797c4d4b');
      expect(callbackArgs.data.to).toBe('onii.ensemble');
      expect(callbackArgs.data.content.data.service_id).toBe('bull_post_service');
      expect(callbackArgs.data.content.data.price).toBe(1);
      expect(callbackArgs.data.content.data.parameters).toEqual({
        project_name: 'TestProject',
        key_features: 'AI agents'
      });
    });

    it('should create default task from plain text with correct format', async () => {
      const message = createMockMessage('Create a task to write a Twitter thread');
      const state = createMockState();

      await createTaskAction.handler(runtime, message, state, {}, mockCallback, []);

      expect(mockCallback).toHaveBeenCalled();
      const callbackArgs = (mockCallback as any).mock.calls[0][0];
      
      expect(callbackArgs.text).toContain('Task Created Successfully');
      expect(callbackArgs.text).toContain('Twitter thread');
      expect(callbackArgs.text).toContain('thread_creation');
      expect(callbackArgs.text).toContain('5 USDC');
      expect(callbackArgs.actions).toContain('CREATE_TASK');
      expect(callbackArgs.data.type).toBe('create_task');
      expect(callbackArgs.data.content.data.service_id).toBe('thread_creation');
      expect(callbackArgs.data.content.data.price).toBe(5);
    });

    it('should generate unique task IDs', async () => {
      const message = createMockMessage('create task test');
      const state = createMockState();

      // Create two tasks
      await createTaskAction.handler(runtime, message, state, {}, mockCallback, []);
      const firstTaskData = (mockCallback as any).mock.calls[0][0].data;

      const mockCallback2 = vi.fn();
      await createTaskAction.handler(runtime, message, state, {}, mockCallback2, []);
      const secondTaskData = (mockCallback2 as any).mock.calls[0][0].data;

      expect(firstTaskData.content.data.task_id).not.toBe(secondTaskData.content.data.task_id);
    });

    it('should map service types correctly', async () => {
      const testCases = [
        { input: 'create bull post task', expectedService: 'bull_post_service', expectedPrice: 1 },
        { input: 'create twitter thread', expectedService: 'thread_creation', expectedPrice: 5 },
        { input: 'stream consultation needed', expectedService: 'stream_consultation', expectedPrice: 10 },
      ];

      for (const testCase of testCases) {
        const mockCallbackTest = vi.fn();
        const message = createMockMessage(testCase.input);
        const state = createMockState();

        await createTaskAction.handler(runtime, message, state, {}, mockCallbackTest, []);

        const response = mockCallbackTest.mock.calls[0][0];
        expect(response.data.content.data.service_id).toBe(testCase.expectedService);
        expect(response.data.content.data.price).toBe(testCase.expectedPrice);
      }
    });

    it('should handle errors gracefully', async () => {
      const faultyRuntime = {
        ...runtime,
        getRoom: vi.fn().mockRejectedValue(new Error('Room not found')),
      } as any as IAgentRuntime;

      const message = createMockMessage('create task');
      const state = createMockState();

      const result = await createTaskAction.handler(
        faultyRuntime,
        message,
        state,
        {},
        mockCallback,
        []
      );

      expect(mockCallback).toHaveBeenCalled();
      const callbackArgs = (mockCallback as any).mock.calls[0][0];
      
      expect(callbackArgs.text).toContain('trouble creating your task');
      expect(callbackArgs.actions).toContain('CREATE_TASK_ERROR');
    });
  });

  describe('Action Structure', () => {
    it('should have required action properties', () => {
      expect(createTaskAction.name).toBe('CREATE_TASK');
      expect(createTaskAction.description).toBeTruthy();
      expect(Array.isArray(createTaskAction.similes)).toBe(true);
      expect(createTaskAction.similes.length).toBeGreaterThan(0);
      expect(typeof createTaskAction.validate).toBe('function');
      expect(typeof createTaskAction.handler).toBe('function');
      expect(Array.isArray(createTaskAction.examples)).toBe(true);
      expect(createTaskAction.examples.length).toBeGreaterThan(0);
    });

    it('should have valid examples', () => {
      expect(createTaskAction.examples.length).toBeGreaterThan(0);
      
      const firstExample = createTaskAction.examples[0];
      expect(firstExample.length).toBe(2); // Request and response
      
      // Check request
      expect(firstExample[0]).toHaveProperty('name');
      expect(firstExample[0]).toHaveProperty('content');
      expect(firstExample[0].content).toHaveProperty('text');
      
      // Check response
      expect(firstExample[1]).toHaveProperty('name');
      expect(firstExample[1]).toHaveProperty('content');
      expect(firstExample[1].content).toHaveProperty('text');
      expect(firstExample[1].content).toHaveProperty('actions');
      expect(firstExample[1].content.actions).toContain('CREATE_TASK');
    });
  });

  it('should validate task messages', async () => {
    const runtime = createMockRuntime();
    const message = createMockMessage('create task test');
    const state = createMockState();

    const result = await createTaskAction.validate(runtime, message, state);
    expect(result).toBe(true);
  });

  it('should create task successfully', async () => {
    const runtime = createMockRuntime();
    const message = createMockMessage('create task test');
    const state = createMockState();
    const mockCallback = vi.fn();

    await createTaskAction.handler(runtime, message, state, {}, mockCallback, []);

    expect(mockCallback).toHaveBeenCalled();
    const response = mockCallback.mock.calls[0][0];
    expect(response.text).toContain('Task Created Successfully');
    expect(response.actions).toContain('CREATE_TASK');
    expect(response.data.type).toBe('create_task');
  });

  it('should have valid structure', () => {
    expect(createTaskAction.name).toBe('CREATE_TASK');
    expect(createTaskAction.examples.length).toBeGreaterThan(0);
  });
}); 
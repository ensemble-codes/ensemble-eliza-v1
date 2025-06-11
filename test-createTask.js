// Simple test for createTask action
const { createTaskAction } = require('./dist/index.js');

console.log('Testing createTask action...');
console.log('Action name:', createTaskAction?.name);
console.log('Action similes:', createTaskAction?.similes);
console.log('Action description:', createTaskAction?.description);

if (createTaskAction) {
  console.log('✅ createTask action exported successfully');
} else {
  console.log('❌ createTask action not found');
} 
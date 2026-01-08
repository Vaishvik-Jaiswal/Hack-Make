console.log("🔥 example.js started");
const { generateSQL } = require('./sqlAgent');

/**
 * Example usage of the SQL Agent
 * 
 * This demonstrates how to use the generateSQL function
 * to convert natural language questions into SQL queries
 */

async function demonstrateAgent() {
  const testQuestions = [
    'How many sellers are registered?',
    'Which district has the least sellers?',
    'List all products in electronics category',
    'How many products have certifications?',
  ];

  console.log('🚀 SQL Agent - Natural Language to SQL Conversion\n');
  console.log('='.repeat(70));

  for (const question of testQuestions) {
    try {
      console.log(`\n📝 Question: ${question}`);
      const sql = await generateSQL(question);
      console.log(`✅ Generated SQL:\n${sql}\n`);
      console.log('-'.repeat(70));
    } catch (error) {
      console.error(`❌ Error: ${error.message}`);
    }
  }
}

// Uncomment below to run demonstration
demonstrateAgent().catch(console.error);

module.exports = { demonstrateAgent };  
/**
 * Agent Pipeline: NL Question → SQL Generation → SQL Validation
 *
 * Agent-1: sqlAgent.js  → Generates SQL
 * Agent-2: sqlValidator.js → Validates SQL
 * Agent-3: sqlExecutor.js (future)
 */

const { generateSQL } = require('./sqlAgent');
const { validateSQL } = require('./sqlValidator');
const { executeSQL, initializePool, closePool } = require('./sqlExecutor');

/**
 * Main Pipeline
 */
async function processQuestion(userQuestion) {
  try {
    console.log('\nUser Question:', userQuestion);

    // -------- Agent-1: SQL Generation --------
    let generatedSQL;
    try {
      generatedSQL = await generateSQL(userQuestion);
      console.log('Agent-1 OK | SQL Generated');
      console.log('SQL:', generatedSQL);
    } catch (error) {
      return {
        success: false,
        sql: null,
        validation: null,
        error: `Agent-1 Error: ${error.message}`
      };
    }

    // -------- Agent-2: SQL Validation --------
    let validatedSQL;
    try {
      validatedSQL = validateSQL(generatedSQL);
      console.log('Agent-2 OK | SQL Validated');

      // -------- Agent-3: SQL Execution (read-only) --------
      try {
        // ensure pool is initialized (no-op if already)
        await initializePool();

        const execResult = await executeSQL(validatedSQL, { timeout: 30000 });

        if (!execResult.success) {
          return {
            success: false,
            sql: validatedSQL,
            validation: {
              status: 'APPROVED',
              message: 'Query passed validation'
            },
            execution: execResult,
            error: execResult.error || 'Execution failed'
          };
        }

        return {
          success: true,
          sql: validatedSQL,
          validation: {
            status: 'APPROVED',
            message: 'Query passed validation'
          },
          execution: execResult,
          error: null
        };
      } catch (execErr) {
        return {
          success: false,
          sql: validatedSQL,
          validation: {
            status: 'APPROVED',
            message: 'Query passed validation'
          },
          execution: null,
          error: `Agent-3 Error: ${execErr.message}`
        };
      }
    } catch (validationError) {
      console.log('Agent-2 BLOCKED:', validationError.message);

      return {
        success: false,
        sql: generatedSQL,
        validation: {
          status: 'REJECTED',
          reason: validationError.message
        },
        error: validationError.message
      };
    }
  } catch (error) {
    return {
      success: false,
      sql: null,
      validation: null,
      error: `Pipeline Error: ${error.message}`
    };
  }
}

/**
 * Pipeline with concise summary
 */
async function processQuestionDetailed(userQuestion) {
  const result = await processQuestion(userQuestion);

  console.log('\nResult:', result.success ? 'SUCCESS' : 'BLOCKED');

  if (result.sql) {
    console.log('Final SQL:', result.sql);
  }

  if (result.validation) {
    console.log('Validation:', result.validation.status);
    console.log(
      'Reason:',
      result.validation.message || result.validation.reason
    );
  }

  if (result.error) {
    console.log('Error:', result.error);
  }

  return result;
}

/**
 * Demo Test Cases
 */
async function runDemo() {
  await processQuestionDetailed(
    'Show me all sellers from Nagpur district with at least 5 products'
  );

  await processQuestionDetailed(
    'How many products are available by category?'
  );

  await processQuestionDetailed(
    'List sellers and their product count'
  );
}

module.exports = {
  processQuestion,
  processQuestionDetailed,
  runDemo
};

if (require.main === module) {
  runDemo().catch(console.error);
}

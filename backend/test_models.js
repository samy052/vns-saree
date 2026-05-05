const Color = require('./src/models/Color');

async function test() {
  try {
    console.log('Attempting to fetch colors...');
    const colors = await Color.findAll();
    console.log('Success! Colors found:', colors.length);
  } catch (error) {
    console.error('ERROR fetching colors:', error);
  } finally {
    process.exit();
  }
}

test();

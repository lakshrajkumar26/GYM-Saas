const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();

async function runMigration() {
  try {
    console.log('Running about page migration...');
    
    const sqlPath = path.join(__dirname, 'prisma', 'migrations', 'add_about_page_fields.sql');
    const sql = fs.readFileSync(sqlPath, 'utf8');
    
    const statements = sql.split(';').filter(s => s.trim());
    
    for (const statement of statements) {
      if (statement.trim()) {
        await prisma.$executeRawUnsafe(statement);
      }
    }
    
    console.log('✅ Migration completed successfully!');
    
    // Set default facilities if not exists
    const settings = await prisma.gymSettings.findFirst();
    if (settings && !settings.facilities) {
      const defaultFacilities = JSON.stringify([
        "Modern Cardio Equipment",
        "Free Weights & Dumbbells",
        "Strength Training Machines",
        "Functional Training Area",
        "Steam & Sauna",
        "Locker Rooms",
        "Shower Facilities",
        "Parking Space",
        "Air Conditioned",
        "Water Purifier",
        "First Aid Kit",
        "CCTV Security"
      ]);
      
      await prisma.gymSettings.update({
        where: { id: settings.id },
        data: { facilities: defaultFacilities }
      });
      
      console.log('✅ Default facilities added!');
    }
    
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

runMigration();

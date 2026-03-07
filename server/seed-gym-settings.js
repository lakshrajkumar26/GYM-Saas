const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function seedGymSettings() {
  try {
    console.log('🌱 Seeding gym settings with facilities and trainers...');
    
    // Check if settings exist
    let settings = await prisma.gymSettings.findFirst();
    
    const defaultFacilities = JSON.stringify([
      "Treadmills & Cardio Machines",
      "Free Weights & Dumbbells",
      "Adjustable Workout Benches",
      "Strength Training Machines",
      "Cable Pulley Machines",
      "Plate Loaded Machines",
      "Barbells & Weight Plates",
      "Leg Press Machines",
      "Chest Press Machines",
      "Full Wall Mirrors",
      "Spacious Workout Area",
      "Modern LED Ceiling Lighting",
      "Rubber / Carpet Gym Flooring",
      "Functional Training Area"
    ]);
    
    const defaultTrainers = JSON.stringify([
      {
        name: "Rahul Sharma",
        specialization: "Strength Training",
        experience: 10
      },
      {
        name: "Amit Verma",
        specialization: "Bodybuilding & Muscle Gain",
        experience: 8
      },
      {
        name: "Priya Mehta",
        specialization: "Yoga & Flexibility",
        experience: 6
      },
      {
        name: "Arjun Singh",
        specialization: "Functional Training & CrossFit",
        experience: 7
      },
      {
        name: "Neha Kapoor",
        specialization: "Cardio & Weight Loss",
        experience: 5
      }
    ]);
    
    if (settings) {
      // Update existing settings
      settings = await prisma.gymSettings.update({
        where: { id: settings.id },
        data: {
          facilities: defaultFacilities,
          trainers: defaultTrainers
        }
      });
      console.log('✅ Updated existing gym settings');
    } else {
      // Create new settings
      settings = await prisma.gymSettings.create({
        data: {
          name: "B Gym Internationals",
          phone: "+91-7903906436",
          phone2: "8789899169",
          email: "info@bgym.com",
          address: "Your Gym Address Here",
          description: "Transform your body, transform your life",
          admissionCharge: 600,
          monthlyCharge: 800,
          morningTiming: "6:00 AM - 11:00 AM",
          eveningTiming: "4:00 PM - 10:00 PM",
          facilities: defaultFacilities,
          trainers: defaultTrainers
        }
      });
      console.log('✅ Created new gym settings');
    }
    
    console.log('\n📊 Gym Settings:');
    console.log(`   - Facilities: ${JSON.parse(settings.facilities).length} items`);
    console.log(`   - Trainers: ${JSON.parse(settings.trainers).length} trainers`);
    
    console.log('\n🎉 Seeding completed successfully!');
    
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

seedGymSettings();

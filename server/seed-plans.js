const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function seedPlans() {
  try {
    console.log('🌱 Seeding membership plans...');

    // Delete existing plans (optional - comment out if you want to keep existing)
    // await prisma.membershipPlan.deleteMany({});

    // GYM PLANS
    const gymPlans = [
      {
        name: '3 Months Gym',
        planType: 'GYM',
        price: 3000,
        discountPrice: 2400,
        duration: 90,
        features: JSON.stringify([
          'Full gym access',
          'All equipment usage',
          'Locker facility',
          'Free fitness assessment',
          '20% discount'
        ])
      },
      {
        name: '6 Months Gym',
        planType: 'GYM',
        price: 5400,
        discountPrice: 4200,
        duration: 180,
        features: JSON.stringify([
          'Full gym access',
          'All equipment usage',
          'Locker facility',
          'Free fitness assessment',
          'Personal trainer (2 sessions)',
          '22% discount'
        ])
      },
      {
        name: '1 Year Gym',
        planType: 'GYM',
        price: 10200,
        discountPrice: 7200,
        duration: 365,
        features: JSON.stringify([
          'Full gym access',
          'All equipment usage',
          'Locker facility',
          'Free fitness assessment',
          'Personal trainer (4 sessions)',
          'Nutrition consultation',
          '29% discount - Best Value!'
        ])
      },
      {
        name: 'Lifetime Gym',
        planType: 'GYM',
        price: 30000,
        discountPrice: null,
        duration: 36500, // 100 years
        features: JSON.stringify([
          'Lifetime gym access',
          'All equipment usage',
          'Priority booking',
          'Unlimited personal training',
          'Custom meal plans',
          'Guest passes',
          'One-time payment'
        ])
      }
    ];

    // CARDIO PLANS
    const cardioPlans = [
      {
        name: '1 Month Cardio',
        planType: 'CARDIO',
        price: 500,
        discountPrice: null,
        duration: 30,
        features: JSON.stringify([
          'Cardio equipment access',
          'Treadmill, cycle, elliptical',
          'Morning & evening slots'
        ])
      },
      {
        name: '3 Months Cardio',
        planType: 'CARDIO',
        price: 1500,
        discountPrice: 1350,
        duration: 90,
        features: JSON.stringify([
          'Cardio equipment access',
          'Treadmill, cycle, elliptical',
          'Morning & evening slots',
          '10% discount'
        ])
      },
      {
        name: '6 Months Cardio',
        planType: 'CARDIO',
        price: 3000,
        discountPrice: 2400,
        duration: 180,
        features: JSON.stringify([
          'Cardio equipment access',
          'Treadmill, cycle, elliptical',
          'Morning & evening slots',
          '20% discount'
        ])
      },
      {
        name: '1 Year Cardio',
        planType: 'CARDIO',
        price: 6000,
        discountPrice: 4200,
        duration: 365,
        features: JSON.stringify([
          'Cardio equipment access',
          'Treadmill, cycle, elliptical',
          'Morning & evening slots',
          '30% discount - Best Value!'
        ])
      },
      {
        name: 'Lifetime Cardio',
        planType: 'CARDIO',
        price: 10000,
        discountPrice: null,
        duration: 36500,
        features: JSON.stringify([
          'Lifetime cardio access',
          'All cardio equipment',
          'Priority booking',
          'One-time payment'
        ])
      }
    ];

    // Create all plans
    const allPlans = [...gymPlans, ...cardioPlans];
    
    for (const plan of allPlans) {
      const existing = await prisma.membershipPlan.findFirst({
        where: { 
          name: plan.name,
          planType: plan.planType 
        }
      });

      if (existing) {
        console.log(`⏭️  Plan "${plan.name}" already exists, skipping...`);
      } else {
        await prisma.membershipPlan.create({ data: plan });
        console.log(`✅ Created plan: ${plan.name} (${plan.planType})`);
      }
    }

    console.log('\n🎉 Seeding completed successfully!');
    console.log(`📊 Total plans: ${allPlans.length}`);
    console.log(`   - Gym plans: ${gymPlans.length}`);
    console.log(`   - Cardio plans: ${cardioPlans.length}`);

  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

seedPlans();

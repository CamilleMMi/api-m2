const { connectDB } = require('../config/database');
const User = require('../models/user.model');
const Category = require('../models/category.model');
const Component = require('../models/component.model');
const Merchant = require('../models/merchant.model');
const Price = require('../models/price.model');

const seed = async () => {
  await connectDB();

  try {
    const adminEmail = 'admin@example.com';
    const existingAdmin = await User.findOne({ email: adminEmail });

    let adminUser;
    if (!existingAdmin) {
      adminUser = await User.create({
        name: 'Admin',
        email: adminEmail,
        password: 'Admin1234',
        passwordConfirm: 'Admin1234',
        role: 'admin'
      });
      console.log('✅ Admin user created');
    } else {
      adminUser = existingAdmin;
      console.log('Admin user already exists');
    }

    const categoriesData = [
      { name: 'CPU', description: 'Central Processing Units' },
      { name: 'GPU', description: 'Graphics Cards' },
      { name: 'RAM', description: 'Memory Modules' },
      { name: 'Storage', description: 'Hard Drives and SSDs' },
      { name: 'Motherboard', description: 'Mainboards' },
      { name: 'Case', description: 'Computer Cases' },
      { name: 'PowerSupply', description: 'Power Supply Units' },
      { name: 'Cooling', description: 'Cooling Solutions' }
    ];

    const categories = await Category.insertMany(categoriesData, { ordered: false }).catch(() => {});
    console.log('✅ Categories inserted or already present');

    const cpuCategory = await Category.findOne({ name: 'CPU' });

    const merchantsData = [
      {
        name: 'TechStore',
        url: 'https://techstore.com',
        apiKey: 'api-techstore-123',
        commissionRate: 5
      },
      {
        name: 'MegaParts',
        url: 'https://megaparts.com',
        apiKey: 'api-megaparts-456',
        commissionRate: 7
      }
    ];

    const merchants = await Merchant.insertMany(merchantsData, { ordered: false }).catch(() => {});
    console.log('✅ Merchants inserted or already present');

    const merchant1 = await Merchant.findOne({ name: 'TechStore' });
    const merchant2 = await Merchant.findOne({ name: 'MegaParts' });

    const componentsData = [
      {
        category: cpuCategory._id,
        brand: 'Intel',
        model: 'i9-13900K',
        title: 'Intel Core i9-13900K',
        description: '24-Core Processor with Turbo Boost',
        specifications: {
          cores: '24',
          threads: '32',
          baseClock: '3.0 GHz',
          turboClock: '5.8 GHz'
        },
        imageUrl: 'https://example.com/images/i9-13900k.jpg'
      },
      {
        category: cpuCategory._id,
        brand: 'AMD',
        model: 'Ryzen 9 7950X',
        title: 'AMD Ryzen 9 7950X',
        description: '16-Core High-Performance CPU',
        specifications: {
          cores: '16',
          threads: '32',
          baseClock: '4.5 GHz',
          turboClock: '5.7 GHz'
        },
        imageUrl: 'https://example.com/images/ryzen-7950x.jpg'
      }
    ];

    const components = await Component.insertMany(componentsData, { ordered: false }).catch(() => {});
    console.log('✅ Components inserted or already present');

    const intelCPU = await Component.findOne({ model: 'i9-13900K' });
    const amdCPU = await Component.findOne({ model: 'Ryzen 9 7950X' });

    const pricesData = [
      {
        component: intelCPU._id,
        merchant: merchant1._id,
        price: 649.99,
        url: 'https://techstore.com/products/i9-13900k'
      },
      {
        component: amdCPU._id,
        merchant: merchant2._id,
        price: 579.99,
        url: 'https://megaparts.com/products/ryzen-9-7950x'
      }
    ];

    await Price.insertMany(pricesData, { ordered: false }).catch(() => {});
    console.log('Prices inserted or already present');

    console.log('Database seeded successfully!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Error seeding data:', err.message);
    process.exit(1);
  }
};

seed();
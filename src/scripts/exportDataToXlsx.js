const xlsx = require('xlsx');
const path = require('path');
const User = require('../models/user.model');
const Category = require('../models/category.model');
const Component = require('../models/component.model');
const Merchant = require('../models/merchant.model');
const Price = require('../models/price.model');
const { connectDB } = require('../config/database');

const exportToExcel = async () => {
  await connectDB();

  try {
    const users = await User.find().lean();
    const categories = await Category.find().lean();
    const components = await Component.find().populate('category').lean();
    const merchants = await Merchant.find().lean();
    const prices = await Price.find()
      .populate('component')
      .populate('merchant')
      .lean();

    const workbook = xlsx.utils.book_new();

    const sheets = [
      { name: 'Users', data: users },
      { name: 'Categories', data: categories },
      { name: 'Components', data: components },
      { name: 'Merchants', data: merchants },
      { name: 'Prices', data: prices }
    ];

    for (const { name, data } of sheets) {
      const flatData = data.map((item) => {
        const flat = { ...item };

        for (const key in flat) {
          if (typeof flat[key] === 'object' && flat[key] !== null) {
            if (flat[key].name) flat[key] = flat[key].name;
            else if (flat[key].title) flat[key] = flat[key].title;
            else flat[key] = JSON.stringify(flat[key]);
          }
        }

        delete flat.__v;
        delete flat.password;
        delete flat.passwordConfirm;
        return flat;
      });

      const worksheet = xlsx.utils.json_to_sheet(flatData);
      xlsx.utils.book_append_sheet(workbook, worksheet, name);
    }

    const outputPath = path.join(__dirname, 'exported_data.xlsx');
    xlsx.writeFile(workbook, outputPath);
    console.log(`✅ Données exportées vers ${outputPath}`);
    process.exit(0);
  } catch (err) {
    console.error('❌ Erreur lors de l’exportation :', err);
    process.exit(1);
  }
};

exportToExcel();
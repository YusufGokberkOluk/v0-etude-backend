const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // MongoDB Atlas connection string for etudeData cluster
    await mongoose.connect(
      'mongodb+srv://yusufgoluk:pmGMF8aMZHqUpFpu@etudedatacluster.sl6layp.mongodb.net/etudeData?retryWrites=true&w=majority&appName=etudeDataCluster',
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }
    );
    console.log('MongoDB bağlantısı başarılı - etudeData cluster\'a bağlandı.');
  } catch (error) {
    console.error('MongoDB bağlantı hatası:', error);
    process.exit(1);
  }
};

module.exports = connectDB;

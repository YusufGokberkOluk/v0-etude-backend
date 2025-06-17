const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // Eski bağlantı dizesi yerine sizinkini kullanıyoruz.
    await mongoose.connect(
      'mongodb+srv://yusufgoluk:yusufgoluk04@cluster0.nqr9qs0.mongodb.net/notionKlonuDB?retryWrites=true&w=majority&appName=Cluster0',
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }
    );
    console.log('MongoDB bağlantısı başarılı.');
  } catch (error) {
    console.error('MongoDB bağlantı hatası:', error);
    process.exit(1);
  }
};

module.exports = connectDB;

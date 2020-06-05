const express = require('express')
const config = require('./config/keys.js')
const path = require('path')
const mongoose = require('mongoose')


const app = express()

app.use(express.json({ extended: true }))
app.use(function(req, res, next) {
  // res.header("Access-Control-Allow-Origin", `https://mighty-temple-51394.herokuapp.com/`);
  res.header("Access-Control-Allow-Origin", `${config.baseUrl}:3000`);
  res.header("Access-Control-Allow-Credentials", "true");
  res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT, DELETE");
  res.header("Access-Control-Allow-Headers", "Authorization, Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.use('/api/auth', require('./routes/auth.routes'))
app.use('/quizes', require('./routes/quizes.routes'))

if (process.env.NODE_ENV === 'production') {
  app.use('/', express.static(path.join(__dirname, 'client', 'build')))

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'))
  })


}

const PORT = config.port || 5000

async function start() {
  try {
    await mongoose.connect(
      config.mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true
    })
    app.listen(PORT, () => console.log(`App has been started on port ${PORT}...`))
  } catch (e) {
    console.log('Server Error', e.message)
    process.exit(1)
  }
}

start()


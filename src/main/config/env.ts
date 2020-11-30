export default {
  mongoUrl: process.env.MONGO_UL || 'mongodb://localhost:27017/clean-node-api',
  port: process.env.PORT || 5050
}

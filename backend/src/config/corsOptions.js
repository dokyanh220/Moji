export const corsOptions = {
  origin: 'http://localhost:5173',

  // CORS sẽ cho phép nhận cookies từ request
  credentials: true,

  // Some legacy browsers (IE11, various SmartTVs) choke on 204
  optionsSuccessStatus: 200
}

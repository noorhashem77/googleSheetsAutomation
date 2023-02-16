const axios = require("axios");
const { google } = require("googleapis");

const getFinancialData = async () => {
  let data = {};
  await axios
    .get(
      "https://financialmodelingprep.com/api/v3/quote-short/AAPL?apikey=5cf59be73413903184e92a05e972f494"
    )
    .then(res => {
      let date = new Date().toLocaleDateString();
      data = { date: date, price: res.data[0].price };
    });

  return data;
};

const sendDataToGoogleSheets = async () => {
  const data = await getFinancialData();
  console.log(data);

  const auth = new google.auth.GoogleAuth({
    keyFile: "google-key.json",
    scopes: "https://www.googleapis.com/auth/spreadsheets",
  });

  const client = await auth.getClient();

  const googleSheets = google.sheets({ version: "v4", auth: client });

  const spreadsheetId = "1nqgEVAjg72pImVeW_UVu1P2ZKJa0qcuyiN-WyF2Ss3s";

  await googleSheets.spreadsheets.values.append({
    auth,
    spreadsheetId,
    range: "Price!A:B",
    valueInputOption: "USER_ENTERED",
    resource: {
      values: [[data.date, data.price]],
    },
  });
};

sendDataToGoogleSheets();

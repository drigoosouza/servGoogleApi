const { google } = require("googleapis")
const express = require("express")
const cors = require("cors")
const app = express()
const PORT = 3030

app.use(cors());
app.use(express.json());




async function accessSpreadsheet() {
    const SCOPES = ['https://www.googleapis.com/auth/spreadsheets']
    const spreadsheetId = "1d9Y8mu2Net8senNsEt6HOkCLOWo_s1veKtxKSOOqrgE"
    const auth = new google.auth.GoogleAuth({
        keyFile: "credentials.json",
        scopes: SCOPES
    });
    const client = await auth.getClient();
    const googleSheets = google.sheets({
        version: 'v4',
        auth: client
    });

    return {
        auth,
        client,
        googleSheets,
        spreadsheetId
    }
};

app.post("/", async (req, res) => {

    const {name,time, number, email} = req.body
    try {
        const { googleSheets, auth, spreadsheetId } = await accessSpreadsheet();

        await googleSheets.spreadsheets.values.append({
            auth,
            spreadsheetId,
            range: "Página1",
            valueInputOption: "USER_ENTERED",
            resource: {
                values: [
                    [name, number,email, time]
                ]
            }
        });
        return res.status(200).json({
            success: true,
            message: "Dados salvos com sucesso"
        });

    } catch (erro) {
        console.log("errado " + erro)
         return res.status(500).json({
            success: false,
            message: "Erro ao salvar dados"
        });
    }
})

app.listen(PORT, () => console.log(`Servidor rodando em http://localhost:${PORT}`))
const express = require('express');
const app = express();
const sql = require('mssql');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');

app.use(cors());
app.use(bodyParser.json({ limit: '10mb' }));

const config = {
    user: 'Your DB User',
    password: 'Your DB User Pass',
    server: 'Your DB Server',
    database: 'Your DB',
    options: {
        encrypt: true
    }
};

sql.connect(config)
    .then(() => {
        app.listen(3001, () => console.log('Server is running...'));
    })
    .catch((err) => {
        console.error('Failed to connect to the database:', err);
    });

app.post('/api/images', (req, res) => {
    const imageData = req.body.imageData;
    const clientId = req.body.clientId;

    const request = new sql.Request();
    request.input('ImageData', sql.VarBinary(sql.MAX), imageData);
    request.input('ClientId', sql.UniqueIdentifier, clientId);
    request.query('UPDATE Clients SET AppLogo = @ImageData WHERE Id = @ClientId')
        .then(() => {
            res.status(200).send('Image uploaded successfully.');
        })
        .catch((err) => {
            console.error('Failed to upload image:', err);
            res.status(500).send(err);
        });
});

app.get('/api/images/:clientId', (req, res) => {
    const { clientId } = req.params;

    const request = new sql.Request();
    request.input('ClientId', sql.UniqueIdentifier, clientId);
    request.query('SELECT AppLogo FROM Clients WHERE Id = @ClientId')
        .then((result) => {
            if (!result.recordset || !result.recordset[0]) {
                return res.status(404).send('Client not found');
            }

            const imageData = result.recordset[0].AppLogo;
            const fileName = `${clientId}.png`;

            fs.writeFile(fileName, imageData, 'binary', (err) => {
                if (err) {
                    console.error('Failed to write image file:', err);
                    return res.status(500).send(err);
                }

                res.download(fileName, (err) => {
                    if (err) {
                        console.error('Failed to download image:', err);
                        return res.status(500).send(err);
                    }

                    fs.unlink(fileName, (err) => {
                        if (err) {
                            console.error('Failed to delete image file:', err);
                        }
                    });
                });
            });
        })
        .catch((err) => {
            console.error('Failed to retrieve image:', err);
            res.status(500).send(err);
        });
});

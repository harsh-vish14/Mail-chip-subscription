const express = require("express");
const body_parser = require("body-parser");
const https = require("https");
const { resolve } = require("path");
const app = express();
app.use(body_parser.urlencoded({ extended: true }));
app.get("/", (request, response) => {
    response.sendFile(__dirname + "/index.html");
});

app.post("/", function (request, response) {
    console.log(request.body);
    const email = request.body.email;
    const first_name = request.body.first_name;
    const last_name = request.body.last_name;
    const data = {
        members: [
            {
                email_address: email,
                status: "subscribed",
                merge_fields: {
                    FNAME: first_name,
                    LNAME: last_name
                }
            }
        ]
    };
    var jsonData = JSON.stringify(data);
    // console.log(jsonData);
    const url = "https://us7.api.mailchimp.com/3.0/lists/a4f4f5e5f7";
    const options = {
        method: "POST",
        auth: "harsh:cf9e47e55e25b4ef9d7ff63a9b15ec75-us7"
    };
    const requestMailChimp = https.request(url, options, function (respo) {
        respo.on("data", function (data) {
            if (JSON.parse(data).error_count == 0) {
                response.sendFile(__dirname + "/success.html");
            } else {
                response.sendFile(__dirname + "/fail.html");
            }
        })
    })

    requestMailChimp.write(jsonData);
    requestMailChimp.end();
    // console.log(response.statusCode);
});

app.listen(process.env.PORT || 3000, () => {
    console.log("server is running ");
});

// API KEY
// cf9e47e55e25b4ef9d7ff63a9b15ec75-us7

// unique id
// a4f4f5e5f7
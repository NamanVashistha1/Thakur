
const { Configuration, OpenAIApi } = require("openai");
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const { generateFile } = require("./generateFile");
const { executeCpp } = require("./executeCpp");
const vm = require('vm');
// const Tesseract = require('tesseract.js');
const fs = require('fs');
const path = require('path');

const PORT = 5000;
    

//Server
const app = express();
app.use(bodyParser.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
    return res.json({ success: "Hello World !" });
});

// Set up a route for /homepage
app.get('/homepage', (req, res) => {
    const filePath = path.join(__dirname, 'try', 'index.html');
    res.sendFile(filePath);
});
app.get('/login', (req, res) => {
    const filePath = path.join(__dirname, 'try', 'login.html');
    res.sendFile(filePath);
});
app.get('/contact', (req, res) => {
    const filePath = path.join(__dirname, 'try', 'contact.html');
    res.sendFile(filePath);
});

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'try')));



// Load questions and answers from JSON file
const data = JSON.parse(fs.readFileSync('data.json', 'utf8'));

app.post('/ask', (req, res) => {
  const { question } = req.body;
//   console.log(question);
  let answer = 'I am sorry, I do not understand the question.';

  // Find question in the data
  const entry = data.questions.find(q => q.question.toLowerCase() === question.toLowerCase());
//   console.log(entry)
  // If question found, retrieve the corresponding answer
  if (entry) {
    answer = entry.answer;
  }

  res.json({ answer });
});




//OpenAI api config
const config = new Configuration({
    apiKey: "ENTER YOUR KEY",
});

const openai = new OpenAIApi(config);

//Chatbot endpoint
app.post("/chatbot", async (req, res) => {
    //const prompt="Write a c code for armstrong number"
    const { prompt } = req.body;
    console.log(prompt);

    const response = await openai.createCompletion({
        model: "text-davinci-003",
        prompt: prompt,
        max_tokens: 2048,
        temperature: 1,     
    });
    res.send(response.data.choices[0].text);
    // console.log(response.data);

})



app.post("/analysis", async (req, res) => {
    // console.log("server hitting")
    
    const code= req.body
    const prompt  =`You will provide analysis of the provided code in C.The reponse should be strictly in the following json format only :{"time_comp": "ans","space_comp":"ans","algo_type":"ans"  } `+ code;
    console.log(prompt)
    const response = await openai.createCompletion({
        model: "text-davinci-003",
        prompt: prompt,
        max_tokens: 2048,
        temperature: 1,
    });

    const responseData = JSON.parse(response.data.choices[0].text);
    
    //res.send(response.data.choices[0].text);
    res.send(responseData)
    //console.log(responseData.algo_type);
})



//Compiler code 
app.post("/run", async (req, res) => {
    const { language, code, arguments } = req.body;

    if (language === 'cpp') {
        if (code === "") {
            return res.status(400).json({ success: false, error: "Empty code body!" });
        }
        try {
            const filepath = await generateFile(language, code, arguments);
            const output = await executeCpp(filepath);
            return res.json({ output });
        } catch (err) {
            return res.status(500).json({ error: "Internal server error", details: err });
        }
    } else if (language === 'javascript') {
        try {
            // Execute JavaScript code and capture the output
            const jsOutput = executeJavaScript(code, []);
            console.log(jsOutput);
            // console.log(jsOutput); 
            return res.json({ jsOutput });

        } catch (err) {
            return res.status(500).json({ error: "JavaScript execution error", details: err });
        }
    } else {
        // alert('Please select a language');
        return res.status(400).json({ error: "Unsupported language" });
        // }
    }
    //  else {
    //   return res.status(400).json({ error: "Unsupported language" });
    // }
});


function executeJavaScript(jsCode, args) {
    try {
        // Create a sandbox to execute JavaScript code
        const sandbox = { console, require };
        const context = new vm.createContext(sandbox);

        // Optionally, you can provide additional context variables as needed

        // Execute the JavaScript code
        const script = new vm.Script(jsCode);
        const parser = script.runInContext(context);

        // Capture the output or return value from the executed code
        // Modify this part according to your requirements
        // const capturedOutput = context.capturedOutput;

        // Create an object to store the output
        const outputObject = { output: parser };

        return outputObject;

    } catch (error) {
        throw error;
    }
}


app.listen(PORT, () => {
    console.log(`Server listening to port : ${PORT}`);
});
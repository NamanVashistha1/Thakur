const fs = require('fs');
const path = require('path');
const {v4: uuid} = require('uuid');

const dirCodes  = path.join(__dirname, 'Codes');
const textfile_dir = path.join(__dirname, 'outputs');
if(!fs.existsSync(dirCodes)){
    fs.mkdirSync(dirCodes, {recursive: true});
} 

const generateFile = async(format , content, userInput_content) => {
    // const {lang , cont} = format.body;
    // console.log(format);
    // console.log(content);

    const jobId = uuid();
    // For making file with Code
    const filename = `${jobId}.${format}`;
    const filepath = path.join(dirCodes, filename);
    await fs.writeFileSync(filepath , content);
    // For making file with User_inputs
    const text_filename = `${jobId}.txt`;
    const text_filepath = path.join(textfile_dir, text_filename);
    await fs.writeFileSync(text_filepath , userInput_content);

    return filepath;
};

module.exports = {
    generateFile,
}